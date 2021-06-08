import { Product } from 'fhooe-audit-platform-common'
import * as React from 'react'

export class ProductList extends React.Component<{list: Product[]}> {
    render() {
        return (
            <ul>
                {this.props.list.map(product =>
                    <li key={product.id}>
                        Product {product.id}
                    </li>
                )}
            </ul>
        )
    }
}