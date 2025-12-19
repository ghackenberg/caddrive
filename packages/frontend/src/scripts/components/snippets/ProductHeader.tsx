import { NavLink, useParams } from 'react-router'
import { useProduct } from '../../hooks/entity.js'
import { useNavigationStack } from '../../hooks/navigation.js'
import { IssuesLink } from '../links/IssuesLink.js'
import { MembersLink } from '../links/MembersLink.js'
import { MilestonesLink } from '../links/MilestonesLink.js'
import { ProductLink } from '../links/ProductLink.js'
import { VersionsLink } from '../links/VersionsLink.js'
import SettingIcon from '/src/images/setting.png'

export const ProductHeader = () => {

    // NAVIGATION

    const { navigate } = useNavigationStack()

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

    // ENTITIES

    const product = useProduct(productId)

    // RETURN

    return (
        <header className='view product'>
            <div className='entity'>
                <ProductLink product={product}/>
                {product && (
                    product.public ? (
                        <span className='badge public'>public</span>
                    ) : (

                        <span className='badge private'>private</span>
                    )
                )}
            </div>
            <div className='tabs'>
                {product && (
                    <>
                        <VersionsLink product={product}/>
                        <IssuesLink product={product}/>
                        <MilestonesLink product={product}/>
                        <MembersLink product={product}/>
                    </>
                )}
                <span>
                    {productId == 'new' ? (
                        <a className="active">
                            <img src={SettingIcon} className='icon small'/>
                            <span>Settings</span>
                        </a>
                    ) : (
                        <NavLink to={`/products/${productId}/settings`} onClick={navigate}>
                            <img src={SettingIcon} className='icon small'/>
                            <span>Settings</span>
                        </NavLink>
                    )}
                </span>
            </div>
        </header>
    )
}