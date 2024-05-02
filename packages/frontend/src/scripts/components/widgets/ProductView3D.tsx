import * as React from 'react'
import { useEffect, useState, useContext } from 'react'

import { Object3D } from 'three'

import { VersionRead } from 'productboard-common'

import { VersionContext } from '../../contexts/Version'
import { useComments, useVersions } from '../../hooks/list'
import { collectParts } from '../../functions/markdown'
import { VersionView3D } from './VersionView3D'

import LoadIcon from '/src/images/load.png'
import EmptyIcon from '/src/images/empty.png'

interface Part {
    productId: string
    versionId: string
    objectPath: string
    objectName: string
}

export const ProductView3D = (props: { productId: string, issueId?: string, mouse: boolean, highlighted?: Part[], marked?: Part[], selected?: Part[], over?: (version: VersionRead, object: Object3D) => void, out?: (version: VersionRead, object: Object3D) => void, click?: (version: VersionRead, object: Object3D) => void }) => {
    // CONSTANTS
    
    const productId = props.productId
    const issueId = props.issueId

    // CONTEXTS

    const { contextVersion, setContextVersion } = useContext(VersionContext)

    // HOOKS

    const versions = useVersions(productId)
    const comments = useComments(productId, issueId)

    // INITIAL STATES

    const commentsParts = comments ? comments.map(comment => collectParts(comment.text)) : []
    const parts = commentsParts ? commentsParts.reduce((a, b) => a.concat(b), []) : []
    const partsId = parts.map(part => `${part.productId}/${part.versionId}/${part.objectPath}`).reduce((a, b) => `${a}#${b}`, '')

    const initialHighlighted = parts.concat(props.highlighted || []).filter(part => contextVersion && part.versionId == contextVersion.versionId).map(part => part.objectPath)
    const initialMarked = (props.marked || []).filter(part => contextVersion && part.versionId == contextVersion.versionId).map(part => part.objectPath)
    const initialSelected = (props.selected || []).filter(part => contextVersion && part.versionId == contextVersion.versionId).map(part => part.objectPath)

    // STATES

    const [highlighted, setHighlighted] = useState(initialHighlighted)
    const [marked, setMarked] = useState(initialMarked)
    const [selected, setSelected] = useState(initialSelected)

    // EFFECTS
    
    useEffect(() => {
        !contextVersion && versions && versions.length > 0 && setContextVersion(versions[versions.length - 1])
    }, [versions])

    useEffect(() => {
        setHighlighted(parts.concat(props.highlighted || []).filter(part => contextVersion && part.versionId == contextVersion.versionId).map(part => part.objectPath))
    }, [contextVersion, partsId, props.highlighted])
    useEffect(() => {
        setMarked((props.marked || []).filter(part => contextVersion && part.versionId == contextVersion.versionId).map(part => part.objectPath))
    }, [contextVersion, props.marked])
    useEffect(() => {
        setSelected((props.selected || []).filter(part => contextVersion && part.versionId == contextVersion.versionId).map(part => part.objectPath))
    }, [contextVersion, props.selected])

    // FUNCTIONS

    function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const version = versions.filter(version => version.versionId == event.currentTarget.value)[0]
        setContextVersion(version)
    }

    // RETURN
    
    return (
        <div className="widget product_view_3d">
            { props.productId != 'new' && (!versions || (versions.length > 0 && !contextVersion)) ? (
                <img src={LoadIcon} className='icon medium position center animation spin'/>
            ) : (
                props.productId != 'new' && versions.length > 0 ? (
                    <>
                        <select value={contextVersion.versionId} onChange={onChange} className='button fill lightgray'>
                            {versions.map(v => v).reverse().map((version, index) => (
                                <option key={index} value={version.versionId}>
                                    {version.major}.{version.minor}.{version.patch}: {version.description}
                                </option>
                            ))}
                        </select>
                        <VersionView3D version={contextVersion} mouse={props.mouse} highlighted={highlighted} marked={marked} selected={selected} over={props.over && (object => props.over(contextVersion, object))} out={props.out && (object => props.out(contextVersion, object))} click={props.click && (object => props.click(contextVersion, object))}/>
                    </>
                ) : (
                    <img src={EmptyIcon} className='icon medium position center'/>
                )
            )}
        </div>
    )
    
}