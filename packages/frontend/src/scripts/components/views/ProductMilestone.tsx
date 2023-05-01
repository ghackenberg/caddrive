import  * as React from 'react'
import { useEffect, useState, useContext } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import { Issue, Member, Milestone, Product, User } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { IssueManager } from '../../managers/issue'
import { MemberManager } from '../../managers/member'
import { MilestoneManager } from '../../managers/milestone'
import { ProductManager } from '../../managers/product'
import { UserManager } from '../../managers/user'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'
import { Column, Table } from '../widgets/Table'
import { LoadingView } from './Loading'

import LoadIcon from '/src/images/load.png'
import DeleteIcon from '/src/images/delete.png'
import LeftIcon from '/src/images/list.png'
import RightIcon from '/src/images/part.png'

export const ProductMilestoneView = (props: RouteComponentProps<{product: string}>) => {

    // PARAMS

    const productId = props.match.params.product

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // INITIAL STATES

    const initialProduct = productId == 'new' ? undefined : ProductManager.getProductFromCache(productId)
    const initialMembers = productId == 'new' ? undefined : MemberManager.findMembersFromCache(productId)
    const initialMilestones = productId == 'new' ? undefined : MilestoneManager.findMilestonesFromCache(productId)
    const initialOpenIssues: {[id: string]: Issue[]} = {}
    for (const milestone of initialMilestones || []) {
        initialOpenIssues[milestone.id] = IssueManager.findIssuesFromCache(productId, milestone.id, 'open')
    } 
    const initialClosedIssues: {[id: string]: Issue[]} = {}
    for (const milestone of initialMilestones || []) {
        initialClosedIssues[milestone.id] = IssueManager.findIssuesFromCache(productId, milestone.id, 'closed')
    } 
    const initialUsers: {[id: string]: User} = {}
    for (const milestone of initialMilestones || []) {
        initialUsers[milestone.userId] = UserManager.getUserFromCache(milestone.userId)
    }
    
    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>(initialProduct)
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)
    const [openIssues, setOpenIssues] = useState<{[id: string]: Issue[]}>(initialOpenIssues)
    const [closedIssues, setClosedIssues] = useState<{[id: string]: Issue[]}>(initialClosedIssues)
    const [users, setUsers] = useState<{[id: string]: User}>(initialUsers)
    // - Interactions
    const [active, setActive] = useState<string>('left')

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { MemberManager.findMembers(productId).then(setMembers) }, [props])
    useEffect(() => { MilestoneManager.findMilestones(productId).then(setMilestones) }, [props])
    useEffect(() => {
        if (milestones) {
            Promise.all(milestones.map(milestone => IssueManager.findIssues(productId, milestone.id,'open'))).then(issueMilestones => {
                const newMilestones = {...openIssues}
                for (let index = 0; index < milestones.length; index++) {
                    newMilestones[milestones[index].id] = issueMilestones[index]
                }
                setOpenIssues(newMilestones)
            })
        }
    }, [milestones])
    useEffect(() => {
        if (milestones) {
            Promise.all(milestones.map(milestone => IssueManager.findIssues(productId, milestone.id,'closed'))).then(issueMilestones => {
                const newMilestones = {...closedIssues}
                for (let index = 0; index < milestones.length; index++) {
                    newMilestones[milestones[index].id] = issueMilestones[index]
                }
                setClosedIssues(newMilestones)
            })
        }
    }, [milestones])
    useEffect(() => {
        if (milestones) {
            Promise.all(milestones.map(milestone => UserManager.getUser(milestone.userId))).then(milestoneUsers => {
                const newUsers = {...users}
                for (let index = 0; index < milestones.length; index++) {
                    newUsers[milestones[index].userId] = milestoneUsers[index]
                }
                setUsers(newUsers)
            })
        }
    }, [milestones])
   
    // FUNCTIONS

    async function deleteMilestone(milestone: Milestone) {
        if (confirm('Do you really want to delete this milestone?')) {
            await MilestoneManager.deleteMilestone(milestone.id)
            setMilestones(milestones.filter(other => other.id != milestone.id))       
        }
    }

    function calculateDateProgress(milestone: Milestone) {
        const start = new Date(milestone.start).getTime()
        const end = new Date(milestone.end).getTime()
        const now = Date.now()
        if (now >= start) {
            return Math.min(100 * (now - start) / (end - start), 100)
        } else {
            return 0
        }
    }

    function calculateIssueProgress(milestone: Milestone) {
        if (openIssues[milestone.id] && closedIssues[milestone.id]) {
            return 100 * closedIssues[milestone.id].length / (closedIssues[milestone.id].length + openIssues[milestone.id].length)
        } else {
            return 0
        }
    }

    // CONSTANTS

    const columns: Column<Milestone>[] = [
        { label: '👤', content: milestone => (
            <Link to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {users[milestone.userId] && members ? (
                    <ProductUserPictureWidget user={users[milestone.userId]} members={members} class='icon medium round'/>
                ) : (
                    <img src={LoadIcon} className='icon medium pad animation spin'/>
                )}
            </Link>
        ) },
        { label: 'Label', class: 'left fill', content: milestone => (
            <Link to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {milestone.label}
            </Link>
        ) },
        { label: 'Start', class: 'nowrap center', content: milestone => (
            <Link to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {new Date(milestone.start).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </Link>
        ) },
        { label: 'End', class: 'nowrap center', content: milestone => (
            <Link to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {new Date(milestone.end).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </Link>
        ) },
        { label: 'Open', class: 'center', content: milestone => (
            <Link to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {openIssues[milestone.id] ? openIssues[milestone.id].length : '?'}
            </Link>
        ) },
        { label: 'Closed', class: 'center', content: milestone => (
            <Link to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {closedIssues[milestone.id] ? closedIssues[milestone.id].length : '?'}
            </Link>
        ) },
        { label: 'Progress', class: 'center', content: milestone => (
            <>
                <div className='progress date'>
                    <div style={{width: `${calculateDateProgress(milestone)}%` }}/>
                </div>
                <div className='progress issue'>
                    <div style={{width: `${calculateIssueProgress(milestone)}%` }}/>
                </div>
            </>
        ) },
        { label: '🛠️', class: 'center', content: milestone => (
            <a onClick={() => deleteMilestone(milestone)}>
                <img src={DeleteIcon} className='icon medium pad'/>
            </a>
        ) }
    ]

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'List view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        (product && members && milestones) ? (
            product.deleted ? (
                <Redirect to='/'/>
            ) : (
                <>
                    <main className={`view product-milestone sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <div>
                                {contextUser ? (
                                    members.filter(member => member.userId == contextUser.id && member.role == 'manager').length == 1 ? (
                                        <Link to={`/products/${productId}/milestones/new/settings`} className='button fill green'>
                                            New milestone
                                        </Link>
                                    ) : (
                                        <a className='button fill green' style={{fontStyle: 'italic'}}>
                                            New milestone (requires role)
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill green' style={{fontStyle: 'italic'}}>
                                        New milestone (requires login)
                                    </a>
                                )}
                                <Table columns={columns} items={milestones}/>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div>
                            <ProductView3D product={product} mouse={true}/>
                        </div>
                    </main>
                    <ProductFooter items={items} active={active} setActive={setActive}/>
                </>
            )
        ) : (
            <LoadingView/>
        )
    )

}