import * as React from 'react'
import { Route, Switch } from 'react-router'

import { ProductsHeader } from '../snippets/ProductsHeader'
import { ProductView } from '../views/Product'

const ProductRouter = React.lazy(() => import('./Product'))

const Overview = () => (
    <>
        <ProductsHeader/>
        <ProductView/>
    </>
)

const ProductsRouter = () => {
    return (
        <Switch>
            <Route path="/products/:product" component={ProductRouter}/>
            <Route path="/products" component={Overview}/>
        </Switch>
    )
}

export default ProductsRouter