import  * as React from 'react'
import { useState, useEffect, FormEvent } from 'react'
import { Redirect, useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'

import { Comment, Issue, Milestone, Product } from 'productboard-common'

import { calculateActual } from '../../functions/burndown'
import { CommentManager } from '../../managers/comment'
import { IssueManager } from '../../managers/issue'
import { MilestoneManager } from '../../managers/milestone'
import { ProductManager } from '../../managers/product'
import { DateInput } from '../inputs/DateInput'
import { SubmitInput } from '../inputs/SubmitInput'
import { TextInput } from '../inputs/TextInput'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { BurndownChartWidget } from '../widgets/BurndownChart'
import { LoadingView } from './Loading'

import LeftIcon from '/src/images/setting.png'
import RightIcon from '/src/images/chart.png'

export const ProductMilestoneSettingView = (props: RouteComponentProps<{ product: string, milestone: string }>) => {
    
    const { goBack, replace } = useHistory()

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
    const [active, setActive] = useState<string>('left')

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
            await MilestoneManager.addMilestone({ productId: productId, label: label, start: start.getTime(), end: end.getTime() })
            replace(`/products/${productId}/milestones/`)
        } else {
            await MilestoneManager.updateMilestone(milestone.id, { ...milestone, label: label, start: start.getTime(), end: end.getTime() })
            goBack()
        }
    }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Form view', image: LeftIcon },
        { name: 'right', text: 'Chart view', image: RightIcon }
    ]

    // RETURN

    return (
        product ? (
            product.deleted ? (
                <Redirect to='/'/>
            ) : (
                <>
                    <main className={`view product-milestone-setting sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <h1>Settings</h1>
                            <form onSubmit={submitMilestone} onReset={goBack}>
                                <TextInput label='Label' placeholder='Type label' value={label} change={setLabel} required/>
                                <DateInput label='Start' placeholder='YYYY-MM-DD' value={start} change={setStart} required/>
                                <DateInput label='End' placeholder='YYYY-MM-DD' value={end} change={setEnd} required/>
                                <SubmitInput value='Save'/>
                            </form>
                        </div>
                        <div>
                            <BurndownChartWidget start={start} end={end} total={total} actual={actual}/>
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