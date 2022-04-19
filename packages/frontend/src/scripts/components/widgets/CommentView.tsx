import * as React from 'react'
import { useContext, ReactElement, MouseEvent } from 'react'
// Commons
import { Comment, Issue, Member, User } from 'productboard-common'
// Contexts
import { UserContext } from '../../contexts/User'
// Icons
import * as PartIcon from '/src/images/part.png'
import * as CloseIcon from '/src/images/close.png'
import * as ReopenIcon from '/src/images/reopen.png'
import { ProductUserPictureWidget } from './ProductUserPicture'
import { ProductUserNameWidget } from './ProductUserName'

interface Part {
    productId: string
    versionId: string
    objectName: string
}

export const CommentView = (props: { class: string, comment: Issue | Comment, user?: User, html: ReactElement, parts: Part[], mouseover: (event: MouseEvent<HTMLAnchorElement>, part: Part) => void, mouseout: (event: MouseEvent<HTMLAnchorElement>, part: Part) => void, click: (event: MouseEvent<HTMLAnchorElement>, part: Part) => void, users: {[id: string]: User}, members: Member[] }) => {

    // CONTEXTS

    const user = useContext(UserContext)

    // CONSTANTS

    const comment = props.comment
    const users = props.users
    const members = props.members

    // RETURN

    return (
        <div key={comment.id} className={`${props.class}${comment.userId == user.id ? ' self' : ''}`}>
            <div className="head">
                <div className="icon">
                    <a href={`/users/${comment.userId}`}>
                        { comment.userId in users && members ? <ProductUserPictureWidget user={users[comment.userId]} members={members} class='big'/> : '?' }
                    </a>
                </div>
                <div className="text">
                    <p>
                        <strong>{props.user ? comment.userId in users && members ? <ProductUserNameWidget user={users[comment.userId]} members={members}/> : '?' : ''}</strong> commented on {comment.time.substring(0, 10)}
                        
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
            {props.parts && props.parts.map((part, index) => (
                <div key={index} className="note part">
                    <div className="free">

                    </div>
                    <div className="text">
                        <a href={`/products/${part.productId}/versions/${part.versionId}/objects/${part.objectName}`} onMouseOver={event => props.mouseover(event, part)} onMouseOut={event => props.mouseout(event, part)} onClick={event => props.click(event, part)}>
                            <span>
                                <img src={PartIcon}/>
                            </span>
                            {part.objectName}
                        </a>
                        was mentioned
                    </div>
                </div>
            ))}
            {'action' in comment && comment.action != 'none' && (
                <div className={`note action ${comment.action}`}>
                    <div className="free">

                    </div>
                    <div className="text">
                        <a>
                            <span>
                                <img src={comment.action == 'close' ? CloseIcon : ReopenIcon}/>
                            </span>
                        </a>
                        {comment.action == 'close' ? 'closed' : 'reopened'}
                    </div>
                </div>
            )}
        </div>
    )
    
}