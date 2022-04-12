import  * as React from 'react'
import { Fragment, useEffect, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
// Commons
import { Issue, Milestone, Product } from 'productboard-common'
// Managers
import { ProductManager } from '../../managers/product'
import { MilestoneManager } from '../../managers/milestone'
import { IssueManager } from '../../managers/issue'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { ProductView3D } from '../widgets/ProductView3D'
import { Column, Table } from '../widgets/Table'
// Images
import * as DeleteIcon from '/src/images/delete.png'

export const ProductMilestoneView = (props: RouteComponentProps<{product: string}>) => {

    // PARAMS

    const productId = props.match.params.product
   
    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>()
    const [milestones, setMilestones] = useState<Milestone[]>()
    const [issues, setIssues] = useState<Issue[]>()
    const [openIssues, setOpenIssues] = useState<{[id: string]: number}>({})
    const [closedIssues, setClosedIssues] = useState<{[id: string]: number}>({})

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { MilestoneManager.findMilestones(productId).then(setMilestones) }, [props])
    useEffect(() => { IssueManager.findIssues(productId).then(setIssues)}, [props])
    useEffect(() => {
        if (issues) {
            Promise.all(milestones.map(milestone => IssueManager.findIssues(productId, milestone.id,'open'))).then(issueMilestones => {
                const newMilestones = {...openIssues}
                for (var index = 0; index < milestones.length; index++) {
                    newMilestones[milestones[index].id] = issueMilestones[index].length
                }
                setOpenIssues(newMilestones)
            })
        }
    }, [issues])
    useEffect(() => {
        if (issues) {
            Promise.all(milestones.map(milestone => IssueManager.findIssues(productId, milestone.id,'closed'))).then(issueMilestones => {
                const newMilestones = {...closedIssues}
                for (var index = 0; index < milestones.length; index++) {
                    newMilestones[milestones[index].id] = issueMilestones[index].length
                }
                setClosedIssues(newMilestones)
            })
        }
    }, [issues])
   
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
        if (milestone.id in openIssues && milestone.id in closedIssues) {
            return 100 * closedIssues[milestone.id] / (closedIssues[milestone.id] + openIssues[milestone.id])
        } else {
            return 0
        }
    }

    // CONSTANTS

    const columns: Column<Milestone>[] = [
        { label: 'Reporter', content: milestone => ( 
            <img src={`/rest/files/${milestone.userId}.jpg`} className='big'/>
        )},
        { label: 'Label', class: 'left fill', content: milestone => (
            <Link to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {milestone.label}
            </Link>
        )},
        { label: 'Start', class: 'nowrap center', content: milestone => (
            <Link to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {new Date(milestone.start).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </Link>
        )},
        { label: 'End', class: 'nowrap center', content: milestone => (
            <Link to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {new Date(milestone.end).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </Link>
        )},
        { label: 'Open', class: 'center', content: milestone => (
            <Link to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {milestone.id in openIssues ? openIssues[milestone.id] : '?'}
            </Link>
        )},
        { label: 'Closed', class: 'center', content: milestone => (
            <Link to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {milestone.id in closedIssues ? closedIssues[milestone.id] : '?'}
            </Link>
        )},
        { label: 'Progress', class: 'center', content: milestone => (
            <Fragment>
                <div className='date'>
                    <div style={{width: `${calculateDateProgress(milestone)}%` }}/>
                </div>
                <div className='issue'>
                    <div style={{width: `${calculateIssueProgress(milestone)}%` }}/>
                </div>
            </Fragment>
        )},
        { label: '', class: 'center', content: milestone => (
            <a onClick={() => deleteMilestone(milestone)}>
                <img src={DeleteIcon} className='small'/>
            </a>
        )}
    ]

    // RETURN

    return (
        <main className="view extended milestones">
            { product && (
                 <Fragment>
                    { product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>           
                                <Link to={`/products/${productId}/milestones/new/settings`}>
                                        New milestone
                                </Link>
                                   { milestones && <Table columns={columns} items={milestones}/> }
                                </div>
                                <div>
                                    <ProductView3D product={product} mouse={true} vr= {true}/>
                                </div>
                            </main>
                        </Fragment>
                    )}
                 </Fragment>  
            )}
        </main>
    )

}