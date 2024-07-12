import  * as React from 'react'
import { useState, useEffect, useContext, FormEvent } from 'react'
import { Redirect, useLocation, useParams } from 'react-router'

import { MemberRead } from 'productboard-common'

import { IssueClient } from '../../clients/rest/issue'
import { UserContext } from '../../contexts/User'
import { useIssue, useProduct } from '../../hooks/entity'
import { useAsyncHistory } from '../../hooks/history'
import { useMembers, useMilestones } from '../../hooks/list'
import { ButtonInput } from '../inputs/ButtonInput'
import { TextInput } from '../inputs/TextInput'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { Column, Table } from '../widgets/Table'
import { ProductView3D } from '../widgets/ProductView3D'
import { ProductUserName } from '../values/ProductUserName'
import { ProductUserPicture } from '../values/ProductUserPicture'
import { LoadingView } from './Loading'

import LeftIcon from '/src/images/setting.png'
import RightIcon from '/src/images/part.png'

export const ProductIssueSettingView = () => {

    // HISTORY

    const { goBack, replace } = useAsyncHistory()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // LOCATION

    const { hash, search } = useLocation()

    // PARAMS

    const { productId, issueId } = useParams<{ productId: string, issueId: string }>()

    // ENTITIES

    const product = useProduct(productId)
    const members = useMembers(productId)
    const milestones = useMilestones(productId)
    const issue = useIssue(productId, issueId)

    // INITIAL STATES

    const initialLabel = issue ? issue.label : ''
    const initialMilestoneId = new URLSearchParams(search).get('milestone') || (issue && issue.milestoneId)
    const initialAssigneeIds = issue ? issue.assignedUserIds : []
    
    // STATES

    // - Values
    const [label, setLabel] = useState<string>(initialLabel)
    const [milestoneId, setMilestoneId] = useState<string>(initialMilestoneId)
    const [assignedUserIds, setAssignedUserIds] = useState<string[]>(initialAssigneeIds)

    // EFFECTS

    // - Values
    useEffect(() => { issue && setLabel(issue.label) }, [issue])
    useEffect(() => { issue && setMilestoneId(issue.milestoneId)}, [issue])
    useEffect(() => { issue && setAssignedUserIds(issue.assignedUserIds) }, [issue])
    
    // FUNCTIONS

    async function submitIssue(event: FormEvent){
        // TODO handle unmount!
        event.preventDefault()
        if (issueId == 'new') {
            if (label) {
                const issue = await IssueClient.addIssue(productId, { label, assignedUserIds, milestoneId: milestoneId ? milestoneId : null })
                await replace(`/products/${productId}/issues/${issue.issueId}/comments`)
            }
        } else {
            if (label) {
                await IssueClient.updateIssue(productId, issueId, { label, assignedUserIds,  milestoneId: milestoneId ? milestoneId : null })
                await goBack()    
            }
        }
    }

    async function selectAssignee(userId: string) {
        const newAssignees = [...assignedUserIds]
        const index = newAssignees.indexOf(userId)
        if (index == -1) {
            newAssignees.push(userId)
        } else {
            newAssignees.splice(index, 1)
        }
        setAssignedUserIds(newAssignees)
    }

    // CONSTANTS

    const columns: Column<MemberRead>[] = [
        { label: '👤', content: member => (
            <ProductUserPicture userId={member.userId} productId={productId} class='icon medium round'/>
        ) },
        { label: 'Name', class: 'fill left nowrap', content: member => (
            <ProductUserName userId={member.userId} productId={productId}/>
        ) },
        { label: '🛠️', class: 'fill center nowrap', content: member => (
            <input type="checkbox" checked={assignedUserIds.indexOf(member.userId) != -1} onChange={() => selectAssignee(member.userId)}/>
        ) },
    ]

    const items: ProductFooterItem[] = [
        { text: 'Form view', image: LeftIcon, hash: '' },
        { text: 'Model view', image: RightIcon, hash: '#model' }
    ]

    // RETURN

    return (
        ((issueId == 'new' || issue) && product && members) ? (
            issue && issue.deleted ? (
                <Redirect to='/'/>
            ) : (
                <>
                    <main className={`view product-issue-setting sidebar ${!hash ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='main'>
                                <h1>
                                    {issueId == 'new' ? (
                                        'New issue'
                                    ) : (
                                        `Issue settings`
                                    )}
                                </h1>
                                <form onSubmit={submitIssue} onReset={goBack}>
                                    {issue && <TextInput label='Number' value={`${issue.number}`} disabled={true}/>}
                                    <TextInput label='Label' placeholder='Type label' value={label} change={setLabel} required/>
                                    <div>
                                        <div>
                                            <label>Milestone</label>
                                        </div>
                                        <div>
                                            <select value={milestoneId || ''} onChange={event => setMilestoneId(event.currentTarget.value)} className='button fill lightgray'>
                                                <option value=''>none</option>
                                                {milestones && milestones.map((milestone) => (
                                                    <option key={milestone.milestoneId} value={milestone.milestoneId}>
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
                                        contextUser.admin || members.filter(member => member.userId == contextUser.userId).length == 1 ? (
                                            <ButtonInput value='Save'/>
                                        ) : (
                                            <ButtonInput value='Save' badge='requires role' disabled={true}/>
                                        )
                                    ) : (
                                        <ButtonInput value='Save' badge='requires login' disabled={true}/>
                                    )}
                                </form>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div>
                            <ProductView3D productId={productId} mouse={true}/>
                        </div>
                    </main>
                    <ProductFooter items={items}/>
                </>
            )
        ) : (
            <LoadingView/>
        )
    )
}