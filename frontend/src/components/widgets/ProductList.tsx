import { Product } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'

export class ProductList extends React.Component<{list: Product[]}> {
    render() {
        return (
            <ul>
                {this.props.list.map(product =>
                    <li key={product.id} style={{backgroundImage: 'url(/images/product.png'}}>
                        <Link to={`/products/${product.id}`}>Product <em>{product.id}</em></Link>
                    </li>
                )}
                <li style={{backgroundImage: 'url(/images/create.png'}}>
                    <Link to="/products/new">Product</Link>
                </li>
            </ul>
        )
    }
}