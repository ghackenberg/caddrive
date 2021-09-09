import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

interface Props<T> {
    object: T | string
    id: string
    name: string
    type: string
}

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