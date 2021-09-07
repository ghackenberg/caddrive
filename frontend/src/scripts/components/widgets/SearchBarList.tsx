import * as React from 'react'
import { FormEvent, Fragment, useEffect, useRef, useState } from 'react'
import { Audit, Product, User } from 'fhooe-audit-platform-common/src/data'
import { AuditAPI, ProductAPI, UserAPI } from '../../rest'
import { UserList } from './UserList'
import { AuditList } from './AuditList'
import { ProductList } from './ProductList'

export const SearchBarList = (props: {type: string}) => {

    const type = props.type

    const query = useRef<HTMLInputElement>(null)

    const [audits, setAudits] = useState<Audit[]>(null)
    const [products, setProducts] = useState<Product[]>(null)
    const [users, setUsers] = useState<User[]>(null)

    useEffect(() => { AuditAPI.findAll().then(setAudits) }, [])
    useEffect(() => { ProductAPI.findAll().then(setProducts) }, [])
    useEffect(() => { UserAPI.findAll().then(setUsers) }, [])

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
            <p>Loading...</p>}
    </Fragment>
    )
}