import { Audit, Product, User, Version } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

interface Props<T> {
    object: T | string
    id: string
    name: string
    type: string
}

export const AuditLink = (props: {audit?: Audit}) => {

    return (
        <Fragment>
            <span>
                <Link to="/">Welcome Page</Link>
            </span>
            <span>
                <Link to='/audits'>Audits</Link>
            </span>
            { props.audit ? (
            <span>
                <Link to={`/audits/${props.audit.id}`}>{'Audit ' + props.audit.name}</Link>
            </span>
            ) : (
            <span>
                <Link to={`/audits/new`}>new Audit</Link>
            </span>
            )}
        </Fragment>  
    )
}

export const ProductLink = (props: {product?: Product}) => {

    return (
        <Fragment>
            <span>
                <Link to="/">Welcome Page</Link>
            </span>
            <span>
                <Link to='/products'>Products</Link>
            </span>
            { props.product ? (
            <span>
                <Link to={`/products/${props.product.id}`}>{'Product ' + props.product.name}</Link>
            </span>
            ) : (
            <span>
                <Link to={`/products/new`}>new Product</Link>
            </span>
            )}
        </Fragment>  
    )
}

export const UserLink = (props: {user?: User}) => {

    return (
        <Fragment>
            <span>
                <Link to="/">Welcome Page</Link>
            </span>
            <span>
                <Link to='/users'>Users</Link>
            </span>
            { props.user ? (
            <span>
                <Link to={`/users/${props.user.id}`}>{'User ' + props.user.name}</Link>
            </span>
            ) : (
            <span>
                <Link to={`/users/new`}>new User</Link>
            </span>
            )}
        </Fragment>  
    )
}

export const VersionLink = (props: {version?: Version}) => {

    return (
        <Fragment>
            <span>
                <Link to="/">Welcome Page</Link>
            </span>
            <span>
                <Link to='/versions'>Versions</Link>
            </span>
            { props.version ? (
            <span>
                <Link to={`/versions/${props.version.id}`}>{'Version ' + props.version.name}</Link>
            </span>
            ) : (
            <span>
                <Link to={`/versions/new`}>new Version</Link>
            </span>
            )}
        </Fragment>  
    )
}

/**
 * @deprecated
 */
export const LinkSource = <T, >(object: Props<T>) => {

    var objectName = ""
    var objectLink = "/default"

    /*
    const test = JSON.parse('{"type":"Audit","id":"xyz"}')
    test.someprop = 'test'
    delete test.someprop
    test.otherprop = function() {
        this.name  = 'a'
    }
    test.otherprop()
    test.constructor == Object
    */

    if ( object.type == 'Audit' || object.type == 'Audit' && object.id == 'new' ) {
        objectName = "Audit"
        objectLink = "/audits"
    }
    if ( object.type == 'Product' || object.type == 'Product' && object.id == 'new' ) {
        objectName = "Product"
        objectLink = "/products"
    }
    if ( object.type == 'User' || object.type == 'User' && object.id == 'new' ) {
        objectName = "User"
        objectLink = "/users"
    }
    if ( object.type == 'Version' || object.type == 'Version' && object.id == 'new' ) {
        objectName = "Version"
        objectLink = "/versions"
    }

    return (
        <Fragment>
            <span>
                <Link to="/">Welcome Page</Link>
            </span>
            <span>
                <Link to={objectLink}>{objectName + 's'}</Link>
            </span>
            { object.id != 'new' ? (
            <span>
                <Link to={`${objectLink}/${object.id}`}>{objectName + ' ' + object.name}</Link>
            </span>
            ) : (
            <span>
                <Link to={`${objectLink}/new`}>new {objectName}</Link>
            </span>
            )}
        </Fragment>  
    )
}