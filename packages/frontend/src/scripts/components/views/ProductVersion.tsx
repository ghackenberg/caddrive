import * as React from 'react'
import { useState, useEffect, useContext, Fragment } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import { Member, Product, User, Version } from 'productboard-common'

import { VersionContext } from '../../contexts/Version'
import { computeTree } from '../../functions/tree'
import { MemberManager } from '../../managers/member'
import { ProductManager } from '../../managers/product'
import { UserManager } from '../../managers/user'
import { VersionManager } from '../../managers/version'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductHeader } from '../snippets/ProductHeader'
import { ProductUserNameWidget } from '../widgets/ProductUserName'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'

import * as LoadIcon from '/src/images/load.png'
import * as EmptyIcon from '/src/images/empty.png'
import * as LeftIcon from '/src/images/version.png'
import * as RightIcon from '/src/images/part.png'

export const ProductVersionView = (props: RouteComponentProps<{product: string}>) => {

    // CONTEXTS

    const { contextVersion, setContextVersion } = useContext(VersionContext)

    // PARAMS

    const productId = props.match.params.product

    // INITIAL STATES
    const initialProduct = productId == 'new' ? undefined : ProductManager.getProductFromCache(productId)
    const initialMembers = productId == 'new' ? undefined : MemberManager.findMembersFromCache(productId)
    const initialVersions = productId == 'new' ? undefined : VersionManager.findVersionsFromCache(productId)
    const initialUsers : {[id: string]: User} = {}
    for (const version of initialVersions || []) {
        const user = UserManager.getUserFromCache(version.userId)
        if (user) {
            initialUsers[version.id] = user
        }
    }
    const initialTree = computeTree(initialVersions)

    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>(initialProduct)
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [versions, setVersions] = useState<Version[]>(initialVersions)
    const [users, setUsers] = useState<{[id: string]: User}>(initialUsers)
    // - Computations
    const [children, setChildren] = useState<{[id: string]: Version[]}>(initialTree.children)
    const [childrenMin, setChildrenMin] = useState<{[id: string]: number}>(initialTree.childrenMin)
    const [childrenMax, setChildrenMax] = useState<{[id: string]: number}>(initialTree.childrenMax)
    const [siblings, setSiblings] = useState<{[id: string]: Version[]}>(initialTree.siblings)
    const [indents, setIndents] = useState<{[id: string]: number}>(initialTree.indents)
    const [indent, setIndent] = useState<number>(initialTree.indent)
    // - Interactions
    const [active, setActive] = useState<string>('left')

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { MemberManager.findMembers(productId).then(setMembers) }, [props])
    useEffect(() => { VersionManager.findVersions(productId).then(setVersions) }, [props])
    useEffect(() => {
        if (versions) {
            Promise.all(versions.map(version => UserManager.getUser(version.userId))).then(versionUsers => {
                const newUsers: {[id: string]: User} = {}
                for (let index = 0; index < versions.length; index++) {
                    newUsers[versions[index].id] = versionUsers[index]
                }
                setUsers(newUsers)
            })
        }
    }, [versions])
    useEffect(() => { !contextVersion && versions && versions.length > 0 && setContextVersion(versions[versions.length - 1])}, [versions])

    // - Computations
    useEffect(() => { 
        const tree = computeTree(versions)
        setChildren(tree.children)
        setSiblings(tree.siblings)
        setIndents(tree.indents)
        setIndent(tree.indent)
        setChildrenMin(tree.childrenMin)
        setChildrenMax(tree.childrenMax)
    }, [versions])

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Tree view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        <main className="view extended versions">
            {product && versions && contextVersion && (
                <Fragment>
                    {product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className={`sidebar ${active == 'left' ? 'hidden' : 'visible'}` }>
                                <div>
                                    <Link to={`/products/${productId}/versions/new/settings`} className='button green fill'>
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
                                                        <div className="text" style={{color: 'orange'}}/>
                                                    </div>
                                                )}
                                                <div className={`version${contextVersion.id == vers.id ? ' selected' : ''}`} onClick={() => setContextVersion(vers)}>
                                                    <div className="tree" style={{width: `${indent * 1.5 + 1.5}em`}}>
                                                        {vers.id in siblings && siblings[vers.id].map(sibling => (
                                                            <span key={sibling.id} className='line vertical sibling' style={{top: 0, left: `calc(${1.5 + indents[sibling.id] * 1.5}em - 1px)`, bottom: 0}}/>
                                                        ))}
                                                        {vers.id in childrenMin && vers.id in childrenMax && (
                                                            <span className='line horizontal parent' style={{top: 'calc(2.2em - 3px)', left: `calc(${1.5 + childrenMin[vers.id] * 1.5}em + 1px)`, width: `calc(${(childrenMax[vers.id] - childrenMin[vers.id]) * 1.5}em - 2px)`}}/>
                                                        )}
                                                        {vers.id in children && children[vers.id].map(child => (
                                                            <span className='line vertical child' key={child.id} style={{top: 0, left: `calc(${1.5 + indents[child.id] * 1.5}em - 1px)`, height: 'calc(2.2em + 1px)'}}/>
                                                        ))}
                                                        {vers.id in indents && (
                                                            <span className='line vertical parent' style={{top: 'calc(2em - 1px)', left: `calc(${1.5 + indents[vers.id] * 1.5}em - 1px)`, bottom: 0}}/>
                                                        )}
                                                        {vers.id in indents && (
                                                            <span className='dot parent' style={{top: '1.45em', left: `${0.75 + indents[vers.id] * 1.5}em`}}/>
                                                        )}
                                                    </div>
                                                    <div className="text">
                                                        <div>
                                                            <span className="label">{vers.major}.{vers.minor}.{vers.patch}</span>
                                                            {users[vers.id] && members ? (
                                                                <ProductUserPictureWidget user={users[vers.id]} members={members} class='icon medium round'/>
                                                            ) : (
                                                                <img src={LoadIcon} className='icon medium animation spin'/> 
                                                            )}
                                                            <span className="user">
                                                                <span className="name">
                                                                    {vers.id in users && users[vers.id] && members ? (
                                                                        <ProductUserNameWidget user={users[vers.id]} members={members}/>
                                                                    ) : (
                                                                        '?'
                                                                    )}
                                                                </span>
                                                                {/* Email temporär ausgeblendet */}
                                                                {/* <span className="email"> {vers.id in users && members ? <ProductUserEmailWidget user={users[vers.id]} members={members}/> : '?'}  </span> */}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="description">{vers.description}</span>
                                                        </div>
                                                    </div>
                                                    <div style={ { backgroundImage: `url("/rest/files/${vers.id}.png")` } } className="model"/>
                                                </div>
                                            </Fragment>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    {!versions || (versions.length > 0 && !contextVersion) && (
                                        <img src={LoadIcon} className='icon medium position center animation spin'/>
                                    )}
                                    {versions && versions.length == 0 && (
                                        <img src={EmptyIcon} className='icon medium position center'/>
                                    )}
                                    <ProductView3D product={product} mouse={true} vr={true}/>
                                </div>
                            </main>
                            <ProductFooter items={items} active={active} setActive={setActive}/>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </main>
    )

}