import * as React from 'react'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
// Commons
import { Product } from 'productboard-common'
// Links
import { ProductLink } from '../links/ProductLink'
import { VersionsLink } from '../links/VersionsLink'
import { IssuesLink } from '../links/IssuesLink'
import { MembersLink } from '../links/MembersLink'
// Images
import * as SettingIcon from '/src/images/setting.png'
import { MilestonesLink } from '../links/MilestonesLink'

export const ProductHeader = (props: {product?: Product}) => (
    <header>
        <div>
            <ProductLink product={props.product}/>
        </div>
        <div>
            {props.product && (
                <Fragment>
                    <VersionsLink product={props.product}/>
                    <IssuesLink product={props.product}/>
                    <MilestonesLink product={props.product}/>
                    <MembersLink product={props.product}/>
                </Fragment>
            )}
            <span>
                {props.product ? (
                    <NavLink to={`/products/${props.product.id}/settings`}>
                        <img src={SettingIcon}/>
                        Settings
                    </NavLink>
                ) : (
                    <a className="active">
                        <img src={SettingIcon}/>
                        Settings
                    </a>
                )}
            </span>
        </div>
    </header>
)