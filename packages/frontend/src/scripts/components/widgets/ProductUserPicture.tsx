import * as React from 'react'

import { useUser } from '../../hooks/entity'
import { useMembers } from '../../hooks/list'

import DiagonalIcon from '/src/images/diagonal.png'
import LoadIcon from '/src/images/load.png'
import PixelIcon from '/src/images/pixel.png'
import UserIcon from '/src/images/user.png'

export const ProductUserPictureWidget = (props: { userId: string, productId: string, background?: string, class?: string }) => {
    const members = useMembers(props.productId)
    const user = useUser(props.userId)

    if (user && members) {       
        const isDeleted = user.deleted
        const isMember = members.map(member => member.userId).includes(user.userId)

        const src = isDeleted ? UserIcon : (isMember ? PixelIcon : DiagonalIcon)
        const title = user.name

        const className = props.class

        const backgroundImage = `url(${user.pictureId ? `/rest/files/${user.pictureId}.jpg` : UserIcon})`
        const backgroundSize = 'cover'
        const backgroundPosition = 'center'
        const backgroundColor = props.background || 'lightgray'

        const style = { backgroundImage, backgroundSize, backgroundPosition, backgroundColor }

        return <img src={src} title={title} style={style} className={className}/>
    } else {
        const className = `${props.class} pad animation spin`

        const backgroundColor = props.background || 'lightgray'

        const style = { backgroundColor }

        return <img src={LoadIcon} style={style} className={className}/>
    }
}