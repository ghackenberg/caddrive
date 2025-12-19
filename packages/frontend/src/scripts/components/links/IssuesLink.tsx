import { ProductRead } from 'productboard-common'
import { NavLink } from 'react-router'
import { useNavigationStack } from '../../hooks/navigation.js'
import IssueIcon from '/src/images/issue.png'

export const IssuesLink = (props: {product: ProductRead}) => {

    // NAVIGATION

    const { navigate } = useNavigationStack()

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.productId}/issues`} onClick={navigate}>
                <img src={IssueIcon} className='icon small'/>
                <span className='label'>Issues</span>
                <span className='badge'>{props.product.openIssueCount}</span>
            </NavLink>
        </span>
    )

}