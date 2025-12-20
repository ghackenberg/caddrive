import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import { ProductsHeader } from '../snippets/ProductsHeader.js'
import { ProductView } from '../views/Product.js'

const ProductRouter = lazy(() => import('./Product.js'))

const Overview = () => (
    <>
        <ProductsHeader/>
        <ProductView/>
    </>
)

const ProductsRouter = () => {
    return (
        <Routes>
            <Route path="/:productId/*" element={<ProductRouter/>}/>
            <Route path="/" element={<Overview/>}/>
        </Routes>
    )
}

export default ProductsRouter