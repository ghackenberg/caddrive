import * as React from 'react'

import { UserContext } from '../../contexts/User'
import { useComment } from '../../hooks/entity'
import { collectParts, createProcessor } from '../../functions/markdown'
import { useAttachments } from '../../hooks/list'
import { ProductUserPictureWidget } from './ProductUserPicture'
import { ProductUserNameWidget } from './ProductUserName'

import PartIcon from '/src/images/part.png'
import CloseIcon from '/src/images/close.png'
import ReopenIcon from '/src/images/reopen.png'

interface Part {
    productId: string
    versionId: string
    objectPath: string
    objectName: string
}

export const CommentView = (props: { class: string, productId: string, issueId: string, commentId: string, mouseover: (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void, mouseout: (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void, click: (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void }) => {

    // CONTEXTS

    const { contextUser } = React.useContext(UserContext)

    // CONSTANTS

    const comment = useComment(props.commentId)
    const attachments = useAttachments(props.commentId)
    console.log(attachments)

    // INITIAL STATES

    const initialHtml = comment && createProcessor(props.mouseover, props.mouseout, props.click).processSync(comment.text).result
    const initialParts = comment && collectParts(comment.text)

    // STATES

    const [html, setHtml] = React.useState(initialHtml)
    const [parts, setParts] = React.useState(initialParts)

    // EFFECTS

    React.useEffect(() => {
        if (comment) {
            setHtml(createProcessor(props.mouseover, props.mouseout, props.click).processSync(comment.text).result)
            setParts(collectParts(comment.text))
        } else {
            setParts(undefined)
            setHtml(undefined)
        }
    }, [comment])

    // RETURN

    return (
        comment && (
            <div key={comment.id} className={`widget comment_view ${props.class} ${contextUser && comment.userId == contextUser.id ? 'self' : ''}`}>
                <div className="head">
                    <div className="icon">
                        <a href={`/users/${comment.userId}`}>
                            <ProductUserPictureWidget userId={comment.userId} productId={props.productId} class='big' />
                        </a>
                    </div>
                    <div className="text">
                        <p>
                            <strong><ProductUserNameWidget userId={comment.userId} productId={props.productId} /></strong> commented on {new Date(comment.created).toISOString().substring(0, 10)}
                        </p>
                    </div>
                </div>
                <div className="body">
                    <div className="free" />
                    <div className="text">
                        {html}
                        {/* {comment.audioId && <audio src={`/rest/files/${comment.audioId}.webm`} controls />} */}
                        {attachments &&
                            attachments.map(attachment => {
                                return attachment.type == 'webm'
                                    ? <audio key={attachment.id} src={`/rest/files/${attachment.id}.${attachment.type}`} controls />
                                    : attachment.type == 'png' || attachment.type == 'jpg' || attachment.type == 'jpeg'
                                    ? <img key={attachment.id} src={`/rest/files/${attachment.id}.${attachment.type}`}></img>
                                    : <> </>
                            })
                        }

                    </div>
                </div>
                {parts && parts.map((part, index) => (
                    <div key={index} className="note part">
                        <div className="free" />
                        <div className="text">
                            <a href={`/products/${part.productId}/versions/${part.versionId}/objects/${part.objectPath}`} onMouseOver={event => props.mouseover(event, part)} onMouseOut={event => props.mouseout(event, part)} onClick={event => props.click(event, part)}>
                                <span>
                                    <img src={PartIcon} />
                                </span>
                                {part.objectName}
                            </a>
                            was mentioned
                        </div>
                    </div>
                ))}
                {'action' in comment && comment.action != 'none' && (
                    <div className={`note action ${comment.action}`}>
                        <div className="free" />
                        <div className="text">
                            <a>
                                <span>
                                    <img src={comment.action == 'close' ? CloseIcon : ReopenIcon} />
                                </span>
                            </a>
                            {comment.action == 'close' ? 'closed' : 'reopened'}
                        </div>
                    </div>
                )}
            </div>
        )
    )

}