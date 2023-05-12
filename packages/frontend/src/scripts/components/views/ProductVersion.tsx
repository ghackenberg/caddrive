import * as React from 'react'
import { useState, useEffect, useContext, Fragment } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Version } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { VersionContext } from '../../contexts/Version'
import { useProduct } from '../../hooks/entity'
import { useMembers, useVersions } from '../../hooks/list'
import { computeTree } from '../../functions/tree'
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

    // HOOKS

    const product = useProduct(productId)
    const members = useMembers(productId)
    const versions = useVersions(productId)

    // INITIAL STATES

    const initialTree = computeTree(versions)

    // STATES

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
                                            <strong>New</strong> version
                                        </NavLink>
                                    ) : (
                                        <a className='button green fill' style={{fontStyle: 'italic'}}>
                                            <strong>New</strong> version (requires role)
                                        </a>
                                    )
                                ) : (
                                    <a className='button green fill' style={{fontStyle: 'italic'}}>
                                        <strong>New</strong> version (requires login)
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
                                                        <ProductUserPictureWidget userId={vers.userId} productId={productId} class='icon medium round middle'/>
                                                        <span className="user">
                                                            <span className="name">
                                                                <ProductUserNameWidget userId={vers.userId} productId={productId}/>
                                                            </span>
                                                            <span className="email">
                                                                <ProductUserEmailWidget userId={vers.userId} productId={productId}/>
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
                            <ProductView3D productId={productId} mouse={true}/>
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