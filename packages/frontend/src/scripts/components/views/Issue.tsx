import  * as React from 'react'
import { useState, useEffect, useContext, createElement, FormEvent, MouseEvent, Fragment, ReactElement } from 'react'
import { Redirect, useHistory } from 'react-router' 
import { RouteComponentProps } from 'react-router-dom'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeReact from 'rehype-react'
import { Object3D } from 'three'
// Commons
import { Comment, Issue, Product, User, Member, Version } from 'productboard-common'
// Managers
import { UserManager } from '../../managers/user'
import { ProductManager } from '../../managers/product'
import { IssueManager } from '../../managers/issue'
import { CommentManager } from '../../managers/comment'
// Contexts
import { UserContext } from '../../contexts/User'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { CommentView } from '../widgets/CommentView'
import { ProductView3D } from '../widgets/ProductView3D'
import { MemberManager } from '../../managers/member'
// Inputs
import { TextInput } from '../inputs/TextInput'
import { TextareaInput } from '../inputs/TextareaInput'
import { Column, Table } from '../widgets/Table'

interface Part {
    productId: string
    versionId: string
    objectName: string
}

export const IssueView = (props: RouteComponentProps<{product: string, issue: string}>) => {

    const regex = /\/products\/(.*)\/versions\/(.*)\/objects\/(.*)/

    const productId = props.match.params.product
    const issueId = props.match.params.issue

    const history = useHistory()

    const user = useContext(UserContext)

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [issue, setIssue] = useState<Issue>()
    const [comments, setComments] = useState<Comment[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})

    // Define values
    const [issueLabel, setIssueLabel] = useState<string>('')
    const [issueText, setIssueText] = useState<string>('')
    const [commentText, setCommentText] = useState<string>('')
    const [members, setMember] = useState<Member[]>()
    const [assignees, setAssignees] = useState<string[]>([])

    // Define aggregates
    const [issueHtml, setIssueHtml] = useState<ReactElement>()
    const [issueParts, setIssueParts] = useState<Part[]>([])
    const [commentsHtml, setCommentsHtml] = useState<{[id: string]: ReactElement}>({})
    const [commentsParts, setCommentsParts] = useState<{[id: string]: Part[]}>({})
    const [highlighted, setHighlighted] = useState<Part[]>()
    const [selected, setSelected] = useState<Part[]>()

    // Load entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { MemberManager.findMembers(productId).then(setMember) }, [props])
    useEffect(() => { issueId != 'new' && IssueManager.getIssue(issueId).then(setIssue) }, [props])
    useEffect(() => { issueId != 'new' && CommentManager.findComments(issueId).then(setComments) }, [props])
    useEffect(() => {
        if (members) {
            Promise.all(members.map(member => UserManager.getUser(member.userId))).then(memberUsers => {
                const newUsers = {...users}
                for (var index = 0; index < members.length; index++) {
                    newUsers[members[index].id] = memberUsers[index]
                }
                setUsers(newUsers)
            })
        }
    }, [members])
    useEffect(() => {
        const userIds: string[] = []
        if (issue) {
            if (!(issue.userId in users) && userIds.indexOf(issue.userId) == -1) {
                userIds.push(issue.userId)
            }
        }
        if (comments) {
            for (const comment of comments) {
                if (!(comment.userId in users) && userIds.indexOf(comment.userId) == -1) {
                    userIds.push(comment.userId)
                }
            }
        }
        Promise.all(userIds.map(userId => UserManager.getUser(userId))).then(userList => {
            const dict = {...users}
            for (const user of userList) {
                dict[user.id] = user
            }
            setUsers(dict)
        })
    }, [issue, comments])
    useEffect(() => {
        if (issue) {
            const parts: Part[] = []
            setIssueHtml(createProcessor(parts).processSync(issue.text).result)
            setIssueParts(parts)
        }
    }, [issue])
    useEffect(() => {
        if (comments) {
            const commentsHtml: {[id: string]: ReactElement} = {}
            const commentsParts: {[id: string]: Part[]} = {}
            for (const comment of comments) {
                const parts: Part[] = []
                commentsHtml[comment.id] = createProcessor(parts).processSync(comment.text).result
                commentsParts[comment.id] = parts
            }
            setCommentsHtml(commentsHtml)
            setCommentsParts(commentsParts)
        }
    }, [comments])
    useEffect(() => {
        const highlighted: Part[] = []
        if (issueParts) {
            for (const part of issueParts) {
                highlighted.push(part)
            }
        }
        if (comments && commentsParts) {
            for (const comment of comments) {
                if (comment.id in commentsParts) {
                    for (const part of commentsParts[comment.id]) {
                        highlighted.push(part)
                    }
                }
            }
        }
        setHighlighted(highlighted)
    }, [issueParts, commentsParts])

    // Load values
    useEffect(() => { issue && setIssueLabel(issue.label) }, [issue])
    useEffect(() => { issue && setIssueText(issue.text) }, [issue])

    function handleMouseOver(event: MouseEvent<HTMLAnchorElement>, part: Part) {
        event.preventDefault()
        setSelected([part])
    }
    function handleMouseOut(event: MouseEvent<HTMLAnchorElement>, _part: Part) {
        event.preventDefault()
        setSelected(undefined)
    }
    function handleClick(event: MouseEvent<HTMLAnchorElement>, part: Part) {
        event.preventDefault()
        console.log('click', part)
    }

    function createProcessor(parts: Part[]) {
        return unified().use(remarkParse).use(remarkRehype).use(rehypeReact, {
            createElement, components: {
                a: (props: any) => {
                    const match = regex.exec(props.href || '')
                    if (match) {
                        const productId = match[1]
                        const versionId = match[2]
                        const objectName = match[3]
                        const part = { productId, versionId, objectName }
                        parts.push(part)
                        return <a {...props} onMouseOver={event => handleMouseOver(event, part)} onMouseOut={event => handleMouseOut(event, part)} onClick={event => handleClick(event, part)}/>
                    } else {
                        return <a {...props}/>
                    }
                }
            }
        })
    }

    async function selectObject(version: Version, object: Object3D) {
        if (issueId == 'new') {
            setIssueText(`${issueText}[${object.name}](/products/${product.id}/versions/${version.id}/objects/${object.name})`)
        } else {
            setCommentText(`${commentText}[${object.name}](/products/${product.id}/versions/${version.id}/objects/${object.name})`)
        }
    }

    async function submitIssue(event: FormEvent){
        event.preventDefault()
        if (issueId == 'new') {
            if (issueLabel && issueText) {
                const issue = await IssueManager.addIssue({ userId: user.id, productId, time: new Date().toISOString(), label: issueLabel, text: issueText, state: 'open', assigneeIds: assignees })
                history.replace(`/products/${productId}/issues/${issue.id}`)
            }
        } else {
            if (issueLabel && issueText) {
                setIssue(await IssueManager.updateIssue(issue.id, { ...issue, label: issueLabel, text: issueText }))
            }
        }
    }

    async function submitComment(event: FormEvent) {
        event.preventDefault()
        if (commentText) {
            const comment = await CommentManager.addComment({ userId: user.id, issueId: issue.id, time: new Date().toISOString(), text: commentText, action: 'none' })
            setComments([...comments, comment])
            setCommentText('')
        }
    }

    async function submitCommentAndClose(event: FormEvent) {
        event.preventDefault()
        if (commentText) {
            const comment = await CommentManager.addComment({ userId: user.id, issueId: issue.id, time: new Date().toISOString(), text: commentText, action: 'close' })
            setComments([...comments, comment])
            setCommentText('')
            setIssue(await IssueManager.updateIssue(issueId, { label: issue.label, text: issue.text, state: 'closed', assigneeIds: issue.assigneeIds }))
        }
    }

    async function submitCommentAndReopen(event: FormEvent) {
        event.preventDefault()
        if (commentText) {
            const comment = await CommentManager.addComment({ userId: user.id, issueId: issue.id, time: new Date().toISOString(), text: commentText, action: 'reopen' })
            setComments([...comments, comment])
            setCommentText('')
            setIssue(await IssueManager.updateIssue(issueId, { label: issue.label, text: issue.text, state: 'open', assigneeIds: issue.assigneeIds }))
        }
    }

    async function selectAssignee(_userID: string) {
        const newAssignees = [...assignees]
        const index = newAssignees.indexOf(_userID)
        if (index == -1) {
            newAssignees.push(_userID)
        } else {
            newAssignees.splice(index, 1)
        }
        setAssignees(newAssignees)
    }

    const columns: Column<Member>[] = [
        {label: 'Picture', content: member => member.id in users ? <img src={`/rest/files/${users[member.id].pictureId}.jpg`} className='big' /> : '?'},
        {label: 'Member', class: 'fill left nowrap', content: member => <p>{member.id in users ? users[member.id].name : '?'}</p>},
        {label: 'Assignee', class: 'fill center nowrap', content: member => <input type="checkbox" checked={assignees.indexOf(member.userId) != -1} onChange={() => selectAssignee(member.userId)} ></input>},
    ]


    return (
        <main className='view extended audit'>
            { (issueId == 'new' || issue) && product && (
                <Fragment>
                    { issue && issue.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>
                                    {issue ? (
                                        <Fragment>
                                            <h1>
                                                {issue.label}
                                            </h1>
                                            <p>
                                                <span className={`state ${issue.state}`}>{issue.state}</span> <strong>{issue.userId in users && users[issue.userId].name}</strong> opened issue on {issue.time.substring(0, 10)}
                                            </p>
                                            <div className="widget thread">
                                                <CommentView class="issue" comment={issue} user={users[issue.userId]} html={issueHtml} parts={issueParts} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick}/>
                                                {comments && comments.map(comment => (
                                                    <CommentView key={comment.id} class="comment" comment={comment} user={users[comment.userId]} html={commentsHtml[comment.id]} parts={commentsParts[comment.id]} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick}/>
                                                ))}
                                                <div className="comment self">
                                                    <div className="head">
                                                        <div className="icon">
                                                            <a href={`/users/${user.id}`}>
                                                                <img src={`/rest/files/${user.id}.jpg`}/>
                                                            </a>
                                                        </div>
                                                        <div className="text">
                                                            <p>
                                                                <strong>New comment</strong>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="body">
                                                        <div className="free">

                                                        </div>
                                                        <div className="text">
                                                            <textarea placeholder={'Type text'} value={commentText} onChange={event => setCommentText(event.currentTarget.value)}/>
                                                            <button onClick={submitComment}>Save</button>
                                                            {issue.state == 'open' ? (
                                                                <button onClick={submitCommentAndClose}>Close</button>
                                                             ) : (
                                                                <button onClick={submitCommentAndReopen}>Reopen</button>
                                                             )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                            <h1>Settings</h1>
                                            <form onSubmit={submitIssue} onReset={() => history.goBack()}>
                                                <TextInput class='fill' label='Label' placeholder='Type label' value={issueLabel} change={setIssueLabel}/>
                                                <TextareaInput class='fill' label='Text' placeholder='Type text' value={issueText} change={setIssueText}/>
                                                <div>
                                                    <div/>
                                                    <div>
                                                    <div>
                                                    { members && <Table columns={columns} items={members}/> }
                                                    </div>
                                                        <input type='submit' value='Save'/>
                                                    </div>
                                                </div>
                                            </form>
                                        </Fragment>
                                    )}
                                </div>
                                <div>
                                    <ProductView3D product={product} mouse={true} highlighted={highlighted} selected={selected} click={selectObject} vr= {true}/>
                                </div>
                            </main>
                        </Fragment>
                    ) }
                </Fragment>
            )}
        </main>
    )
}