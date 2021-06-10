import { Product } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'

export const ProductList = (props: {list: Product[]}) => (
    <ul>
        {props.list.map(product =>
            <li key={product.id}>
                <Link to={`/products/${product.id}`}>Product <em>{product.id}</em></Link>
            </li>
        )}
        <li>
            <Link to="/products/new">Product</Link>
        </li>
    </ul>
)