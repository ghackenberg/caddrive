import * as React from 'react'
import { FormEvent, Fragment } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
// Commons
import { Audit, Product, User, Version, EventData } from 'fhooe-audit-platform-common'
// Clients
import { AuditAPI, EventAPI, ProductAPI, UserAPI, VersionAPI } from '../../clients/rest'

export const AuditSearchBar = (props: {change: (value: Audit[]) => void, versionSearch: string, addAudit?: boolean}) => {

    const history = useHistory()
    var filterActive : Boolean = props.versionSearch.includes('?version')

    async function searchBar(event: FormEvent<HTMLInputElement>) {
        event.preventDefault()

        if (!filterActive) {
            props.change(await AuditAPI.findAudits(event.currentTarget.value))
        }
        else {
            const versionId = props.versionSearch.split('=')
            props.change(await AuditAPI.findAudits(undefined, event.currentTarget.value, undefined, versionId[1]))
        }
    }

    async function unsetFilter(event: FormEvent<HTMLInputElement>) {
        event.preventDefault()
        props.change(await AuditAPI.findAudits())
        history.push('/audits')
    }

    return (
        <Fragment>
            <form>
                <span>
                    <input
                        type="text"
                        onChange={searchBar}
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
                <div>
                    { filterActive && (
                    <span className='filter-search'>
                        <label>Filter:</label>
                        <input
                            type="button"
                            className="filter-search"
                            value="Version"
                            onClick={unsetFilter}/> 
                    </span> 
                    )}
                </div>
            </form>
        </Fragment>
        )
}

export const EventSearchBar = (props: {change: (value: (EventData & {id: string})[]) => void, auditSearch: string}) => {

    const history = useHistory()
    var filterActive : Boolean = props.auditSearch.includes('?audit')

    async function searchBar(event: FormEvent<HTMLInputElement>) {
        event.preventDefault()

        if (!filterActive) {
            props.change(await EventAPI.findEvents(event.currentTarget.value))
        }
        else {
            const auditId = props.auditSearch.split('=')
            props.change(await EventAPI.findEvents(undefined, auditId[1], event.currentTarget.value))
        }
    }

    async function unsetFilter(event: FormEvent<HTMLInputElement>) {
        event.preventDefault()
        props.change(await EventAPI.findEvents())
        history.push('/events')
    }

    return (
        <Fragment>
            <form>
                <span>
                    <input
                        type="text"
                        onChange={searchBar}
                        className="header-search"
                        placeholder={`Search Event`}/>
                </span>
                <div>
                    { filterActive && (
                    <span className='filter-search'>
                        <label>Filter:</label>
                        <input
                            type="button"
                            className="filter-search"
                            value="Audit"
                            onClick={unsetFilter}/> 
                    </span> 
                    )}
                </div>
            </form>
        </Fragment>
        )
}

export const ProductSearchBar = (props: {change: (value: Product[]) => void, addProduct?: boolean}) => {
    
    async function searchBar(event: FormEvent<HTMLInputElement>) {
        event.preventDefault()

        props.change(await ProductAPI.findProducts(event.currentTarget.value))
    }

    return (
        <Fragment>
            <form>
                <span>
                    <input
                        type="text"
                        onChange={searchBar}
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

    async function searchBar(event: FormEvent<HTMLInputElement>) {
        event.preventDefault()

        props.change(await UserAPI.findUsers(event.currentTarget.value))
    }

    return (
        <Fragment>
            <form>
                <span>
                    <input
                        type="text"
                        onChange={searchBar}
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

export const VersionSearchBar = (props: {change: (value: Version[]) => void, productSearch: string, addVersion?: boolean}) => {

    const history = useHistory()
    var filterActive : Boolean = props.productSearch.includes('?product')
    
    async function searchBar(event: FormEvent<HTMLInputElement>) {
        event.preventDefault()

        if (!filterActive) {
            props.change(await VersionAPI.findVersions(event.currentTarget.value))
        }
        else {
            const productId = props.productSearch.split('=')
            props.change(await VersionAPI.findVersions(undefined, event.currentTarget.value, productId[1]))
        }
    }
    
    async function unsetFilter(event: FormEvent<HTMLInputElement>) {
        event.preventDefault()
        props.change(await VersionAPI.findVersions())
        history.push('/versions')
    }

    return (
        <Fragment>
            <form>
                <span>
                    <input
                        type="text"
                        className="header-search"
                        placeholder={`Search Version`}
                        onInput={searchBar}/>
                    {props.addVersion && 
                    <Link to='/versions/new'>
                    <input 
                        type="button"
                        className="header-search"
                        value="Add new version"/>
                    </Link>}
                </span>
                <div>
                    { filterActive && (
                    <span className='filter-search'>
                        <label>Filter:</label>
                        <input
                            type="button"
                            className="filter-search"
                            value="Product"
                            onClick={unsetFilter}/> 
                    </span> 
                    )}
                </div>
            </form>
        </Fragment>
        )
}