import * as React from 'react'
import { FormEvent, Fragment, useEffect, useRef, useState } from 'react'
import { Audit, Product, User, Version } from 'fhooe-audit-platform-common/src/data'
import { AuditAPI, ProductAPI, UserAPI, VersionAPI } from '../../rest'
import { UserList } from './UserList'
import { AuditList } from './AuditList'
import { ProductList } from './ProductList'
import { VersionList } from './VersionList'

export const SearchBarList = (props: {type: string}) => {

    const type = props.type

    const query = useRef<HTMLInputElement>(null)

    const [audits, setAudits] = useState<Audit[]>(null)
    const [products, setProducts] = useState<Product[]>(null)
    const [users, setUsers] = useState<User[]>(null)
    const [versions, setVersions] = useState<Version[]>(null)

    useEffect(() => { AuditAPI.findAudits().then(setAudits) }, [])
    useEffect(() => { ProductAPI.findProducts().then(setProducts) }, [])
    useEffect(() => { UserAPI.findUsers().then(setUsers) }, [])
    useEffect(() => { VersionAPI.findVersions().then(setVersions) }, [])

    async function searchBar(event: FormEvent) {
        event.preventDefault()

        if (type == 'audits') {
            await AuditAPI.findAudits(query.current.value).then(setAudits)
        }
        if (type == 'products') {
            await ProductAPI.findProducts(query.current.value).then(setProducts)
        }
        if (type == 'users') {
            await UserAPI.findUsers(query.current.value).then(setUsers)
        }
        if (type == 'versions') {
            await VersionAPI.findVersions(query.current.value, null).then(setVersions)
        }
    }

    return (
    <Fragment>
        <form onChange={searchBar}>
            <input
                type="text"
                ref={query}
                className="header-search"
                placeholder={`Search ${type}`}
            />
        </form>
        {
            (type == 'audits' && audits && <AuditList auditList={audits}/>) ||
            (type == 'products' && products && <ProductList list={products}/>) ||
            (type == 'users' && users && <UserList list={users}/>) ||
            (type == 'versions' && versions && <VersionList list={versions}/>) ||
            <p>Loading...</p>}
    </Fragment>
    )
}