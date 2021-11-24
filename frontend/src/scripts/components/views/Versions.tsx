import * as React from 'react'
import { useState, useEffect, useRef, Fragment } from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { createGitgraph } from '@gitgraph/js'
// Commons
import { Product, User, Version } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI, UserAPI, VersionAPI } from '../../clients/rest'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ModelView } from '../widgets/ModelView'
import { ProductView } from '../widgets/ProductView'
// Images
import * as DeleteIcon from '/src/images/delete.png'

export const VersionsView = (props: RouteComponentProps<{product: string}>) => {

    const div = useRef<HTMLDivElement>()

    const productId = props.match.params.product
    
    // Define entities
    const [product, setProduct] = useState<Product>()
    const [versions, setVersions] = useState<Version[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})
    const [version, setVersion] = useState<Version>()

    // Load entities
    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { VersionAPI.findVersions(productId).then(setVersions) }, [props])
    useEffect(() => { versions && versions.length > 0 && setVersion(versions[versions.length - 1])}, [versions])
    useEffect(() => {
        if (versions) {
            Promise.all(versions.map(version => UserAPI.getUser(version.userId))).then(versionUsers => {
                const newUsers: {[id: string]: User} = {}
                for (var index = 0; index < versions.length; index++) {
                    newUsers[versions[index].id] = versionUsers[index]
                }
                setUsers(newUsers)
            })
        }
    }, [versions])
    useEffect(() => {
        if (div.current) {
            while (div.current.childNodes.length > 0) {
                div.current.removeChild(div.current.firstChild)
            }

            const gitgraph = createGitgraph(div.current)
    
            const master = gitgraph.branch({ name: 'master' })
    
            for (var index = 0; index < versions.length; index++) {
                const vers = versions[index]
    
                const hash = vers.id
                const user = vers.id in users && users[vers.id]
                const author = user && `${user.name} <${user.email}>`
                const tag = `${vers.major}.${vers.minor}.${vers.patch}`
                const subject = vers.description
                const color = vers == version ? 'black' : undefined
    
                master.commit({ hash, author, subject, tag, style: { color, dot: { color }, message: { color, displayHash: false } }, onClick: () => {
                    setVersion(vers)
                }, onMessageClick: () => {
                    setVersion(vers)
                }})
            }
        }
    }, [users, version])

    const columns: Column<Version>[] = [
        {label: 'Preview', class: 'center', content: version => <Link to={`/products/${productId}/versions/${version.id}`}><ModelView url={`/rest/models/${version.id}`} mouse={false}/></Link>},
        {label: 'User', class: 'left nowrap', content: version => <Link to={`/products/${productId}/versions/${version.id}`}>{version.id in users ? users[version.id].name : '?'}</Link>},
        {label: 'Number', class: 'center', content: version => <Link to={`/products/${productId}/versions/${version.id}`}>{version.major}.{version.minor}.{version.patch}</Link>},
        {label: 'Description', class: 'left fill', content: version => <Link to={`/products/${productId}/versions/${version.id}`}>{version.description}</Link>},
        {label: '', content: () => <img src={DeleteIcon}/>}
    ] 

    return (
        <main className="view extended products">
            { product && versions && (
                <Fragment>
                    <ProductHeader product={product}/>
                    <main className='sidebar'>
                        <div>
                            <Link to={`/products/${productId}/versions/new`}>
                                New version
                            </Link>
                            <h2>Table</h2>
                            <Table columns={columns} items={versions}/>
                            <h2>Graph</h2>
                            <div ref={div}/>
                        </div>
                        <div>
                            {version ? (
                                <ModelView url={`/rest/models/${version.id}`} mouse={true}/>
                            ) : (
                                <ProductView product={product} mouse={true}/>
                            )}
                        </div>
                    </main>
                </Fragment>
            )}
        </main>
    )

}