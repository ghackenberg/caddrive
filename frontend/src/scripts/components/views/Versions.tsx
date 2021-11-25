import * as React from 'react'
import { useState, useEffect, Fragment } from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
// Commons
import { Product, User, Version } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI, UserAPI, VersionAPI } from '../../clients/rest'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { ModelView } from '../widgets/ModelView'
import { ProductView } from '../widgets/ProductView'

export const VersionsView = (props: RouteComponentProps<{product: string}>) => {

    const productId = props.match.params.product
    
    // Define entities
    const [product, setProduct] = useState<Product>()
    const [versions, setVersions] = useState<Version[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})
    
    const [children, setChildren] = useState<{[id: string]: Version[]}>({})
    const [childrenMin, setChildrenMin] = useState<{[id: string]: number}>({})
    const [childrenMax, setChildrenMax] = useState<{[id: string]: number}>({})
    const [siblings, setSiblings] = useState<{[id: string]: Version[]}>({})
    const [indents, setIndents] = useState<{[id: string]: number}>({})
    const [indent, setIndent] = useState<number>(0)

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
        if (versions && versions.length > 0) {
            // Calculate children
            const children: {[id: string]: Version[]} = {}
    
            for (const version of versions) {
                children[version.id] = []
                for (const baseVersionId of version.baseVersionIds) {
                    children[baseVersionId].push(version)
                }
            }

            setChildren(children)

            // Calculate siblings

            const siblings: {[id: string]: Version[]} = {}

            for (const version of versions) {
                siblings[version.id] = []
            }

            for (var outerIndex = versions.length - 1; outerIndex >= 0; outerIndex--) {
                const outerVersion = versions[outerIndex]
                const baseVersionIds = [...outerVersion.baseVersionIds]
                for (var innerIndex = outerIndex - 1; innerIndex >= 0; innerIndex--) {
                    const innerVersion = versions[innerIndex]
                    const baseIndex = baseVersionIds.indexOf(innerVersion.id)
                    if (baseIndex != -1) {
                        baseVersionIds.splice(baseIndex, 1)
                    }
                    if (baseVersionIds.length > 0) {
                        siblings[innerVersion.id].push(outerVersion)
                    }
                }
            }

            setSiblings(siblings)

            // Calculate indents
            const indents: {[id: string]: number} = {}

            var next = 0

            for (const version of versions) {
                if (!(version.id in indents)) {
                    var indent = version.baseVersionIds.length > 0 ? indents[version.baseVersionIds[0]] : next
                
                    indents[version.id] = indent
                }

                for (var index = 0; index < children[version.id].length; index++) {
                    const child = children[version.id][index]
                    if (!(child.id in indents)) {
                        if (index == 0) {
                            indents[child.id] = indents[version.id]
                        } else {
                            indents[child.id] = ++next
                        }
                    }
                }
            }

            setIndents(indents)
            setIndent(next + 1)

            // Calculate min/max
            const childrenMin: {[id: string]: number} = {}
            const childrenMax: {[id: string]: number} = {}

            for (const version of versions) {
                var min = indents[version.id]
                var max = 0

                for (const child of children[version.id]) {
                    min = Math.min(min, indents[child.id])
                    max = Math.max(max, indents[child.id])
                }

                childrenMin[version.id] = min
                childrenMax[version.id] = max
            }

            setChildrenMin(childrenMin)
            setChildrenMax(childrenMax)
        }
    }, [versions])

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
                            <div className="widget version_tree">
                                {versions.map(version => version).reverse().map((vers, index) => (
                                    <Fragment key={vers.id}>
                                        {index > 0 && (
                                            <div className="between">
                                                <div className="tree" style={{width: `${indent * 1.5 + 1.5}em`}}>
                                                    {vers.id in siblings && siblings[vers.id].map(sibling => (
                                                        <span key={sibling.id} className='line vertical sibling' style={{top: 0, left: `calc(${1.5 + indents[sibling.id] * 1.5}em - 1px)`, bottom: 0}}/>
                                                    ))}
                                                    {vers.id in children && children[vers.id].map(child => (
                                                        <span className='line vertical child' key={child.id} style={{top: 0, left: `calc(${1.5 + indents[child.id] * 1.5}em - 1px)`, bottom: 0}}/>
                                                    ))}
                                                </div>
                                                <div className="text" style={{color: 'orange'}}>
                                                    {/* empty */}
                                                </div>
                                            </div>
                                        )}
                                        <div className={`version${version == vers ? ' selected' : ''}`} onClick={() => setVersion(vers)}>
                                            <div className="tree" style={{width: `${indent * 1.5 + 1.5}em`}}>
                                                {vers.id in siblings && siblings[vers.id].map(sibling => (
                                                    <span key={sibling.id} className='line vertical sibling' style={{top: 0, left: `calc(${1.5 + indents[sibling.id] * 1.5}em - 1px)`, bottom: 0}}/>
                                                ))}
                                                {vers.id in childrenMin && vers.id in childrenMax && (
                                                    <span className='line horizontal parent' style={{top: 'calc(1.5em - 3px)', left: `calc(${1.5 + childrenMin[vers.id] * 1.5}em + 1px)`, width: `calc(${(childrenMax[vers.id] - childrenMin[vers.id]) * 1.5}em - 2px)`}}/>
                                                )}
                                                {vers.id in children && children[vers.id].map(child => (
                                                    <span className='line vertical child' key={child.id} style={{top: 0, left: `calc(${1.5 + indents[child.id] * 1.5}em - 1px)`, height: 'calc(1.5em + 1px)'}}/>
                                                ))}
                                                {vers.id in indents && (
                                                    <span className='line vertical parent' style={{top: 'calc(1.5em - 1px)', left: `calc(${1.5 + indents[vers.id] * 1.5}em - 1px)`, bottom: 0}}/>
                                                )}
                                                {vers.id in indents && (
                                                    <span className='dot parent' style={{top: '0.75em', left: `${0.75 + indents[vers.id] * 1.5}em`}}/>
                                                )}
                                            </div>
                                            <div className="text">
                                                <div>
                                                    <span className="label">{vers.major}.{vers.minor}.{vers.patch}</span>
                                                    <span className="user">{vers.id in users ? `${users[vers.id].name} <${users[vers.id].email}>` : '?'}</span>
                                                </div>
                                                <div>
                                                    <span className="description">{vers.description}</span>
                                                </div>
                                            </div>
                                            <div className="model">
                                                <ModelView url={`/rest/models/${vers.id}`} mouse={false}/>
                                            </div>
                                        </div>
                                    </Fragment>
                                ))}
                            </div>
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