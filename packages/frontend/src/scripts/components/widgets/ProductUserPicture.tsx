import * as React from 'react'

import { Member, User } from 'productboard-common'

import DiagonalIcon from '/src/images/diagonal.png'
import PixelIcon from '/src/images/pixel.png'
import UserIcon from '/src/images/user.png'

export const ProductUserPictureWidget = (props: { user: User, members: Member[], background?: string, class?: string }) => {
    const isDeleted = props.user.deleted
    const isMember = props.members.map(member => member.userId).includes(props.user.id)

    const src = isDeleted ? UserIcon : (isMember ? PixelIcon : DiagonalIcon)
    const title = props.user.email

    const className = props.class

    const backgroundImage = `url(${props.user.pictureId ? `/rest/files/${props.user.pictureId}.jpg` : UserIcon})`
    const backgroundSize = 'cover'
    const backgroundPosition = 'center'
    const backgroundColor = props.background || 'lightgray'

    const style = { backgroundImage, backgroundSize, backgroundPosition, backgroundColor }

    return <img src={src} title={title} style={style} className={className}/>
}