import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Redirect, useHistory } from 'react-router'
// Commons
import { Milestone, Product } from 'productboard-common'
// Managers
import { ProductManager } from '../../managers/product'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { ProductView3D } from '../widgets/ProductView3D'
import { TextInput } from '../inputs/TextInput'
import { UserContext } from '../../contexts/User'
import { MilestoneManager } from '../../managers/milestone'
import { DateInput } from '../inputs/DateInput'


export const MilestoneView = (props: RouteComponentProps<{ product: string, milestone: string }>) => {
    
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
    const [start, setStart] = useState<Date>(new Date())
    const [end, setEnd] = useState<Date>(new Date())
   
    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { milestoneId != 'new' && MilestoneManager.getMilestone(milestoneId).then(setMilstone) }, [props])
    // - Values
    useEffect(() => { milestone && setLabel(milestone.label) }, [milestone])
    useEffect(() => { milestone && setStart(new Date(milestone.start)) }, [milestone])
    useEffect(() => { milestone && setEnd(new Date(milestone.end)) }, [milestone])

    // FUNCTIONS

    async function submitMilestone(event: FormEvent){
        event.preventDefault()
        if(milestoneId == 'new') {
            await MilestoneManager.addMilestone({userId: user.id, productId: productId, label: label, start: start.toISOString(), end: end.toISOString()})
            history.replace(`/products/${productId}/milestones/`)
        } else {
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