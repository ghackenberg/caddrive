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
// Services
import { AudioRecorder } from '../../services/recorder'
// Contexts
import { UserContext } from '../../contexts/User'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { ProductView3D } from '../widgets/ProductView3D'
import { Column, Table } from '../widgets/Table'
// Inputs
import { TextInput } from '../inputs/TextInput'
import { ProductFooter } from '../snippets/ProductFooter'
// Images
import * as LoadIcon from '/src/images/load.png'

export const ProductIssueSettingView = (props: RouteComponentProps<{product: string, issue: string}>) => {

    const history = useHistory()
    const queryMilestoneId = new URLSearchParams(history.location.search).get('milestone') || ''

    // REFERENCES

    const textReference = useRef<HTMLTextAreaElement>()

    // CONTEXTS

    const contextUser = useContext(UserContext)

    // PARAMS

    const productId = props.match.params.product
    const issueId = props.match.params.issue

    // INITIAL STATES

    const initialProduct = productId == 'new' ? undefined : ProductManager.getProductFromCache(productId)
    const initialMembers = productId == 'new' ? undefined : MemberManager.findMembersFromCache(productId)
    const initialUsers: {[id: string]: User} = {}
    for (const member of initialMembers || []) {
        const user = UserManager.getUserFromCache(member.userId)
        if (user) {
            initialUsers[member.id] = user
        }
    } 
    const initialIssue = issueId == 'new' ? undefined : IssueManager.getIssueFromCache(issueId)
    const initialMilestones = productId == 'new' ? undefined : MilestoneManager.findMilestonesFromCache(productId)
    
    // STATES
    
    // - Entities
    const [product, setProduct] = useState<Product>(initialProduct)
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [users, setUsers] = useState<{[id: string]: User}>(initialUsers)
    const [issue, setIssue] = useState<Issue>(initialIssue)
    const [milestones, setMilstones] = useState<Milestone[]>(initialMilestones)
    // - Values
    const [label, setLabel] = useState<string>('')
    const [text, setText] = useState<string>('')
    const [audio, setAudio] = useState<Blob>()
    const [milestoneId, setMilestoneId] = useState<string>(queryMilestoneId)
    const [assigneeIds, setAssigneeIds] = useState<string[]>([])
    // - Interactions
    const [recorder, setRecorder] = useState<AudioRecorder>()
    const [marked, setMarked] = useState<Part[]>([])
    const [sidebar, setSidebar] = useState<boolean>(false)

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
        setRecorder(null)
    }

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
                const issue = await IssueManager.addIssue({ userId: contextUser.id, productId, time: new Date().toISOString(), label: label, text: text, state: 'open', assigneeIds, milestoneId: milestoneId ? milestoneId : null }, { audio })
                history.replace(`/products/${productId}/issues/${issue.id}/comments`)
            }
        } else {
            if (label && text) {
                await IssueManager.updateIssue(issue.id, { ...issue, label: label, text: text, assigneeIds,  milestoneId: milestoneId ? milestoneId : null }, { audio })
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
             ) : <a> <img src={LoadIcon} className='big load' /> </a>
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
                            <main className= {`sidebar ${sidebar ? 'visible' : 'hidden'}`}>
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
                                                    Audio:
                                                </div>
                                                <div>
                                                    {recorder ? (
                                                        <button onClick={stopRecordAudio}>Stop recording</button>
                                                    ) : (
                                                        <Fragment>
                                                            {audio ? (
                                                                <Fragment>
                                                                    <audio src={URL.createObjectURL(audio)} controls></audio>
                                                                    <button onClick={() => setAudio(null)}>Remove recording</button>
                                                                </Fragment>
                                                            ) : (
                                                                <button onClick={startRecordAudio}>Start recording</button>
                                                            )}
                                                        </Fragment>
                                                    )}
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
                            <ProductFooter sidebar={sidebar} setSidebar={setSidebar} item1={{'text':'Issue-Settings','image':'issue'}} item2={{'text':'3D-Modell','image':'part'}}></ProductFooter>
                        </Fragment>
                    ) }
                </Fragment>
            )}
        </main>
    )
}