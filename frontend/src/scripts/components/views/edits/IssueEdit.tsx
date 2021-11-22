import * as React from 'react'
import { useState, useEffect, useContext, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
// Commons
import { Issue, Product } from 'fhooe-audit-platform-common'
// Clients
import { IssueAPI, ProductAPI } from '../../../clients/rest'
// Contexts
import { UserContext } from '../../../contexts/User'
// Links
import { IssueLink } from '../../links/IssueLink'
// Inputs
import { TextInput } from '../../inputs/TextInput'
// Widgets
import { ProductView } from '../../widgets/ProductView'

export const IssueEditView = (props: RouteComponentProps<{issue: string}>) => {

    const query = new URLSearchParams(props.location.search)

    const productId = query.get('product')
    const issueId = props.match.params.issue

    const history = useHistory()

    const user = useContext(UserContext)

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [issue, setIssue] = useState<Issue>()

    // Define values
    const [label, setLabel] = useState<string>('')
    const [text, setText] = useState<string>('')

    // Load entities
    useEffect(() => { issueId == 'new' && ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { issueId != 'new' && IssueAPI.getIssue(issueId).then(setIssue) }, [props])
    useEffect(() => { issue && ProductAPI.getProduct(issue.productId).then(setProduct) }, [issue])

    // Load values
    useEffect(() => { issue && setLabel(issue.label) }, [issue])
    useEffect(() => { issue && setText(issue.text) }, [issue])

    async function submit(event: FormEvent){
        event.preventDefault()
        if (issueId == 'new') {
            if (label && text) {
                const issue = await IssueAPI.addIssue({ userId: user.id, productId, time: new Date().toISOString(), label, text, state: 'open' })
                history.replace(`/comments?issue=${issue.id}`)
            }
        }
        else {
            if (label && text) {
                await IssueAPI.updateIssue(issue.id, { ...issue, label, text })
                history.replace(`/comments?issue=${issue.id}`)
            }
        }
    }

    async function reset() {
        history.goBack()
    }

    return (
        <div className='view sidebar audit'>
            { (issueId == 'new' || issue) && product && (
                <React.Fragment>
                    <header>
                        <nav>
                            <IssueLink issue={issue} product={product}/>
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>Issue editor</h1>
                            <form onSubmit={submit} onReset={reset} className='data-input'>
                                <TextInput label='Label' placeholder='Type label' value={label} change={setLabel}/>
                                <TextInput label='Text' placeholder='Type text' value={text} change={setText}/>
                                <div>
                                    <div/>
                                    <div>
                                        { issueId == 'new' && <input type='reset' value='Cancel'/> }
                                        <input type='submit' value='Save'/>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div>
                            <ProductView id={productId} mouse={true}/>
                        </div>
                    </main>
                </React.Fragment>
            )}
        </div>
    )
}