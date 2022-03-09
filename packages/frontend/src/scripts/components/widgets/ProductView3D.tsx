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

export const ProductView3D = (props: { product?: Product, mouse: boolean, highlighted?: Part[], selected?: Part[], click?: (version: Version, object: Object3D) => void }) => {

    const [load, setLoad] = useState<boolean>(props.product !== undefined)
    const [versions, setVersions] = useState<Version[]>(null)
    
    useEffect(() => { props.product && VersionManager.findVersions(props.product.id).then(setVersions).then(() => setLoad(false)) }, [props])

    return (
        <div className="widget product_view">
            { load ? (
                <img className='load' src={LoadIcon}/>
            ) : (
                <Fragment>
                    { versions && versions.length > 0 ? (
                        <VersionView3D version={versions[versions.length - 1]} mouse={props.mouse} highlighted={(props.highlighted || []).map(part => part.objectName)} selected={(props.selected || []).map(part => part.objectName)} click={props.click && (object => props.click(versions[versions.length - 1], object))}/>
                    ) : (
                        <img className='empty' src={EmptyIcon}/>
                    )}
                </Fragment>
            )}
        </div>
    )
    
}