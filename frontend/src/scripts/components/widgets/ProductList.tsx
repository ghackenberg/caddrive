import { Product } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'
import * as ProductIcon from '/src/images/product.png'
import * as CreateIcon from '/src/images/create.png'

export const ProductList = (props: {list: Product[]}) => (
    <div className="widget list product_list">
        <ul>
            {props.list.map(product =>
                <li key={product.id}>
                    <Link to={`/products/${product.id}`}><img src={ProductIcon}/>Product <em>{product.id}</em></Link>
                </li>
            )}
            <li>
                <Link to="/products/new"><img src={CreateIcon}/>Product</Link>
            </li>
        </ul>
    </div>
)