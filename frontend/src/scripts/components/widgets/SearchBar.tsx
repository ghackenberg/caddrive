import * as React from 'react'
import { FormEvent, Fragment } from 'react'
import { Audit, Product, User, Version, CommentEventData } from 'fhooe-audit-platform-common/src/data'
import { AuditAPI, EventAPI, ProductAPI, UserAPI, VersionAPI } from '../../rest'
import { Link } from 'react-router-dom'


export const AuditSearchBar = (props: {change: (value: Audit[]) => void, addAudit?: boolean}) => {

    async function searchBar(event: FormEvent<HTMLInputElement>) {
        event.preventDefault()

        props.change(await AuditAPI.findAudits(event.currentTarget.value))
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
            </form>
        </Fragment>
        )
}

export const EventSearchBar = (props: {change: (value: CommentEventData[]) => void}) => {

    async function searchBar(event: FormEvent<HTMLInputElement>) {
        event.preventDefault()

        props.change(await EventAPI.findEvents(event.currentTarget.value))
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

export const VersionSearchBar = (props: {change: (value: Version[]) => void, addVersion?: boolean}) => {
    
    async function searchBar(event: FormEvent<HTMLInputElement>) {
        event.preventDefault()

        props.change(await VersionAPI.findVersions(event.currentTarget.value))
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
            </form>
        </Fragment>
        )
}