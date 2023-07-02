import * as React from 'react'

import { UserContext } from '../../contexts/User'
import { useComment, useIssue } from '../../hooks/entity'
import { collectParts, createProcessor } from '../../functions/markdown'
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

export const CommentView = (props: { class: string, productId: string, issueId: string, commentId?: string, mouseover: (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void, mouseout: (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void, click: (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void }) => {

    // CONTEXTS

    const { contextUser } = React.useContext(UserContext)

    // CONSTANTS

    const productId = props.productId
    const issueId = props.issueId
    const commentId = props.commentId

    // HOOKS

    const entity = commentId ? useComment(productId, issueId, commentId) : useIssue(productId, issueId)

    // INITIAL STATES

    const initialHtml = entity && createProcessor(props.mouseover, props.mouseout, props.click).processSync(entity.text).result
    const initialParts = entity && collectParts(entity.text)

    // STATES

    const [html, setHtml] = React.useState(initialHtml)
    const [parts, setParts] = React.useState(initialParts)

    // EFFECTS

    React.useEffect(() => {
        if (entity) {
            setHtml(createProcessor(props.mouseover, props.mouseout, props.click).processSync(entity.text).result)
            setParts(collectParts(entity.text))
        } else {
            setParts(undefined)
            setHtml(undefined)
        }
    }, [entity])

    // RETURN

    return (
        entity && (
            <div key={entity.id} className={`widget comment_view ${props.class} ${contextUser && entity.userId == contextUser.id ? 'self' : ''}`}>
                <div className="head">
                    <div className="icon">
                        <a href={`/users/${entity.userId}`}>
                            <ProductUserPictureWidget userId={entity.userId} productId={props.productId} class='big'/>
                        </a>
                    </div>
                    <div className="text">
                        <p>
                            <strong><ProductUserNameWidget userId={entity.userId} productId={props.productId}/></strong> commented on {new Date(entity.created).toISOString().substring(0, 10)}
                        </p>
                    </div>
                </div>
                <div className="body">
                    <div className="free"/>
                    <div className="text">
                        {html}
                        {entity.audioId && <audio src={`/rest/files/${entity.audioId}.webm`} controls/>}
                    </div>
                </div>
                {parts && parts.map((part, index) => (
                    <div key={index} className="note part">
                        <div className="free"/>
                        <div className="text">
                            <a href={`/products/${part.productId}/versions/${part.versionId}/objects/${part.objectPath}`} onMouseOver={event => props.mouseover(event, part)} onMouseOut={event => props.mouseout(event, part)} onClick={event => props.click(event, part)}>
                                <span>
                                    <img src={PartIcon}/>
                                </span>
                                {part.objectName}
                            </a>
                            was mentioned
                        </div>
                    </div>
                ))}
                {'action' in entity && entity.action != 'none' && (
                    <div className={`note action ${entity.action}`}>
                        <div className="free"/>
                        <div className="text">
                            <a>
                                <span>
                                    <img src={entity.action == 'close' ? CloseIcon : ReopenIcon}/>
                                </span>
                            </a>
                            {entity.action == 'close' ? 'closed' : 'reopened'}
                        </div>
                    </div>
                )}
            </div>
        )
    )
    
}