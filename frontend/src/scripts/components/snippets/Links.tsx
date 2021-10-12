import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Audit, Product, User, Version } from 'fhooe-audit-platform-common'

export const HomeLink = () => {
    return (
        <Fragment>
            <span>
                <Link to="/">Home</Link>
            </span>
        </Fragment>
    )
}

export const UsersLink = () => {
    return (
        <Fragment>
            <HomeLink/>
            <span>
                <Link to="/users">Users</Link>
            </span>
        </Fragment>
    )
}

export const ProductsLink = () => {
    return (
        <Fragment>
            <HomeLink/>
            <span>
                <Link to="/products">Products</Link>
            </span>
        </Fragment>
    )
}

export const UserLink = (props: {user?: User}) => {
    return (
        <Fragment>
            <UsersLink/>
            { props.user ? (
                <span>
                    <Link to={`/users/${props.user.id}`}>{props.user.name}</Link>
                </span>
            ) : (
                <span>
                    <Link to={`/users/new`}>New</Link>
                </span>
            )}
        </Fragment>  
    )
}

export const ProductLink = (props: {product?: Product}) => {
    return (
        <Fragment>
            <ProductsLink/>
            { props.product ? (
                <span>
                    <Link to={`/products/${props.product.id}`}>{props.product.name}</Link>
                </span>
            ) : (
                <span>
                    <Link to={`/products/new`}>New</Link>
                </span>
            )}
        </Fragment>  
    )
}

export const VersionLink = (props: {product: Product, version?: Version}) => {
    return (
        <Fragment>
            <ProductLink product={props.product}/>
            { props.version ? (
            <span>
                <Link to={`/versions/${props.version.id}`}>{props.version.name}</Link>
            </span>
            ) : (
            <span>
                <Link to={`/versions/new?product=${props.product.id}`}>New</Link>
            </span>
            )}
        </Fragment>  
    )
}

export const AuditLink = (props: {product: Product, version: Version, audit?: Audit}) => {
    return (
        <Fragment>
            <VersionLink product={props.product} version={props.version}/>
            { props.audit ? (
                <span>
                    <Link to={`/audits/${props.audit.id}`}>{props.audit.name}</Link>
                </span>
            ) : (
                <span>
                    <Link to={`/audits/new?version=${props.version.id}`}>New</Link>
                </span>
            )}
        </Fragment>  
    )
}