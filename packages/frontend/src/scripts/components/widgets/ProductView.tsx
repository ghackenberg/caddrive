import * as React from 'react'
import { useEffect, useState, Fragment } from 'react'
import { Object3D } from 'three'
// Types
import { Product, Version } from 'productboard-common'
// Clients
import { VersionAPI } from '../../clients/rest'
// Widgets
import { ModelView } from './ModelView'
// Images
import * as LoadIcon from '/src/images/load.png'
import * as EmptyIcon from '/src/images/empty.png'

interface Part {
    productId: string
    versionId: string
    objectName: string
}

export const ProductView = (props: { product?: Product, mouse: boolean, highlighted?: Part[], selected?: Part[], click?: (version: Version, object: Object3D) => void }) => {

    const [load, setLoad] = useState<boolean>(props.product !== undefined)
    const [versions, setVersions] = useState<Version[]>(null)
    
    useEffect(() => { props.product && VersionAPI.findVersions(props.product.id).then(setVersions).then(() => setLoad(false)) }, [props])

    return (
        <div className="widget product_view">
            { load ? (
                <img className='load' src={LoadIcon}/>
            ) : (
                <Fragment>
                    { versions && versions.length > 0 ? (
                        <ModelView url={`/rest/models/${versions[versions.length - 1].id}`} mouse={props.mouse} highlighted={(props.highlighted || []).map(part => part.objectName)} selected={(props.selected || []).map(part => part.objectName)} click={props.click && (object => props.click(versions[versions.length - 1], object))}/>
                    ) : (
                        <img className='empty' src={EmptyIcon}/>
                    )}
                </Fragment>
            )}
        </div>
    )
    
}