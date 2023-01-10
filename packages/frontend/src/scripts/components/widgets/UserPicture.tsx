import * as React from 'react'
import { Fragment } from 'react'

import { User } from 'productboard-common'

import * as PixelIcon from '/src/images/pixel.png'
import * as UserIcon from '/src/images/user.png'

export const UserPictureWidget = (props: { user: User, class?: string }) => {
    const className = props.class

    const backgroundImage = `url(${props.user.pictureId ? `/rest/files/${props.user.pictureId}.jpg` : UserIcon})`
    const backgroundSize = 'cover'
    const backgroundPosition = 'center'
    const backgroundColor = 'lightgray'

    const style = { backgroundImage, backgroundSize, backgroundPosition, backgroundColor }

    const isDeleted = props.user.deleted

    return (
        <Fragment>
            {isDeleted ? (
                <img src={UserIcon} style={style} className={className}/>
            ) : (
                <img src={PixelIcon} style={style} className={className}/>
            )}
        </Fragment>
    )
}