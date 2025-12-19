import { ProductsLink } from '../links/ProductsLink.js'

export const ProductsHeader = () => {
    return (
        <header className='view products'>
            <div className='entity'>
                <ProductsLink/>
            </div>
        </header>
    )
}