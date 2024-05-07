import * as React from 'react'
import { useState, useEffect, useContext, Fragment } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { VersionRead } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { VersionContext } from '../../contexts/Version'
import { useProduct } from '../../hooks/entity'
import { useMembers, useVersions } from '../../hooks/list'
import { computeTree } from '../../functions/tree'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductUserName } from '../values/ProductUserName'
import { ProductUserEmail } from '../values/ProductUserEmail'
import { ProductUserPicture } from '../values/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'
import { LoadingView } from './Loading'

import LoadIcon from '/src/images/load.png'
import DownloadIcon from '/src/images/download.png'
import VersionIcon from '/src/images/version.png'
import PartIcon from '/src/images/part.png'

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
    const [children, setChildren] = useState<{[versionId: string]: VersionRead[]}>(initialTree.children)
    const [childrenMin, setChildrenMin] = useState<{[versionId: string]: number}>(initialTree.childrenMin)
    const [childrenMax, setChildrenMax] = useState<{[versionId: string]: number}>(initialTree.childrenMax)
    const [siblings, setSiblings] = useState<{[versionId: string]: VersionRead[]}>(initialTree.siblings)
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

    function onClick(version: VersionRead) {
        setContextVersion(version)
        setActive('right')
    }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Tree view', image: VersionIcon },
        { name: 'right', text: 'Model view', image: PartIcon }
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
                            <div className='header'>
                                {contextUser ? (
                                    contextUser.admin || members.filter(member => member.userId == contextUser.userId && member.role != 'customer').length == 1 ? (
                                        <NavLink to={`/products/${productId}/versions/new/settings`} className='button green fill'>
                                            <strong>New</strong> version
                                        </NavLink>
                                    ) : (
                                        <a className='button green fill'>
                                            <strong>New</strong> version <span className='badge'>requires role</span>
                                        </a>
                                    )
                                ) : (
                                    <NavLink to='/auth/email' className='button green fill'>
                                        <strong>New</strong> version <span className='badge'>requires login</span>
                                    </NavLink>
                                )}
                            </div>
                            { versions.length == 0 ? (
                                <div className='main center'>
                                    <div>
                                        <img src={VersionIcon}/>
                                        <p>No version found.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='main'>
                                    <div className="widget version_tree">
                                        { versions.map(version => version).reverse().map((vers, index) => (
                                            <Fragment key={vers.versionId}>
                                                {index > 0 && (
                                                    <div className="between">
                                                        <div className="tree" style={{width: `${indent * 1.5 + 1.5}em`}}>
                                                            {vers.versionId in siblings && siblings[vers.versionId].map(sibling => (
                                                                <span key={sibling.versionId} className='line vertical sibling' style={{top: 0, left: `calc(${1.5 + indents[sibling.versionId] * 1.5}em - 1px)`, bottom: 0}}/>
                                                            ))}
                                                            {vers.versionId in children && children[vers.versionId].map(child => (
                                                                <span className='line vertical child' key={child.versionId} style={{top: 0, left: `calc(${1.5 + indents[child.versionId] * 1.5}em - 1px)`, bottom: 0}}/>
                                                            ))}
                                                        </div>
                                                        <div className="text" style={{color: 'orange'}}/>
                                                    </div>
                                                )}
                                                <div className={`version${contextVersion && contextVersion.versionId == vers.versionId ? ' selected' : ''}`} onClick={() => onClick(vers)}>
                                                    <div className="tree" style={{width: `${indent * 1.5 + 1.5}em`}}>
                                                        {vers.versionId in siblings && siblings[vers.versionId].map(sibling => (
                                                            <span key={sibling.versionId} className='line vertical sibling' style={{top: 0, left: `calc(${1.5 + indents[sibling.versionId] * 1.5}em - 1px)`, bottom: 0}}/>
                                                        ))}
                                                        {vers.versionId in childrenMin && vers.versionId in childrenMax && (
                                                            <span className='line horizontal parent' style={{top: 'calc(2.5em - 3px)', left: `calc(${1.5 + childrenMin[vers.versionId] * 1.5}em + 1px)`, width: `calc(${(childrenMax[vers.versionId] - childrenMin[vers.versionId]) * 1.5}em - 2px)`}}/>
                                                        )}
                                                        {vers.versionId in children && children[vers.versionId].map(child => (
                                                            <span className='line vertical child' key={child.versionId} style={{top: 0, left: `calc(${1.5 + indents[child.versionId] * 1.5}em - 1px)`, height: 'calc(2.5em + 1px)'}}/>
                                                        ))}
                                                        {vers.versionId in indents && (
                                                            <span className='line vertical parent' style={{top: 'calc(2.5em - 1px)', left: `calc(${1.5 + indents[vers.versionId] * 1.5}em - 1px)`, bottom: 0}}/>
                                                        )}
                                                        {vers.versionId in indents && (
                                                            <span className='dot parent' style={{top: '1.75em', left: `${0.75 + indents[vers.versionId] * 1.5}em`}}/>
                                                        )}
                                                    </div>
                                                    <div className="text">
                                                        <div>
                                                            <a className="download" title="Download CAD model revision" href={`/rest/files/${vers.versionId}.${vers.modelType}`}>
                                                                <img src={DownloadIcon}/>
                                                            </a>
                                                            <span className="label">
                                                                {vers.major}.{vers.minor}.{vers.patch}
                                                            </span>
                                                            <ProductUserPicture userId={vers.userId} productId={productId} class='icon medium round middle'/>
                                                            <span className="user">
                                                                <span className="name">
                                                                    <ProductUserName userId={vers.userId} productId={productId}/>
                                                                </span>
                                                                <span className="email">
                                                                    <ProductUserEmail userId={vers.userId} productId={productId}/>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="description">
                                                                {vers.description}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="model">
                                                        {vers.imageType ? (
                                                            <em>
                                                                <img src={`/rest/files/${vers.versionId}.${vers.imageType}`} className="image"/>
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
                            )}
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