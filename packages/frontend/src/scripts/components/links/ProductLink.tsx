import { ProductRead } from 'productboard-common'
import { NavLink } from 'react-router'
import { useNavigationStack } from '../../hooks/navigation.js'
import ProductIcon from '/src/images/product.png'

export const ProductLink = (props: {product?: ProductRead}) => {

    // NAVIGATION

    const { navigate } = useNavigationStack()

    // RETURN

    return (
        props.product ? (
            <span>
                <NavLink to={`/products/${props.product.productId}/versions`} onClick={navigate}>
                    <img src={ProductIcon} className='icon small'/>
                    <span>{props.product.name}</span>
                </NavLink>
            </span>
        ) : (
            <span>
                <NavLink to={`/products/new/settings`} replace={true}>
                    <img src={ProductIcon} className='icon small'/>
                    <span>New product</span>
                </NavLink>
            </span>
        )
    )
}