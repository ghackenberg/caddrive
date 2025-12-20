import { FormEvent, useContext, useEffect, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router'
import { MilestoneClient } from '../../clients/rest/milestone.js'
import { UserContext } from '../../contexts/User.js'
import { calculateActual } from '../../functions/burndown.js'
import { back, replace } from '../../functions/history.js'
import { useMilestone, useProduct } from '../../hooks/entity.js'
import { useIssues, useMembers } from '../../hooks/list.js'
import { useIssuesComments } from '../../hooks/map.js'
import { ButtonInput } from '../inputs/ButtonInput.js'
import { DateInput } from '../inputs/DateInput.js'
import { GenericInput } from '../inputs/GenericInput.js'
import { TextInput } from '../inputs/TextInput.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter.js'
import { BurndownChartWidget } from '../widgets/BurndownChart.js'
import { LoadingView } from './Loading.js'
import RightIcon from '/src/images/chart.png'
import LeftIcon from '/src/images/setting.png'

export const ProductMilestoneSettingView = () => {

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // LOCATION

    const { hash } = useLocation()

    // PARAMS

    const { productId, milestoneId } = useParams<{ productId: string, milestoneId: string }>()

    // ENTITIES

    const product = useProduct(productId)
    const members = useMembers(productId)
    const milestone = useMilestone(productId, milestoneId)
    const issues = useIssues(productId, milestoneId)
    const comments = useIssuesComments(productId, milestoneId)

    // INITIAL STATES

    const initialLabel = milestone ? milestone.label : ''
    const initialStart = milestone ? new Date(milestone.start) : new Date()
    const initialEnd = milestone ? new Date(milestone.end) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)

    const initialTotal = issues && issues.length
    const initialActual = milestone && issues && comments && calculateActual(milestone.start, milestone.end, issues, comments)

    // STATES

    // - Values
    
    const [label, setLabel] = useState<string>(initialLabel)
    const [start, setStart] = useState<Date>(initialStart)
    const [end, setEnd] = useState<Date>(initialEnd)

    // - Computations

    const [total, setTotalIssueCount] = useState(initialTotal) 
    const [actual, setActualBurndown] = useState(initialActual)

    // EFFECTS
    
    // - Values

    useEffect(() => { milestone && setLabel(milestone.label) }, [milestone])
    useEffect(() => { milestone && setStart(new Date(milestone.start)) }, [milestone])
    useEffect(() => { milestone && setEnd(new Date(milestone.end)) }, [milestone])

    // - Computations

    useEffect(() => {
        function updateActualBurndown() {
            setActualBurndown(milestone && issues && comments && calculateActual(start.getTime(), end.getTime(), issues, comments))
        }
        let interval: NodeJS.Timeout
        const timeout = setTimeout(() => {
            interval = setInterval(updateActualBurndown, 1000)
            updateActualBurndown()
        }, 1000 - Date.now() % 1000)
        return () => {
            clearTimeout(timeout)
            interval && clearInterval(interval)
        }
    })
    
    useEffect(() => {
        if (issues) {
            setTotalIssueCount(issues.length)
        } else {
            setTotalIssueCount(undefined)
        }
    }, [issues])

    useEffect(() => {
        if (milestone && issues && comments) {
            setActualBurndown(calculateActual(start.getTime(), end.getTime(), issues, comments))
        } else {
            setActualBurndown(undefined)
        }
    }, [start, end, issues, comments])

    // FUNCTIONS

    async function submitMilestone(event: FormEvent){
        // TODO handle unmount!
        event.preventDefault()
        if (start.getTime() > end.getTime()) {
            alert('Start must be before end!')
        } else {
            if(milestoneId == 'new') {
                const milestone = await MilestoneClient.addMilestone(productId, { label, start: start.getTime(), end: end.getTime() })
                await replace(`/products/${productId}/milestones/${milestone.milestoneId}/issues`)
            } else {
                await MilestoneClient.updateMilestone(productId, milestoneId, { label, start: start.getTime(), end: end.getTime() })
                await back()
            }
        }
    }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { text: 'Form view', image: LeftIcon, hash: '' },
        { text: 'Chart view', image: RightIcon, hash: '#chart' }
    ]

    // RETURN

    return (
        product ? (
            product.deleted ? (
                <Navigate to='/'/>
            ) : (
                <>
                    <main className={`view product-milestone-setting sidebar ${!hash ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='main'>
                                <h1>
                                    {milestoneId == 'new' ? (
                                        'New milestone'
                                    ) : (
                                        'Milestone settings'
                                    )}
                                </h1>
                                <form onSubmit={submitMilestone} onReset={back}>
                                    <TextInput label='Label' placeholder='Type label' value={label} change={setLabel} required/>
                                    <DateInput label='Start' placeholder='YYYY-MM-DD' value={start} change={setStart} required/>
                                    <DateInput label='End' placeholder='YYYY-MM-DD' value={end} change={setEnd} required/>
                                    {start >= end &&
                                        <GenericInput>
                                            <span style={{color: 'red'}}>Start must be before end!</span>
                                        </GenericInput>
                                    }
                                    {contextUser ? (
                                        contextUser.admin || members.filter(member => member.userId == contextUser.userId && member.role == 'manager').length == 1 ? (
                                            <ButtonInput value='Save' disabled={start >= end}/>
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
                            <BurndownChartWidget start={start.getTime()} end={end.getTime()} total={total} actual={actual}/>
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