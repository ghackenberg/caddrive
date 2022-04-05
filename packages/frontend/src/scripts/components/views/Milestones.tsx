import { Issue, Milestone, Product } from 'productboard-common'
import  * as React from 'react'
import { Fragment, useEffect, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { ProductManager } from '../../managers/product'
import { MilestoneManager } from '../../managers/milestone'
import { IssueManager } from '../../managers/issue'
import { ProductHeader } from '../snippets/ProductHeader'
import { ProductView3D } from '../widgets/ProductView3D'
//import { Link } from 'react-router-dom'
import { Column, Table } from '../widgets/Table'
// Images
import * as DeleteIcon from '/src/images/delete.png'
import { Link } from 'react-router-dom'


export const MilestonesView = (props: RouteComponentProps<{product: string}>) => {

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

    // CONSTANTS

    const columns: Column<Milestone>[] = [
        { label: 'Reporter', content: milestone => ( 
                <img src={`/rest/files/${milestone.userId}.jpg`} className='big'/>
        )},
        { label: 'Label', class: 'left fill', content: milestone => (
            milestone.label
        )},
        { label: 'Start', class: 'nowrap center', content: milestone => (
            milestone.start.substring(0,10)
        )},
        { label: 'End', class: 'nowrap center', content: milestone => (
            milestone.end.substring(0,10)
        )},

        { label: 'Open', class: 'center', content: milestone => (
            milestone.id in openIssues ? openIssues[milestone.id] : '?'
        )},
        { label: 'Closed', class: 'center', content: milestone => (
            milestone.id in closedIssues ? closedIssues[milestone.id] : '?'
        )},
        { label: 'Progress', class: 'center', content: milestone => (
            <div>
                <div style={{width: `${milestone.id in openIssues && milestone.id in closedIssues ? 100*closedIssues[milestone.id]/(closedIssues[milestone.id] + openIssues[milestone.id]) : 0}%` }}>
                    
                </div>
            </div>
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
                                <Link to={`/products/${productId}/milestones/new`}>
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