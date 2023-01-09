import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent, useContext } from 'react'
import { Redirect, useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'

import { Comment, Issue, Milestone, Product } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { calculateActual } from '../../functions/burndown'
import { CommentManager } from '../../managers/comment'
import { IssueManager } from '../../managers/issue'
import { MilestoneManager } from '../../managers/milestone'
import { ProductManager } from '../../managers/product'
import { DateInput } from '../inputs/DateInput'
import { TextInput } from '../inputs/TextInput'
import { ProductFooter } from '../snippets/ProductFooter'
import { ProductHeader } from '../snippets/ProductHeader'
import { BurndownChartWidget } from '../widgets/BurndownChart'

export const ProductMilestoneSettingView = (props: RouteComponentProps<{ product: string, milestone: string }>) => {
    
    const { goBack, replace } = useHistory()
    
    // CONTEXTS

    const contextUser = useContext(UserContext)

    // PARAMS

    const productId = props.match.params.product
    const milestoneId = props.match.params.milestone

    // INITIAL STATES
    const initialProduct = productId == 'new' ? undefined : ProductManager.getProductFromCache(productId)
    const initialMilestone = milestoneId == 'new' ? undefined : MilestoneManager.getMilestoneFromCache(milestoneId)
    const initialIssues = milestoneId == 'new' ? undefined: IssueManager.findIssuesFromCache(productId, milestoneId)
    const initialComments: {[id: string]: Comment[]} = {}
    for (const issue of initialIssues || []) {
        initialComments[issue.id] = CommentManager.findCommentsFromCache(issue.id)
    } 
    const initialLabel = initialMilestone ? initialMilestone.label : ''
    const initialStart = initialMilestone ? new Date(initialMilestone.start) : new Date(new Date().setHours(0,0,0,0))
    const initialEnd = initialMilestone ? new Date(initialMilestone.end) : new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14)

    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>(initialProduct)
    const [milestone, setMilstone] = useState<Milestone>(initialMilestone)
    const [issues, setIssues] = useState<Issue[]>(initialIssues)
    const [comments, setComments] = useState<{[id: string]: Comment[]}>(initialComments)
    // - Values
    const [label, setLabel] = useState<string>(initialLabel)
    const [start, setStart] = useState<Date>(initialStart)
    const [end, setEnd] = useState<Date>(initialEnd)
    // - Computations
    const [total, setTotalIssueCount] = useState<number>() 
    const [actual, setActualBurndown] = useState<{ time: number, actual: number}[]>([])
    // - Interactions
    const [sidebar, setSidebar] = useState<boolean>(false)

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { milestoneId != 'new' && MilestoneManager.getMilestone(milestoneId).then(setMilstone) }, [props])
    useEffect(() => { IssueManager.findIssues(productId, milestoneId).then(setIssues) }, [props, milestoneId])

    useEffect(() => {
        if (issues) {
            Promise.all(issues.map(issue => CommentManager.findComments(issue.id))).then(issueComments => {
                const newComments = {...comments}
                for (let index = 0; index < issues.length; index++) {
                    newComments[issues[index].id] = issueComments[index]
                }
                setComments(newComments)
            })
        }
    }, [issues])
    
    // - Values
    useEffect(() => { milestone && setLabel(milestone.label) }, [milestone])
    useEffect(() => { milestone && setStart(new Date(milestone.start)) }, [milestone])
    useEffect(() => { milestone && setEnd(new Date(milestone.end)) }, [milestone])
    // - Computations
    useEffect(() => { issues && setTotalIssueCount(issues.length) }, [issues])
    useEffect(() => {
        if (milestone && issues && comments) {
            setActualBurndown(calculateActual(milestone, issues, comments))
        }
    }, [milestone, issues, comments])

    // FUNCTIONS

    async function submitMilestone(event: FormEvent){
        event.preventDefault()
        if(milestoneId == 'new') {
            await MilestoneManager.addMilestone({userId: contextUser.id, productId: productId, label: label, start: start.toISOString(), end: end.toISOString()})
            replace(`/products/${productId}/milestones/`)
        } else {
            await MilestoneManager.updateMilestone( milestone.id, { ...milestone, label: label, start: start.toISOString(), end: end.toISOString()})
            goBack()
        }
    }

    // CONSTANTS

    // RETURN

    return (
        <main className="view extended member">
            {product && (
                 <Fragment>
                    { product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className= {`sidebar ${sidebar ? 'visible' : 'hidden'}`}>
                                <div>
                                    <h1>Settings</h1>
                                    <form onSubmit={submitMilestone} onReset={goBack}>
                                            <TextInput class='fill' label='Label' placeholder='Type label' value={label} change={setLabel} required />
                                            <DateInput label='Start' placeholder='YYYY-MM-DD' value={start} change={setStart} required />
                                            <DateInput label='End' placeholder='YYYY-MM-DD' value={end} change={setEnd} required />
                                            <div>
                                                <div/>
                                                <div>
                                                    <input type='submit' value='Save'/>
                                                </div>
                                            </div>
                                    </form>
                                </div>
                                <div>
                                    <div className="widget product_view">
                                        <BurndownChartWidget start= {start} end= {end} total={total} actual={actual}/>
                                    </div>
                                </div>
                            </main>
                            <ProductFooter 
                                item1={{'text':'Milestone settings','image':'setting', 'sidebar': sidebar , 'setSidebar': setSidebar, 'set': false }} 
                                item2={{'text':'Burndown chart','image':'chart', 'sidebar': sidebar, 'setSidebar': setSidebar, 'set': true }} 
                            />
                        </Fragment>
                    )}
                 </Fragment>
            )}
        </main>
    )

}