import  * as React from 'react'
import { useState, useEffect, useContext, useRef, FormEvent, Fragment } from 'react'
import { Redirect, useHistory } from 'react-router' 
import { RouteComponentProps } from 'react-router-dom'

import { Object3D } from 'three'

import { Issue, Product, User, Member, Version, Milestone } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { collectParts, Part } from '../../functions/markdown'
import { computePath } from '../../functions/path'
import { SubmitInput } from '../inputs/SubmitInput'
import { TextInput } from '../inputs/TextInput'
import { UserManager } from '../../managers/user'
import { ProductManager } from '../../managers/product'
import { IssueManager } from '../../managers/issue'
import { MemberManager } from '../../managers/member'
import { MilestoneManager } from '../../managers/milestone'
import { AudioRecorder } from '../../services/recorder'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductHeader } from '../snippets/ProductHeader'
import { Column, Table } from '../widgets/Table'
import { ProductView3D } from '../widgets/ProductView3D'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'

import * as LoadIcon from '/src/images/load.png'
import * as LeftIcon from '/src/images/setting.png'
import * as RightIcon from '/src/images/part.png'

export const ProductIssueSettingView = (props: RouteComponentProps<{product: string, issue: string}>) => {

    const { goBack, replace, location } = useHistory()

    // REFERENCES

    const textReference = useRef<HTMLTextAreaElement>()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // PARAMS

    const productId = props.match.params.product
    const issueId = props.match.params.issue

    // INITIAL STATES

    const initialProduct = productId == 'new' ? undefined : ProductManager.getProductFromCache(productId)
    const initialMembers = productId == 'new' ? [] : MemberManager.findMembersFromCache(productId)
    const initialUsers: {[id: string]: User} = {}
    for (const member of initialMembers || []) {
        const user = UserManager.getUserFromCache(member.userId)
        if (user) {
            initialUsers[member.id] = user
        }
    } 
    const initialIssue = issueId == 'new' ? undefined : IssueManager.getIssueFromCache(issueId)
    const initialMilestones = productId == 'new' ? undefined : MilestoneManager.findMilestonesFromCache(productId)

    const initialLabel = initialIssue ? initialIssue.name : ''
    const initialText = initialIssue ? initialIssue.description : ''
    const initialMilestoneId = new URLSearchParams(location.search).get('milestone') || (initialIssue && initialIssue.milestoneId)
    const initialAssigneeIds = initialIssue ? initialIssue.assigneeIds : []

    const initialMarked: Part[] = []
    collectParts(initialText, initialMarked)
    
    // STATES
    
    // - Entities
    const [product, setProduct] = useState<Product>(initialProduct)
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [users, setUsers] = useState<{[id: string]: User}>(initialUsers)
    const [issue, setIssue] = useState<Issue>(initialIssue)
    const [milestones, setMilstones] = useState<Milestone[]>(initialMilestones)
    // - Values
    const [label, setLabel] = useState<string>(initialLabel)
    const [text, setText] = useState<string>(initialText)
    const [audio, setAudio] = useState<Blob>()
    const [milestoneId, setMilestoneId] = useState<string>(initialMilestoneId)
    const [assigneeIds, setAssigneeIds] = useState<string[]>(initialAssigneeIds)
    // - Interactions
    const [recorder, setRecorder] = useState<AudioRecorder>()
    const [audioUrl, setAudioUrl] = useState<string>('')
    const [selected, setSelected] = useState<Part[]>([])
    const [marked, setMarked] = useState<Part[]>(initialMarked)
    const [active, setActive] = useState<string>('left')

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
                for (let index = 0; index < members.length; index++) {
                    newUsers[members[index].id] = memberUsers[index]
                }
                setUsers(newUsers)
            })
        }
    }, [members])
    // - Values
    useEffect(() => { issue && setLabel(issue.name) }, [issue])
    useEffect(() => { issue && setText(issue.description) }, [issue])
    useEffect(() => { issue && setMilestoneId(issue.milestoneId)}, [issue])
    useEffect(() => { issue && setAssigneeIds(issue.assigneeIds) }, [issue])
    // - Computations
    useEffect(() => {
        const parts: Part[] = []
        collectParts(text || '', parts)
        setMarked(parts)
    }, [text])
    
    // FUNCTIONS

    async function startRecordAudio(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        const recorder = new AudioRecorder()
        await recorder.start()
        setRecorder(recorder)
    }

    async function stopRecordAudio(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        const data = await recorder.stop()
        setAudio(data)
        setAudioUrl(URL.createObjectURL(data))
        setRecorder(null)
    }

    async function removeAudio(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setAudio(null)
        setAudioUrl('')
    }

    function overObject(version: Version, object: Object3D) {
        const path = computePath(object)
        setSelected([{ productId: version.productId, versionId: version.id, objectPath: path, objectName: object.name }])
    }
    
    function outObject() {
        setSelected([])
    }

    function selectObject(version: Version, object: Object3D) {
        const path = computePath(object)
        const markdown = `[${object.name || object.type}](/products/${product.id}/versions/${version.id}/objects/${path})`
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
                const issue = await IssueManager.addIssue({ userId: contextUser.id, productId, time: new Date().toISOString(), name: label, description: text, state: 'open', assigneeIds, milestoneId: milestoneId ? milestoneId : null }, { audio })
                replace(`/products/${productId}/issues/${issue.id}/comments`)
            }
        } else {
            if (label && text) {
                await IssueManager.updateIssue(issue.id, { ...issue, name: label, description: text, assigneeIds,  milestoneId: milestoneId ? milestoneId : null }, { audio })
                goBack()    
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
        { label: '👤', content: member => (
            member.id in users ? (
                <ProductUserPictureWidget user={users[member.id]} members={members} class='icon medium round'/>
            ) : (
                <img src={LoadIcon} className='icon mediumn pad animation spin'/>
            )
        ) },
        { label: 'Name', class: 'fill left nowrap', content: member => (
            member.id in users ? (
                users[member.id].name
            ) : '?'
        ) },
        { label: '🛠️', class: 'fill center nowrap', content: member => (
            <input type="checkbox" checked={assigneeIds.indexOf(member.userId) != -1} onChange={() => selectAssignee(member.userId)}/>
        ) },
    ]

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Form view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        <main className='view extended product-issue-setting'>
            {(issueId == 'new' || issue) && product && members && (
                <Fragment>
                    {issue && issue.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className={`sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                                <div>
                                    <h1>Settings</h1>
                                    <form onSubmit={submitIssue} onReset={goBack}>
                                        <TextInput label='Label' placeholder='Type label' value={label} change={setLabel} required/>
                                        <div>
                                            <div>
                                                <label>Text</label>
                                            </div>
                                            <div>
                                                <textarea ref={textReference} className='button fill lightgray' placeholder='Type label' value={text} onChange={event => setText(event.currentTarget.value)} required/>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <label>Audio</label>
                                            </div>
                                            <div>
                                                {recorder ? (
                                                    <input type='button' value='Stop recording' onClick={stopRecordAudio} className='button fill gray'/>
                                                ) : (
                                                    audio ? (
                                                        <>
                                                            <audio src={audioUrl} controls/>
                                                            <input type='button' value='Remove recording' onClick={removeAudio} className='button fill gray'/>
                                                        </>
                                                    ) : (
                                                        <input type='button' value='Start recording' onClick={startRecordAudio} className='button fill gray'/>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <label>Milestone</label>
                                            </div>
                                            <div>
                                                <select value={milestoneId || ''} onChange={event => setMilestoneId(event.currentTarget.value)} className='button fill lightgray'>
                                                    <option >none</option>
                                                    {milestones && milestones.map((milestone) => (
                                                        <option key={milestone.id} value={milestone.id}>
                                                            {milestone.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <label>Assignees</label>
                                            </div>
                                            <div>
                                                {members && (
                                                    <Table columns={columns} items={members}/>
                                                )}
                                            </div>
                                        </div>
                                        {contextUser ? (
                                            members.filter(member => member.userId == contextUser.id).length == 1 ? (
                                                <SubmitInput value='Save'/>
                                            ) : (
                                                <SubmitInput value='Save (requires role)' disabled={true}/>
                                            )
                                        ) : (
                                            <SubmitInput value='Save (requires login)' disabled={true}/>
                                        )}
                                    </form>
                                </div>
                                <div>
                                    <ProductView3D product={product} selected={selected} marked={marked} mouse={true} over={overObject} out={outObject} click={selectObject}/>
                                </div>
                            </main>
                            <ProductFooter items={items} active={active} setActive={setActive}/>
                        </Fragment>
                    ) }
                </Fragment>
            )}
        </main>
    )
}