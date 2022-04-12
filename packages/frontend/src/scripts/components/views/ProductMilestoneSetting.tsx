import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Redirect, useHistory } from 'react-router'
// Commons
import { Milestone, Product } from 'productboard-common'
// Contexts
import { UserContext } from '../../contexts/User'
// Managers
import { ProductManager } from '../../managers/product'
import { MilestoneManager } from '../../managers/milestone'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { TextInput } from '../inputs/TextInput'
import { DateInput } from '../inputs/DateInput'
import { BurndownChartWidget } from '../widgets/BurndownChart'

export const ProductMilestoneSettingView = (props: RouteComponentProps<{ product: string, milestone: string }>) => {
    
    const history = useHistory()
    
    // CONTEXTS

    const user = useContext(UserContext)

    // PARAMS

    const productId = props.match.params.product
    const milestoneId = props.match.params.milestone
 
    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>()
    const [milestone, setMilstone] = useState<Milestone>()
    // - Values
    const [label, setLabel] = useState<string>('')
    const [start, setStart] = useState<Date>(new Date(new Date().setHours(0,0,0,0)))
    const [end, setEnd] = useState<Date>(new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14))
    // - Simulations
    const [total, setTotalIssueCount] = useState<number>() 
    const [actual, setActualBurndown] = useState<{ time: number, actual: number}[]>([])
   
    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { milestoneId != 'new' && MilestoneManager.getMilestone(milestoneId).then(setMilstone) }, [props])
    // - Values
    useEffect(() => { milestone && setLabel(milestone.label) }, [milestone])
    useEffect(() => { milestone && setStart(new Date(milestone.start)) }, [milestone])
    useEffect(() => { milestone && setEnd(new Date(milestone.end)) }, [milestone])
    // - Simulations
    useEffect(() => { setTotalIssueCount(10) }, [])
    useEffect(() => {
        const actual: { time: number, actual: number }[] = []
        actual.push({ time: Date.now() + 1000 * 60 * 60 * 24 * 0, actual: 10 })
        actual.push({ time: Date.now() + 1000 * 60 * 60 * 24 * 1, actual: 9 })
        actual.push({ time: Date.now() + 1000 * 60 * 60 * 24 * 4, actual: 7 })
        setActualBurndown(actual)
    }, [])

    // FUNCTIONS

    async function submitMilestone(event: FormEvent){
        event.preventDefault()
        if(milestoneId == 'new') {
            await MilestoneManager.addMilestone({userId: user.id, productId: productId, label: label, start: start.toISOString(), end: end.toISOString()})
            history.replace(`/products/${productId}/milestones/`)
        } else {
            console.log("update Milestone")
            await MilestoneManager.updateMilestone( milestone.id, { ...milestone, label: label, start: start.toISOString(), end: end.toISOString()})
            history.goBack()
        }
    }

    // CONSTANTS

    // RETURN

    return (
        <main className="view extended member">
            { product && (
                 <Fragment>
                    { product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>
                                    <h1>Settings</h1>
                                    <form onSubmit={submitMilestone} onReset={() => history.goBack()}>
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
                                <div style={{padding: '1em', backgroundColor: 'rgb(215,215,215)'}}>
                                    <BurndownChartWidget start={start} end={end} total={total} actual={actual}/>
                                </div>
                            </main>
                        </Fragment>
                    )}
                 </Fragment>
            )}
        </main>
    )

}