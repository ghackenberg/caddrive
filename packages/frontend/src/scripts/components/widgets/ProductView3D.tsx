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
    objectName: string
}

export const ProductView3D = (props: { product: Product, mouse: boolean, highlighted?: Part[], marked?: Part[], selected?: Part[], click?: (version: Version, object: Object3D) => void, vr: boolean }) => {

    // CONTEXTS

    const versionContext = useContext(VersionContext)

    const { contextVersion, setContextVersion } = versionContext

    // INITIAL STATES

    const initialVersions = props.product && VersionManager.findVersionsFromCache(props.product.id)
    const initialHighlighted = (props.highlighted || []).filter(part => contextVersion && part.versionId == contextVersion.id).map(part => part.objectName)
    const initialMarked = (props.marked || []).filter(part => contextVersion && part.versionId == contextVersion.id).map(part => part.objectName)
    const initialSelected = (props.selected || []).filter(part => contextVersion && part.versionId == contextVersion.id).map(part => part.objectName)

    // STATES

    const [versions, setVersions] = useState<Version[]>(initialVersions)
    const [highlighted, setHighlighted] = useState<string[]>(initialHighlighted)
    const [marked, setMarked] = useState<string[]>(initialMarked)
    const [selected, setSelected] = useState<string[]>(initialSelected)

    // EFFECTS
    
    useEffect(() => { props.product && VersionManager.findVersions(props.product.id).then(setVersions) }, [props.product])
    useEffect(() => { !contextVersion && versions && versions.length > 0 && setContextVersion(versions[versions.length - 1])}, [versions])
    useEffect(() => { setHighlighted((props.highlighted || []).filter(part => contextVersion && part.versionId == contextVersion.id).map(part => part.objectName)) }, [versionContext, props.highlighted])
    useEffect(() => { setMarked((props.marked || []).filter(part => contextVersion && part.versionId == contextVersion.id).map(part => part.objectName)) }, [versionContext, props.marked])
    useEffect(() => { setSelected((props.selected || []).filter(part => contextVersion && part.versionId == contextVersion.id).map(part => part.objectName)) }, [versionContext, props.selected])

    // FUNCTIONS

    function changeVersion(versionId: string) {
        const version = versions.filter(version => version.id == versionId)[0]
        setContextVersion(version)
    }

    // RETURN
    
    return (
        <div className="widget product_view">
            {!versions ? (
                <img className='load' src={LoadIcon}/>
            ) : (
                <>
                    {versions.length > 0 ? (
                        <>
                            <header>
                                {contextVersion && (
                                    <select value={contextVersion.id} onChange={event => changeVersion(event.target.value)}>
                                        {versions.map(version => (
                                            <option key={version.id} value={version.id}>
                                                {version.major}.{version.minor}.{version.patch}: {version.description}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </header>
                            <main>
                                {contextVersion && (
                                    <VersionView3D version={contextVersion} mouse={props.mouse} highlighted={highlighted} marked={marked} selected={selected} click={props.click && (object => props.click(contextVersion, object))} vr={props.vr}/>
                                )}
                            </main>
                        </>
                    ) : (
                        <img className='empty' src={EmptyIcon}/>
                    )}
                </>
            )}
        </div>
    )
    
}