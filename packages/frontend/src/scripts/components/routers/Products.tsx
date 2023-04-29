import * as React from 'react'
import { Route, Switch } from 'react-router'

import { ProductView } from '../views/Product'

const ProductRouter = React.lazy(() => import('./Product'))

const ProductsRouter = () => {
    return (
        <Switch>
            <Route path="/products/:product" component={ProductRouter}/>
            <Route path="/products" component={ProductView}/>
        </Switch>
    )
}

export default ProductsRouter