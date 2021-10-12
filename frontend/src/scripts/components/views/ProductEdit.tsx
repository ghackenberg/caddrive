import * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Product, Version } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI, VersionAPI } from '../../clients/rest'
// Snippets
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
// Links
import { ProductLink } from '../links/ProductLink'
// Inputs
import { TextInput } from '../inputs/TextInput'
// Widgets
import { Column, Table } from '../widgets/Table'
// Images
import * as VersionIcon from '../../../images/version.png'
import * as DeleteIcon from '../../../images/delete.png'

export const ProductEditView = (props: RouteComponentProps<{product: string}>) => {

    const productId = props.match.params.product

    const history = useHistory()

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [versions, setVersions] = useState<Version[]>()

    // Define values
    const [name, setName] = useState<string>()

    // Load entities
    useEffect(() => { productId == 'new' || ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { productId == 'new' || VersionAPI.findVersions(undefined, undefined, productId).then(setVersions) }, [props])
    
    async function submit(event: FormEvent){
        event.preventDefault()
        if(productId == 'new') {
            if (name) {
                const product = await ProductAPI.addProduct({name})
                history.replace(`/products/${product.id}`)
            }
        } else {
            if (name) {
                setProduct(await ProductAPI.updateProduct({id: product.id, name}))
            }
        }
    }

    async function reset() {
        history.goBack()
    }

    const columns: Column<Version>[] = [
        {label: 'Icon', content: _version => <img src={VersionIcon} style={{width: '1em'}}/>},
        {label: 'Name', content: version => <Link to={`/versions/${version.id}`}>{version.name}</Link>},
        {label: 'Delete', content: _version => <a href="#" onClick={_event => {}}><img src={DeleteIcon} style={{width: '1em', height: '1em'}}/></a>}
    ]

    return (
        <div className="view product">
            <Header/>
            <Navigation/>
                <main>
                    { productId == 'new' || product ? (
                        <Fragment>
                            <nav>
                                <ProductLink product={product}/>
                            </nav>
                            <h1>Product editor</h1>
                            <form onSubmit={submit} onReset={reset} className='user-input'>
                                <TextInput
                                    label='Product name'
                                    placeholder='Add here new product'
                                    value={product ? product.name : ''}
                                    change={value => setName(value)}/>
                                <div>
                                    <div/>
                                    <div>
                                        <input type="reset" value='Cancel'/>
                                        <input type="submit" value="Save" className='saveItem'/>
                                    </div>
                                </div>
                            </form>
                            {productId != 'new' && (
                                <Fragment>
                                    <h2>Version list (<Link to={`/versions/new?product=${productId}`}>+</Link>)</h2>
                                    { versions && <Table columns={columns} items={versions}/> }
                                </Fragment>
                            )}
                        </Fragment>
                    ) : (
                        <p>Loading...</p>
                    )}
                </main>
        </div>
    )
}