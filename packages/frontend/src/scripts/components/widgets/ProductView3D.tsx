import * as React from 'react'
import { useEffect, useState, useContext } from 'react'

import { Object3D } from 'three'

import { Product, Version } from 'productboard-common'

import { VersionContext } from '../../contexts/Version'
import { VersionManager } from '../../managers/version'
import { VersionView3D } from './VersionView3D'

import * as LoadIcon from '/src/images/load.png'
import * as EmptyIcon from '/src/images/empty.png'

interface Part {
    productId: string
    versionId: string
    objectPath: string
    objectName: string
}

export const ProductView3D = (props: { product: Product, mouse: boolean, highlighted?: Part[], marked?: Part[], selected?: Part[], click?: (version: Version, object: Object3D) => void }) => {

    // CONTEXTS

    const versionContext = useContext(VersionContext)

    const { contextVersion, setContextVersion } = versionContext

    // INITIAL STATES

    const initialVersions = props.product ? VersionManager.findVersionsFromCache(props.product.id) : []
    const initialHighlighted = (props.highlighted || []).filter(part => contextVersion && part.versionId == contextVersion.id).map(part => part.objectPath)
    const initialMarked = (props.marked || []).filter(part => contextVersion && part.versionId == contextVersion.id).map(part => part.objectPath)
    const initialSelected = (props.selected || []).filter(part => contextVersion && part.versionId == contextVersion.id).map(part => part.objectPath)

    // STATES

    const [versions, setVersions] = useState<Version[]>(initialVersions)
    const [highlighted, setHighlighted] = useState<string[]>(initialHighlighted)
    const [marked, setMarked] = useState<string[]>(initialMarked)
    const [selected, setSelected] = useState<string[]>(initialSelected)

    // EFFECTS
    
    useEffect(() => { props.product && VersionManager.findVersions(props.product.id).then(setVersions) }, [props.product])
    useEffect(() => { !contextVersion && versions && versions.length > 0 && setContextVersion(versions[versions.length - 1])}, [versions])
    useEffect(() => { setHighlighted((props.highlighted || []).filter(part => contextVersion && part.versionId == contextVersion.id).map(part => part.objectPath)) }, [versionContext, props.highlighted])
    useEffect(() => { setMarked((props.marked || []).filter(part => contextVersion && part.versionId == contextVersion.id).map(part => part.objectPath)) }, [versionContext, props.marked])
    useEffect(() => { setSelected((props.selected || []).filter(part => contextVersion && part.versionId == contextVersion.id).map(part => part.objectPath)) }, [versionContext, props.selected])

    // FUNCTIONS

    function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const version = versions.filter(version => version.id == event.currentTarget.value)[0]
        setContextVersion(version)
    }

    // RETURN
    
    return (
        <div className="widget product_view_3d">
            {!versions ? (
                <img src={LoadIcon} className='icon medium position center animation spin'/>
            ) : (
                versions.length > 0 ? (
                    contextVersion && (
                        <>
                            <select value={contextVersion.id} onChange={onChange} className='button fill lightgray'>
                                {versions.map(v => v).reverse().map(version => (
                                    <option key={version.id} value={version.id}>
                                        {version.major}.{version.minor}.{version.patch}: {version.description}
                                    </option>
                                ))}
                            </select>
                            <VersionView3D version={contextVersion} mouse={props.mouse} highlighted={highlighted} marked={marked} selected={selected} click={props.click && (object => props.click(contextVersion, object))}/>
                        </>
                    )
                ) : (
                    <img src={EmptyIcon} className='icon medium position center'/>
                )
            )}
        </div>
    )
    
}