import * as React from 'react'
import { useState, useEffect, useContext, Fragment } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Member, Product, User, Version } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { VersionContext } from '../../contexts/Version'
import { VersionAPI } from '../../clients/mqtt/version'
import { computeTree } from '../../functions/tree'
import { MemberManager } from '../../managers/member'
import { ProductManager } from '../../managers/product'
import { UserManager } from '../../managers/user'
import { VersionManager } from '../../managers/version'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductUserNameWidget } from '../widgets/ProductUserName'
import { ProductUserEmailWidget } from '../widgets/ProductUserEmail'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'
import { LoadingView } from './Loading'

import LoadIcon from '/src/images/load.png'
import LeftIcon from '/src/images/version.png'
import RightIcon from '/src/images/part.png'

export const ProductVersionView = () => {

    // CONTEXTS

    const { contextUser } = useContext(UserContext)
    const { contextVersion, setContextVersion } = useContext(VersionContext)

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

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
    const [users, setUsers] = useState<{[versionId: string]: User}>(initialUsers)
    // - Computations
    const [children, setChildren] = useState<{[versionId: string]: Version[]}>(initialTree.children)
    const [childrenMin, setChildrenMin] = useState<{[versionId: string]: number}>(initialTree.childrenMin)
    const [childrenMax, setChildrenMax] = useState<{[versionId: string]: number}>(initialTree.childrenMax)
    const [siblings, setSiblings] = useState<{[versionId: string]: Version[]}>(initialTree.siblings)
    const [indents, setIndents] = useState<{[versionId: string]: number}>(initialTree.indents)
    const [indent, setIndent] = useState<number>(initialTree.indent)
    // - Interactions
    const [active, setActive] = useState<string>('left')

    // EFFECTS

    // - Entities
    useEffect(() => {
        let exec = true
        ProductManager.getProduct(productId).then(product => exec && setProduct(product))
        return () => { exec = false }
    }, [productId])
    useEffect(() => {
        let exec = true
        MemberManager.findMembers(productId).then(members => exec && setMembers(members))
        return () => { exec = false }
    }, [productId])
    useEffect(() => {
        let exec = true
        VersionManager.findVersions(productId).then(versions => exec && setVersions(versions))
        return () => { exec = false }
    }, [productId])

    useEffect(() => {
        let exec = true
        if (versions) {
            Promise.all(versions.map(version => UserManager.getUser(version.userId))).then(versionUsers => {
                if (exec) {
                    const newUsers: {[versionId: string]: User} = {}
                    for (let index = 0; index < versions.length; index++) {
                        newUsers[versions[index].id] = versionUsers[index]
                    }
                    setUsers(newUsers)
                }
            })
        }
        return () => { exec = false }
    }, [versions])

    // - Events
    useEffect(() =>  {
        return VersionAPI.register({
            create(version) {
                if (version.productId == productId) {
                    setVersions([...versions.filter(other => other.id != version.id), version])
                }
            },
            update(version) {
                setVersions(versions.map(other => other.id != version.id ? other : version))
            },
            delete(version) {
                setVersions(versions.filter(other => other.id != version.id))
            },
        })
    })

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

    // FUNCTIONS

    function onClick(version: Version) {
        setContextVersion(version)
        setActive('right')
    }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Tree view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        (product && members && versions) ? (
            (product && product.deleted) ? (
                <Redirect to='/'/>
            ) : (
                <>
                    <main className={`view product-version sidebar ${active == 'left' ? 'hidden' : 'visible'}` }>
                        <div>
                            <div>
                                {contextUser ? (
                                    members.filter(member => member.userId == contextUser.id && member.role != 'customer').length == 1 ? (
                                        <NavLink to={`/products/${productId}/versions/new/settings`} className='button green fill'>
                                            New version
                                        </NavLink>
                                    ) : (
                                        <a className='button green fill' style={{fontStyle: 'italic'}}>
                                            New version (requires role)
                                        </a>
                                    )
                                ) : (
                                    <a className='button green fill' style={{fontStyle: 'italic'}}>
                                        New version (requires login)
                                    </a>
                                )}
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
                                            <div className={`version${contextVersion && contextVersion.id == vers.id ? ' selected' : ''}`} onClick={() => onClick(vers)}>
                                                <div className="tree" style={{width: `${indent * 1.5 + 1.5}em`}}>
                                                    {vers.id in siblings && siblings[vers.id].map(sibling => (
                                                        <span key={sibling.id} className='line vertical sibling' style={{top: 0, left: `calc(${1.5 + indents[sibling.id] * 1.5}em - 1px)`, bottom: 0}}/>
                                                    ))}
                                                    {vers.id in childrenMin && vers.id in childrenMax && (
                                                        <span className='line horizontal parent' style={{top: 'calc(2.5em - 3px)', left: `calc(${1.5 + childrenMin[vers.id] * 1.5}em + 1px)`, width: `calc(${(childrenMax[vers.id] - childrenMin[vers.id]) * 1.5}em - 2px)`}}/>
                                                    )}
                                                    {vers.id in children && children[vers.id].map(child => (
                                                        <span className='line vertical child' key={child.id} style={{top: 0, left: `calc(${1.5 + indents[child.id] * 1.5}em - 1px)`, height: 'calc(2.5em + 1px)'}}/>
                                                    ))}
                                                    {vers.id in indents && (
                                                        <span className='line vertical parent' style={{top: 'calc(2.5em - 1px)', left: `calc(${1.5 + indents[vers.id] * 1.5}em - 1px)`, bottom: 0}}/>
                                                    )}
                                                    {vers.id in indents && (
                                                        <span className='dot parent' style={{top: '1.75em', left: `${0.75 + indents[vers.id] * 1.5}em`}}/>
                                                    )}
                                                </div>
                                                <div className="text">
                                                    <div>
                                                        <span className="label">{vers.major}.{vers.minor}.{vers.patch}</span>
                                                        {users[vers.id] && members ? (
                                                            <ProductUserPictureWidget user={users[vers.id]} members={members} class='icon medium round middle'/>
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
                                                            <span className="email">
                                                                {vers.id in users && members ? (
                                                                    <ProductUserEmailWidget user={users[vers.id]} members={members}/>
                                                                ) : (
                                                                    '?'
                                                                )} 
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="description">{vers.description}</span>
                                                    </div>
                                                </div>
                                                <div className="model">
                                                    {vers.imageType ? (
                                                        <em>
                                                            <img src={`/rest/files/${vers.id}.${vers.imageType}`} className="image"/>
                                                        </em>
                                                    ) : (
                                                        <span>
                                                            <img src={LoadIcon} className='icon small animation spin'/>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div>
                            <ProductView3D product={product} mouse={true}/>
                        </div>
                    </main>
                    <ProductFooter items={items} active={active} setActive={setActive}/>
                </>
            )
        ) : (
            <LoadingView/>
        )
    )

}