import * as React from 'react'
import { useContext, ReactElement } from 'react'
// Commons
import { Comment, Issue, User } from 'productboard-common'
// Contexts
import { UserContext } from '../../contexts/User'
// Icons
import * as UserIcon from '/src/images/user.png'

interface Part {
    productId: string
    versionId: string
    objectName: string
}

export const CommentView = (props: { class: string, comment: Issue | Comment, user?: User, html: ReactElement, parts: Part[] }) => {

    const user = useContext(UserContext)

    const comment = props.comment

    return (
        <div key={comment.id} className={`${props.class}${comment.userId == user.id ? ' self' : ''}`}>
            <div className="head">
                <div className="icon">
                    <a href={`/users/${comment.userId}`}>
                        <img src={UserIcon}/>
                    </a>
                </div>
                <div className="text">
                    <p>
                        <strong>{props.user ? props.user.name : ''}</strong> commented on {comment.time.substring(0, 10)}
                    </p>
                </div>
            </div>
            <div className="body">
                <div className="free">

                </div>
                <div className="text">
                    {props.html}
                </div>
            </div>
            {props.parts && props.parts.map((_part, index) => (
                <div key={index} className="part">

                </div>
            ))}
        </div>
    )
}