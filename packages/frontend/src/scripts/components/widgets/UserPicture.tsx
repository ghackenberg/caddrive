
import { useProfile } from '../../hooks/entity.js'
import PixelIcon from '/src/images/pixel.png'
import UserIcon from '/src/images/user.png'

export const UserPictureWidget = (props: { userId: string, background?: string, class?: string }) => {
    const profile = useProfile(props.userId)

    const isDeleted = profile && profile.data.deleted

    const src = isDeleted ? UserIcon : PixelIcon
    const title =  profile && profile.data.name

    const className = props.class

    const backgroundImage = `url(${profile && profile.data.pictureId ? `/rest/files/${profile.data.pictureId}.jpg` : UserIcon})`
    const backgroundSize = 'cover'
    const backgroundPosition = 'center'
    const backgroundColor = props.background || 'lightgray'

    const style = { backgroundImage, backgroundSize, backgroundPosition, backgroundColor }

    return <img src={src} title={title} style={style} className={className}/>
}