import  * as React from 'react'
import { useState, useEffect, FormEvent } from 'react'
import { Redirect, useParams } from 'react-router'

import { Comment, Issue, Milestone, Product } from 'productboard-common'

import { calculateActual } from '../../functions/burndown'
import { useAsyncHistory } from '../../hooks/history'
import { CommentManager } from '../../managers/comment'
import { IssueManager } from '../../managers/issue'
import { MilestoneManager } from '../../managers/milestone'
import { ProductManager } from '../../managers/product'
import { DateInput } from '../inputs/DateInput'
import { SubmitInput } from '../inputs/SubmitInput'
import { TextInput } from '../inputs/TextInput'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { BurndownChartWidget } from '../widgets/BurndownChart'
import { LoadingView } from './Loading'

import LeftIcon from '/src/images/setting.png'
import RightIcon from '/src/images/chart.png'

export const ProductMilestoneSettingView = () => {
    
    const { goBack, replace } = useAsyncHistory()

    // PARAMS

    const { productId, milestoneId } = useParams<{ productId: string, milestoneId: string }>()

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
    const [milestone, setMilestone] = useState<Milestone>(initialMilestone)
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
    useEffect(() => {
        let exec = true
        ProductManager.getProduct(productId).then(product => exec && setProduct(product))
        return () => { exec = false }
    }, [productId])
    useEffect(() => {
        let exec = true
        milestoneId != 'new' && MilestoneManager.getMilestone(milestoneId).then(milestone => exec && setMilestone(milestone))
        return () => { exec = false }
    }, [milestoneId])
    useEffect(() => {
        let exec = true
        IssueManager.findIssues(productId, milestoneId).then(issues => exec && setIssues(issues))
        return () => { exec = false }
    }, [productId, milestoneId])

    useEffect(() => {
        let exec = true
        if (issues) {
            Promise.all(issues.map(issue => CommentManager.findComments(issue.id))).then(issueComments => {
                if (exec) {
                    const newComments = {...comments}
                    for (let index = 0; index < issues.length; index++) {
                        newComments[issues[index].id] = issueComments[index]
                    }
                    setComments(newComments)
                }
            })
        }
        return () => { exec = false }
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
        // TODO handle unmount!
        event.preventDefault()
        if(milestoneId == 'new') {
            const milestone = await MilestoneManager.addMilestone({ productId: productId, label: label, start: start.getTime(), end: end.getTime() })
            await replace(`/products/${productId}/milestones/${milestone.id}/issues`)
        } else {
            await MilestoneManager.updateMilestone(milestone.id, { ...milestone, label: label, start: start.getTime(), end: end.getTime() })
            await goBack()
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
                            <div>
                                <h1>{milestoneId == 'new' ? 'New milestone' : 'Milestone settings'}</h1>
                                <form onSubmit={submitMilestone} onReset={goBack}>
                                    <TextInput label='Label' placeholder='Type label' value={label} change={setLabel} required/>
                                    <DateInput label='Start' placeholder='YYYY-MM-DD' value={start} change={setStart} required/>
                                    <DateInput label='End' placeholder='YYYY-MM-DD' value={end} change={setEnd} required/>
                                    <SubmitInput value='Save'/>
                                </form>
                            </div>
                            <LegalFooter/>
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