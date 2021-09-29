import * as React from 'react'
import { FormEvent, Fragment, useRef, useState } from 'react'
import { Audit, Product, User, Version } from 'fhooe-audit-platform-common/src/data'
import { AuditAPI, ProductAPI, UserAPI, VersionAPI } from '../../rest'
import { Link } from 'react-router-dom'


export const AuditSearchBar = (props: {change: (value: Audit[]) => void, addAudit?: boolean}) => {
    
    const query = useRef<HTMLInputElement>(null)
    const [audits, setAudits] = useState<Audit[]>(null)

    async function searchBar(event: FormEvent) {
        event.preventDefault()

        await AuditAPI.findAudits(query.current.value).then(setAudits)

        props.change(audits)
    }

    return (
        <Fragment>
            <form onChange={searchBar}>
                <span>
                    <input
                        type="text"
                        ref={query}
                        className="header-search"
                        placeholder={`Search Product`}/>
                    {props.addAudit &&
                    <Link to='/audits/new'>
                    <input 
                        type="button"
                        className="header-search"
                        value="Add new audit"/>
                    </Link>}
                </span>
            </form>
        </Fragment>
        )
}

export const ProductSearchBar = (props: {change: (value: Product[]) => void, addProduct?: boolean}) => {
    
    const query = useRef<HTMLInputElement>(null)
    const [products, setProducts] = useState<Product[]>(null)

    async function searchBar(event: FormEvent) {
        event.preventDefault()

        await ProductAPI.findProducts(query.current.value).then(setProducts)

        props.change(products)
    }

    return (
        <Fragment>
            <form onChange={searchBar}>
                <span>
                    <input
                        type="text"
                        ref={query}
                        className="header-search"
                        placeholder={`Search Product`}/>
                    {props.addProduct &&
                    <Link to='/products/new'>
                    <input 
                        type="button"
                        className="header-search"
                        value="Add new product"/>
                    </Link>}
                </span>
            </form>
        </Fragment>
        )
}

export const UserSearchBar = (props: {change: (value: User[]) => void, addUser?: boolean}) => {
    
    const query = useRef<HTMLInputElement>(null)
    const [users, setUsers] = useState<User[]>(null)

    async function searchBar(event: FormEvent) {
        event.preventDefault()

        await UserAPI.findUsers(query.current.value).then(setUsers)

        props.change(users)
    }

    return (
        <Fragment>
            <form onChange={searchBar}>
                <span>
                    <input
                        type="text"
                        ref={query}
                        className="header-search"
                        placeholder={`Search User`}/>
                    {props.addUser && 
                    <Link to='/users/new'>
                    <input 
                        type="button"
                        className="header-search"
                        value="Add new user"/>
                    </Link>}
                </span>
            </form>
        </Fragment>
        )
}

export const VersionSearchBar = (props: {change: (value: Version[]) => void, addVersion?: boolean}) => {
    
    const query = useRef<HTMLInputElement>(null)
    const [versions, setVersions] = useState<Version[]>(null)

    async function searchBar(event: FormEvent) {
        event.preventDefault()

        await VersionAPI.findVersions(query.current.value).then(setVersions)

        props.change(versions)
    }

    return (
        <Fragment>
            <form onChange={searchBar}>
                <span>
                    <input
                        type="text"
                        ref={query}
                        className="header-search"
                        placeholder={`Search User`}/>
                    {props.addVersion && 
                    <Link to='/versions/new'>
                    <input 
                        type="button"
                        className="header-search"
                        value="Add new version"/>
                    </Link>}
                </span>
            </form>
        </Fragment>
        )
}