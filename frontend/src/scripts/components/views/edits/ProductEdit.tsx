import * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Product, Version } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI, VersionAPI } from '../../../clients/rest'
// Snippets
import { Header } from '../../snippets/Header'
import { Navigation } from '../../snippets/Navigation'
// Links
import { ProductLink } from '../../links/ProductLink'
// Searches
import { VersionSearch } from '../../searches/VersionSearch'
// Inputs
import { TextInput } from '../../inputs/TextInput'
// Widgets
import { Column, Table } from '../../widgets/Table'
// Images
import * as VersionIcon from '/src/images/version.png'
import * as DeleteIcon from '/src/images/delete.png'

export const ProductEditView = (props: RouteComponentProps<{product: string}>) => {

    const productId = props.match.params.product

    const history = useHistory()

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [versions, setVersions] = useState<Version[]>()

    // Define values
    const [name, setName] = useState<string>('')

    // Load entities
    useEffect(() => { productId == 'new' || ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { productId == 'new' || VersionAPI.findVersions(undefined, undefined, productId).then(setVersions) }, [props])

    // Load values
    useEffect(() => { product && setName(product.name) }, [product])
    
    async function deleteVersion(version: Version) {
        setVersions(await VersionAPI.deleteVersion(version))
    }

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
        {label: 'Date', content: version => <Link to={`/versions/${version.id}`}>{new Date(version.date).toISOString().slice(0, 10)}</Link>},
        {label: 'Delete', content: version => <a href="#" onClick={_event => deleteVersion(version)}><img src={DeleteIcon} style={{width: '1em', height: '1em'}}/></a>}
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
                        <h2>Property form</h2>
                        <form onSubmit={submit} onReset={reset}>
                            <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                            <div>
                                <div/>
                                <div>
                                    { productId == 'new' && <input type='reset' value='Cancel'/> }
                                    <input type='submit' value='Save'/>
                                </div>
                            </div>
                        </form>
                        {productId != 'new' && (
                            <Fragment>
                                <h2>Version list (<Link to={`/versions/new?product=${productId}`}>+</Link>)</h2>
                                <h3>Search from</h3>
                                <VersionSearch product={productId} change={setVersions}/>
                                <h3>Search list</h3>
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