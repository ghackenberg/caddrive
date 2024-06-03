import * as React from 'react'
import { useState, useContext, Fragment } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { VersionRead } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { VersionContext } from '../../contexts/Version'
import { useAsyncHistory } from '../../hooks/history'
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

    // HISTORY

    const { push } = useAsyncHistory()

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

    // HOOKS

    const product = useProduct(productId)
    const members = useMembers(productId)
    const versions = useVersions(productId)

    // CONSTANTS

    const tree = computeTree(versions)
    const line = true

    // STATES
    
    // - Interactions
    const [active, setActive] = useState<string>('left')

    // FUNCTIONS

    async function onClick(event: React.MouseEvent<HTMLDivElement>, version: VersionRead) {
        if (event.ctrlKey) {
            await push(`/products/${productId}/versions/${version.versionId}/settings`)
        } else {
            setContextVersion(version)
            setActive('right')
        }
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
                                        { versions.map(i => i).reverse().map((curVers, curVersIdx) => (
                                            <Fragment key={curVers.versionId}>
                                                {curVersIdx > 0 && (
                                                    <div className="between">
                                                        <svg width={`${1.5 + Math.max(1 + tree[curVersIdx - 1].afterRest.length, tree[curVersIdx].before.length) * 1.5}em`} height='1em'>
                                                            {line && tree[curVersIdx - 1].afterFirst.map(prevVersId => (
                                                                tree[curVersIdx].before.includes(prevVersId) && (
                                                                    <line key={prevVersId} x1='1.5em' y1='0' x2={`${1.5 + tree[curVersIdx].before.indexOf(prevVersId) * 1.5}em`} y2='100%' stroke='gray' strokeWidth='2px' fill='transparent'/>
                                                                )
                                                            ))}
                                                            {line && tree[curVersIdx - 1].afterRest.map((prevVersId, prevVersIdx) => (
                                                                tree[curVersIdx].before.includes(prevVersId) && (
                                                                    <line key={prevVersId} x1={`${3.0 + prevVersIdx * 1.5}em`} y1='0' x2={`${1.5 + tree[curVersIdx].before.indexOf(prevVersId) * 1.5}em`} y2='100%' stroke='gray' strokeWidth='2px' fill='transparent'/>
                                                                )
                                                            ))}
                                                            {!line && tree[curVersIdx - 1].afterFirst.map((prevVersId, prevVersIdx) => (
                                                                tree[curVersIdx].before.includes(prevVersId) && (
                                                                    <path key={prevVersId} d={`M 24 0 C 24 ${(1 + prevVersIdx) / tree[curVersIdx - 1].afterFirst.length * 16} , ${24 + tree[curVersIdx].before.indexOf(prevVersId) * 24} 0 , ${24 + tree[curVersIdx].before.indexOf(prevVersId) * 24} 16`} stroke='gray' strokeWidth='2px' fill='transparent'/>
                                                                )
                                                            ))}
                                                            {!line && tree[curVersIdx - 1].afterRest.map((prevVersId, prevVersIdx) => (
                                                                tree[curVersIdx].before.includes(prevVersId) && (
                                                                    <path key={prevVersId} d={`M ${48 + prevVersIdx * 24} 0 C ${48 + prevVersIdx * 24} ${(1 + prevVersIdx) / tree[curVersIdx - 1].afterRest.length * 16} , ${24 + tree[curVersIdx].before.indexOf(prevVersId) * 24} 0 , ${24 + tree[curVersIdx].before.indexOf(prevVersId) * 24} 16`} stroke='gray' strokeWidth='2px' fill='transparent'/>
                                                                )
                                                            ))}
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className={`version${contextVersion && contextVersion.versionId == curVers.versionId ? ' selected' : ''}`} onClick={event => onClick(event, curVers)}>
                                                    <div className="tree" style={{width: `${1.5 + tree[curVersIdx].before.length * 1.5}em`}}>
                                                        {[...Array(tree[curVersIdx].before.length).keys()].map(number => {
                                                            
                                                            const hasNoSuccessors = (number == 0 && (curVersIdx == 0 || !(tree[curVersIdx - 1].afterFirst.includes(curVers.versionId) || tree[curVersIdx - 1].afterRest.includes(curVers.versionId))))
                                                            const hasNoPredecessors = (number == 0 && tree[curVersIdx].afterFirst.length == 0)

                                                            const top = (hasNoSuccessors ? '2.5em' : '0')
                                                            const left = `calc(${1.5 + number * 1.5}em - 1px)`
                                                            const bottom = (hasNoPredecessors ? 'auto' : '0')
                                                            const height = (hasNoPredecessors ? (hasNoSuccessors ? '0' : '2.5em') : 'auto')

                                                            return <span key={number} className='line' style={{ top, left, bottom, height }}/>

                                                        })}
                                                        <span className='dot'/>
                                                    </div>
                                                    <div className="text">
                                                        <div>
                                                            <a className="download" title="Download model" href={`/rest/files/${curVers.versionId}.${curVers.modelType}`}>
                                                                <img src={DownloadIcon}/>
                                                            </a>
                                                            <span className="label">
                                                                {curVers.major}.{curVers.minor}.{curVers.patch}
                                                            </span>
                                                            <ProductUserPicture userId={curVers.userId} productId={productId} class='icon medium round middle'/>
                                                            <span className="user">
                                                                <span className="name">
                                                                    <ProductUserName userId={curVers.userId} productId={productId}/>
                                                                </span>
                                                                <span className="email">
                                                                    <ProductUserEmail userId={curVers.userId} productId={productId}/>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="description">
                                                                {curVers.description}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="model">
                                                        {curVers.imageType ? (
                                                            <em>
                                                                <img src={`/rest/files/${curVers.versionId}.${curVers.imageType}`} className="image"/>
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