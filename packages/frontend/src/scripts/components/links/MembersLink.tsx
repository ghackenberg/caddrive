import { ProductRead } from 'productboard-common'
import { NavLink } from 'react-router'
import { useNavigationStack } from '../../hooks/navigation.js'
import MemberIcon from '/src/images/user.png'

export const MembersLink = (props: {product: ProductRead}) => {

    // NAVIGATION

    const { navigate } = useNavigationStack()

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.productId}/members`} onClick={navigate}>
                <img src={MemberIcon} className='icon small'/>
                <span className='label'>Members</span>
                <span className='badge'>{props.product.memberCount}</span>
            </NavLink>
        </span>
    )

}