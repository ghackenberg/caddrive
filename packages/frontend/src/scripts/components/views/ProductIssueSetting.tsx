import  * as React from 'react'
import { useState, useEffect, useContext, useRef, FormEvent, Fragment } from 'react'
import { Redirect, useHistory } from 'react-router' 
import { Link, RouteComponentProps } from 'react-router-dom'
import { Object3D } from 'three'
// Commons
import { Issue, Product, User, Member, Version, Milestone } from 'productboard-common'
// Managers
import { UserManager } from '../../managers/user'
import { ProductManager } from '../../managers/product'
import { IssueManager } from '../../managers/issue'
import { MemberManager } from '../../managers/member'
import { MilestoneManager } from '../../managers/milestone'
// Functions
import { collectParts, Part } from '../../functions/markdown'
// Contexts
import { UserContext } from '../../contexts/User'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { ProductView3D } from '../widgets/ProductView3D'
import { Column, Table } from '../widgets/Table'
// Inputs
import { TextInput } from '../inputs/TextInput'

export const ProductIssueSettingView = (props: RouteComponentProps<{product: string, issue: string}>) => {

    const history = useHistory()

    // REFERENCES

    const textReference = useRef<HTMLTextAreaElement>()

    // CONTEXTS

    const user = useContext(UserContext)

    // PARAMS

    const productId = props.match.params.product
    const issueId = props.match.params.issue

    // STATES
    
    // - Entities
    const [product, setProduct] = useState<Product>()
    const [members, setMembers] = useState<Member[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})
    const [issue, setIssue] = useState<Issue>()
    const [milestones, setMilstones] = useState<Milestone[]>()
    // - Values
    const [label, setLabel] = useState<string>('')
    const [text, setText] = useState<string>('')
    const [milestoneId, setMilestoneId] = useState<string>()
    const [assigneeIds, setAssigneeIds] = useState<string[]>([])
    // - Interactions
    const [marked, setMarked] = useState<Part[]>([])

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { MemberManager.findMembers(productId).then(setMembers) }, [props])
    useEffect(() => { issueId != 'new' && IssueManager.getIssue(issueId).then(setIssue) }, [props])
    useEffect(() => { MilestoneManager.findMilestones(productId).then(setMilstones) }, [props]) 
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
    // - Values
    useEffect(() => { issue && setLabel(issue.label) }, [issue])
    useEffect(() => { issue && setText(issue.text) }, [issue])
    useEffect(() => { issue && setMilestoneId(issue.milestoneId)}, [issue])
    useEffect(() => { issue && setAssigneeIds(issue.assigneeIds) }, [issue])
    // - Computations
    useEffect(() => {
        const parts: Part[] = []
        collectParts(text || '', parts)
        setMarked(parts)
    }, [text])
    
    // FUNCTIONS

    async function selectObject(version: Version, object: Object3D) {
        const markdown = `[${object.name}](/products/${product.id}/versions/${version.id}/objects/${object.name})`
        if (document.activeElement == textReference.current) {
            const before = text.substring(0, textReference.current.selectionStart)
            const after = text.substring(textReference.current.selectionEnd)
            setText(`${before}${markdown}${after}`)
            setTimeout(() => {
                textReference.current.setSelectionRange(before.length + markdown.length, before.length + markdown.length)
            }, 0)
        } else {
            setText(`${text}${markdown}`)
            setTimeout(() => {
                textReference.current.focus()
            }, 0)
        }
    }

    async function submitIssue(event: FormEvent){
        event.preventDefault()
        if (issueId == 'new') {
            if (label && text) {
                const issue = await IssueManager.addIssue({ userId: user.id, productId, time: new Date().toISOString(), label: label, text: text, state: 'open', assigneeIds, milestoneId: milestoneId ? milestoneId : null })
                history.replace(`/products/${productId}/issues/${issue.id}/comments`)
            }
        } else {
            if (label && text) {
                await IssueManager.updateIssue(issue.id, { ...issue, label: label, text: text, assigneeIds,  milestoneId: milestoneId ? milestoneId : null })
                history.goBack()    
            }
        }
    }

    async function selectAssignee(userId: string) {
        const newAssignees = [...assigneeIds]
        const index = newAssignees.indexOf(userId)
        if (index == -1) {
            newAssignees.push(userId)
        } else {
            newAssignees.splice(index, 1)
        }
        setAssigneeIds(newAssignees)
    }


    // CONSTANTS

    const columns: Column<Member>[] = [
        {label: 'Picture', content: member => (
            member.id in users ? (
                <Link to={`/users/${users[member.id].id}/settings`}>
                    <img src={`/rest/files/${users[member.id].pictureId}.jpg`} className='big'/>
                </Link>
             ) : '?'
        )},
        {label: 'Member', class: 'fill left nowrap', content: member => (
            member.id in users ? (
                <Link to={`/users/${users[member.id].id}/settings`}>
                    {users[member.id].name}
                </Link>
            ) : '?'
        )},
        {label: 'Assignee', class: 'fill center nowrap', content: member => (
            <input type="checkbox" checked={assigneeIds.indexOf(member.userId) != -1} onChange={() => selectAssignee(member.userId)}/>
        )},
    ]

    // RETURN

    return (
        <main className='view extended issue'>
            { (issueId == 'new' || issue) && product && (
                <Fragment>
                    { issue && issue.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>
                                    <h1>Settings</h1>
                                        <form onSubmit={submitIssue} onReset={() => history.goBack()}>
                                            <TextInput class='fill' label='Label' placeholder='Type label' value={label} change={setLabel}/>
                                            <div>
                                                <div>
                                                    Text:
                                                </div>
                                                <div>
                                                    <textarea ref={textReference} className='fill' placeholder='Type label' value={text} onChange={event => setText(event.currentTarget.value)} required/>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    Milestone:
                                                </div>
                                                <div>
                                                    <select value={milestoneId} onChange={event => setMilestoneId(event.currentTarget.value)}>
                                                        <option >none</option>
                                                        {milestones && milestones.map((milestone) => <option key={milestone.id} value={milestone.id}>{milestone.label}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    Assignees:
                                                </div>
                                                <div>
                                                    { members && <Table columns={columns} items={members}/> }
                                                </div>
                                            </div>
                                            <div>
                                                <div/>
                                                <div>
                                                    <input type='submit' value='Save'/>
                                                </div>
                                            </div>
                                        </form>
                                </div>
                                <div>
                                    <ProductView3D product={product} marked={marked} mouse={true} click={selectObject} vr= {true}/>
                                </div>
                            </main>
                        </Fragment>
                    ) }
                </Fragment>
            )}
        </main>
    )
}