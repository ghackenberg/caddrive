import { useProducts } from '../../hooks/list.js'

export const ProductCount = (props: { public?: 'true' | 'false' }) => {
    const products = useProducts(props.public)
    return (
        <>
            {products ? products.length : '?'}
        </>
    )
}