import * as React from 'react'
import { useEffect, useState, Fragment } from 'react'
import { Object3D } from 'three'
// Types
import { Product, Version } from 'productboard-common'
// Managers
import { VersionManager } from '../../managers/version'
// Widgets
import { VersionView3D } from './VersionView3D'
// Images
import * as LoadIcon from '/src/images/load.png'
import * as EmptyIcon from '/src/images/empty.png'

interface Part {
    productId: string
    versionId: string
    objectName: string
}

export const ProductView3D = (props: { product?: Product, version?: Version, mouse: boolean, highlighted?: Part[], marked?: Part[], selected?: Part[], click?: (version: Version, object: Object3D) => void, vr: boolean }) => {

    // STATES

    const [load, setLoad] = useState<boolean>(props.product !== undefined)
    const [versions, setVersions] = useState<Version[]>(null)

    const [version, setVersion] = useState<Version>(null)
    const [selectedVersion, setSelectedVersion] = useState<Version>(props.version)

    const [highlighted, setHighlighted] = useState<string[]>([])
    const [marked, setMarked] = useState<string[]>([])
    const [selected, setSelected] = useState<string[]>([])

    

    // EFFECTS
    
    useEffect(() => { props.product && VersionManager.findVersions(props.product.id).then(setVersions).then(() => setLoad(false)) }, [props])

    useEffect(() => { !selectedVersion && versions && versions.length > 0 && setVersion(versions[versions.length - 1]) }, [versions])
    useEffect(() => { selectedVersion && setVersion(selectedVersion) }, [selectedVersion, versions, props.version])
    useEffect(() => { setSelectedVersion(props.version) }, [props.version])


    useEffect(() => { setHighlighted((props.highlighted || []).filter(part => version && part.versionId == version.id).map(part => part.objectName)) }, [version, props.highlighted])
    useEffect(() => { setMarked((props.marked || []).filter(part => version && part.versionId == version.id).map(part => part.objectName)) }, [version, props.marked])
    useEffect(() => { setSelected((props.selected || []).filter(part => version && part.versionId == version.id).map(part => part.objectName)) }, [version, props.selected])
    
    // RETURN

   

    return (
        <div className="widget product_view">
            { load ? (
                <img className='load' src={LoadIcon}/>
            ) : (
                <Fragment>
                    { versions && versions.length > 0 ? (
                        <Fragment>
                            <header>
                                <select value={version.id} onChange={event => setSelectedVersion(versions.filter(version => version.id == event.currentTarget.value)[0])}>
                                   { versions.map((version) => <option key={version.id} value={version.id}>{version.major +'.' + version.minor  +'.'+ version.patch + ': ' + version.description}</option> )}
                                </select>
                            </header>
                            <main>
                                { version && <VersionView3D version={version} mouse={props.mouse} highlighted={highlighted} marked={marked} selected={selected} click={props.click && (object => props.click(version, object))} vr= {props.vr}/> }
                            </main>
                        </Fragment>
                    ) : (
                        <img className='empty' src={EmptyIcon}/>
                    )}
                </Fragment>
            )}
        </div>
    )
    
}