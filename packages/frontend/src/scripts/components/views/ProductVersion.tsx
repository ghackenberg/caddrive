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
import { computeColor, computeTree } from '../../functions/tree'
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

const STROKE_WIDTH = '3px'

function hsl(hue: number) {
    return `hsl(${hue}, 50%, 50%)`
}

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

    const color = computeColor(versions)
    const tree = computeTree(versions)
    const line = false

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
                                                        <svg width={`${1.5 + Math.max(1 + tree[curVersIdx - 1].afterRest.length, tree[curVersIdx].before.length) * 1.5}em`} height='3em'>
                                                            <defs>
                                                                {tree[curVersIdx - 1].afterFirst.map((prevVersId, prevVersIdx) => {
                                                                    const versionId = tree[curVersIdx - 1].versionId
                                                                    const id = `gradient-${curVersIdx}-${prevVersIdx}`
                                                                    const colorA = hsl(color[versionId])
                                                                    const colorB = hsl(color[prevVersId])
                                                                    return tree[curVersIdx].before.includes(prevVersId) && colorA != colorB && (
                                                                        <linearGradient key={prevVersId} id={id} x1='0' y1='0' x2='0' y2='100%'>
                                                                            <stop offset='0' stopColor={colorA}/>
                                                                            <stop offset='1' stopColor={colorB}/>
                                                                        </linearGradient>
                                                                    )
                                                                })}
                                                                {line && tree[curVersIdx - 1].afterRest.map((prevVersId, prevVersIdx) => {
                                                                    const id = `gradient-${curVersIdx}-${tree[curVersIdx - 1].afterFirst.length + prevVersIdx}`
                                                                    const colorA = hsl(color[prevVersId])
                                                                    const colorB = hsl(color[prevVersId])
                                                                    return tree[curVersIdx].before.includes(prevVersId) && colorA != colorB && (
                                                                        <linearGradient key={prevVersId} id={id} x1='0' y1='0' x2='0' y2='100%'>
                                                                            <stop offset='0' stopColor={colorA}/>
                                                                            <stop offset='1' stopColor={colorB}/>
                                                                        </linearGradient>
                                                                    )
                                                                })}
                                                            </defs>
                                                            {line ? (
                                                                <>
                                                                    {tree[curVersIdx - 1].afterFirst.map((prevVersId, prevVersIdx) => {
                                                                        
                                                                        const x1 = 24
                                                                        const x2 = 24 + tree[curVersIdx].before.indexOf(prevVersId) * 24

                                                                        const y1 = 0
                                                                        const y2 = 48

                                                                        const stroke = color[prevVersId] == color[tree[curVersIdx - 1].versionId] ? hsl(color[prevVersId]) : `url(#gradient-${curVersIdx}-${prevVersIdx})`
                                                                        const strokeWidth = STROKE_WIDTH
                                                                        
                                                                        const fill = 'none'
                                                                        
                                                                        return tree[curVersIdx].before.includes(prevVersId) && (
                                                                            <line key={prevVersId} x1={x1} y1={y1} x2={x2 + 0.0001} y2={y2} stroke={stroke} strokeWidth={strokeWidth} fill={fill}/>
                                                                        )

                                                                    })}
                                                                    {tree[curVersIdx - 1].afterRest.map((prevVersId, prevVersIdx) => {
                                                                        
                                                                        const x1 = 48 + prevVersIdx * 24
                                                                        const x2 = 24 + tree[curVersIdx].before.indexOf(prevVersId) * 24
                                                                        
                                                                        const y1 = 0
                                                                        const y2 = 48
                                                                        
                                                                        const stroke = hsl(color[prevVersId])
                                                                        const strokeWidth = STROKE_WIDTH
                                                                        
                                                                        const fill = 'none'
                                                                        
                                                                        return tree[curVersIdx].before.includes(prevVersId) && (
                                                                            <line key={prevVersId} x1={x1} y1={y1} x2={x2 + 0.0001} y2={y2} stroke={stroke} strokeWidth={strokeWidth} fill={fill}/>
                                                                        )

                                                                    })}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {tree[curVersIdx - 1].afterFirst.map((prevVersId, prevVersIdx) => {
                                                                        
                                                                        const x1 = 24
                                                                        const x2 = 24 + tree[curVersIdx].before.indexOf(prevVersId) * 24
                                                                       
                                                                        const y1 = 0
                                                                        const y2 = 28
                                                                        
                                                                        const d = `M ${x1} ${y1} C ${x1} ${y2} , ${x2} ${y1} , ${x2} ${y2} L ${x2} 48`
                                                                        
                                                                        const stroke = color[prevVersId] == color[tree[curVersIdx - 1].versionId] ? hsl(color[prevVersId]) : `url(#gradient-${curVersIdx}-${prevVersIdx})`
                                                                        const strokeWidth = STROKE_WIDTH
                                                                        
                                                                        const fill = 'none'

                                                                        return tree[curVersIdx].before.includes(prevVersId) && (
                                                                            x1 == x2 ? (
                                                                                <line key={prevVersId} x1={x1 + 0.0001} y1={y1} x2={x2} y2='48' stroke={stroke} strokeWidth={strokeWidth} fill={fill}/>
                                                                            ) : (
                                                                                <path key={prevVersId} d={d} stroke={stroke} strokeWidth={strokeWidth} fill={fill}/>
                                                                            )
                                                                        )

                                                                    })}
                                                                    {tree[curVersIdx - 1].afterRest.map((prevVersId, prevVersIdx) => {
                                                                        
                                                                        const x1 = 48 + prevVersIdx * 24
                                                                        const x2 = 24.0001 + tree[curVersIdx].before.indexOf(prevVersId) * 24
                                                                        
                                                                        const y1 = 16
                                                                        const y2 = 48
                                                                        
                                                                        const d = `M ${x1} 0 L ${x1} ${y1} C ${x1} ${y2} , ${x2} ${y1} , ${x2} ${y2}`
                                                                        
                                                                        const stroke = hsl(color[prevVersId])
                                                                        const strokeWidth = STROKE_WIDTH
                                                                        
                                                                        const fill = 'none'
                                                                        
                                                                        return tree[curVersIdx].before.includes(prevVersId) && (
                                                                            x1 == x2 ? (
                                                                                <line key={prevVersId} x1={x1} y1='0' x2={x2 + 0.0001} y2={y2} stroke={stroke} strokeWidth={strokeWidth} fill={fill}/>
                                                                            ) : (
                                                                                <path key={prevVersId} d={d} stroke={stroke} strokeWidth={strokeWidth} fill={fill}/>
                                                                            )
                                                                        )
                                                                    })}
                                                                </>
                                                            )}
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className={`version${contextVersion && contextVersion.versionId == curVers.versionId ? ' selected' : ''}`} onClick={event => onClick(event, curVers)}>
                                                    <div className="tree" style={{width: `${1.5 + tree[curVersIdx].before.length * 1.5}em`}}>
                                                        <svg width={`${1.5 + Math.max(tree[curVersIdx].before.length) * 1.5}em`} height='100%'>
                                                            {[...Array(tree[curVersIdx].before.length).keys()].map(number => {
                                                                
                                                                const hasNoSuccessors = (number == 0 && (curVersIdx == 0 || !(tree[curVersIdx - 1].afterFirst.includes(curVers.versionId) || tree[curVersIdx - 1].afterRest.includes(curVers.versionId))))
                                                                const hasNoPredecessors = (number == 0 && tree[curVersIdx].afterFirst.length == 0)

                                                                const x = `${1.5 + number * 1.5}em`
                                                                const y1 = (hasNoSuccessors ? '1.5em' : '0')
                                                                const y2 = (hasNoPredecessors ? '1.5em' : '100%')

                                                                const stroke = hsl(color[tree[curVersIdx].before[number]])
                                                                const strokeWidth = STROKE_WIDTH

                                                                const fill = 'none'

                                                                return <line key={number} x1={x} y1={y1} x2={x} y2={y2} stroke={stroke} strokeWidth={strokeWidth} fill={fill}/>

                                                            })}
                                                            <circle cx={24} cy={24} r={8} fill={hsl(color[curVers.versionId])}/>
                                                        </svg>
                                                        <span className='dot'/>
                                                    </div>
                                                    <div className="text">
                                                        <div>
                                                            <a className="download" title="Download model" href={`/rest/files/${curVers.versionId}.${curVers.modelType}`}>
                                                                <img src={DownloadIcon}/>
                                                            </a>
                                                            <span className="label" style={{backgroundColor: hsl(color[curVers.versionId])}}>
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