import * as React from 'react'

import { UserRead } from 'productboard-common'

import PixelIcon from '/src/images/pixel.png'
import UserIcon from '/src/images/user.png'

export const UserPictureWidget = (props: { user: UserRead, background?: string, class?: string }) => {
    const isDeleted = props.user.deleted

    const src = isDeleted ? UserIcon : PixelIcon
    const title =  props.user.email

    const className = props.class

    const backgroundImage = `url(${props.user.pictureId ? `/rest/files/${props.user.pictureId}.jpg` : UserIcon})`
    const backgroundSize = 'cover'
    const backgroundPosition = 'center'
    const backgroundColor = props.background || 'lightgray'

    const style = { backgroundImage, backgroundSize, backgroundPosition, backgroundColor }

    return <img src={src} title={title} style={style} className={className}/>
}