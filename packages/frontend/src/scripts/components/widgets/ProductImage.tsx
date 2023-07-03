import * as React from 'react'

import { useVersions } from '../../hooks/list'

import LoadIcon from '/src/images/load.png'
import EmptyIcon from '/src/images/empty.png'

export const ProductImageWidget = (props: { productId: string }) => {
    const versions = useVersions(props.productId)
    return (
        versions ? (
            versions.length > 0 ? (
                versions[versions.length - 1].imageType ? (
                    <div style={ { backgroundImage: `url("/rest/files/${versions[versions.length - 1].versionId}.${versions[versions.length - 1].imageType}")` } } className="model"/>
                ) : (
                    <div className="model">
                        <img src={LoadIcon} className='icon small position center animation spin'/>
                    </div>
                )
            ) : (
                <div className="model" >
                    <img src={EmptyIcon} className='icon medium position center'/>
                </div>
            )
        ) : (
            <div className="model" >
                <img src={LoadIcon} className='icon small position center animation spin'/>
            </div>
        )
    )
}