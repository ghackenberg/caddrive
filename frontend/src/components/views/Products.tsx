import { Product } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { ProductAPI } from '../../api'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { ProductList } from '../widgets/ProductList'

interface State {
    products?: Product[]
}

export class Products extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {}
    }
    async componentDidMount() {
        this.setState({products: await ProductAPI.findAll()})
    }
    render() {
        return (
            <React.Fragment>
                <Header/>
                <Navigation/>
                <main>
                    <h1>Products</h1>
                    {this.state.products ? <ProductList list={this.state.products}/> : <p>Loading...</p>}
                </main>
            </React.Fragment>
        )
    }
}