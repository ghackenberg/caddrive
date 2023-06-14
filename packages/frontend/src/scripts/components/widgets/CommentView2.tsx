import * as React from 'react'

import { UserContext } from '../../contexts/User'
import { useComment, useIssue } from '../../hooks/entity'
import { collectParts, createProcessor } from '../../functions/markdown'
import { useMembers } from '../../hooks/list'
import { ProductUserPictureWidget } from './ProductUserPicture'
import { ProductUserNameWidget } from './ProductUserName'

import PartIcon from '/src/images/part.png'
import CloseIcon from '/src/images/close.png'
import ReopenIcon from '/src/images/reopen.png'

import { NavLink } from 'react-router-dom'

import UserIcon from '/src/images/user.png'

interface Part {
    productId: string
    versionId: string
    objectPath: string
    objectName: string
}

export const CommentView2 = (props: { mode?: string, text?: string, setText: React.Dispatch<React.SetStateAction<string>>, submitComment: () => void, submitCommentAndClose: () => void, submitCommentAndReopen: () => void, class: string, productId: string, issueId: string, commentId?: string, mouseover: (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void, mouseout: (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void, click: (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void }) => {

    // REFERENCES

    const textReference = React.useRef<HTMLTextAreaElement>()

    // CONTEXTS

    const { contextUser } = React.useContext(UserContext)

    // CONSTANTS

    const comment = props.mode == 'edit' ? undefined : useComment(props.commentId)
    const members = props.mode == 'edit' ? useMembers(props.productId) : []
    const issue = props.mode == 'edit' ? useIssue(props.issueId) : undefined

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
        <>
            {
                comment && props.mode == 'view' && (
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

                                {props.mode == 'view' && { html }}
                                {html}
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
            }
            {props.mode == 'edit' && (
                <div className={'comment self'}>
                    <div className="head">
                        <div className="icon">
                            {contextUser ? (
                                <NavLink to={`/users/${contextUser.id}`}>
                                    <ProductUserPictureWidget userId={contextUser.id} productId={props.productId} />
                                </NavLink>
                            ) : (
                                <a>
                                    <img src={UserIcon} className='icon small round' />
                                </a>
                            )}
                        </div>
                        <div className="text">
                            <p>
                                <strong>New comment</strong>
                            </p>
                        </div>
                    </div>
                    <div className="body">
                        <div className="free" />
                        <div className="text">
                            <textarea ref={textReference} placeholder={'Type text'} value={props.text} onChange={event => props.setText(event.currentTarget.value)} />
                            {contextUser ? (
                                members.filter(member => member.userId == contextUser.id).length == 1 ? (
                                    <>
                                        <button className='button fill blue' onClick={props.submitComment}>
                                            Save
                                        </button>
                                        {issue.state == 'open' ? (
                                            <button className='button stroke blue' onClick={props.submitCommentAndClose}>
                                                Close
                                            </button>
                                        ) : (
                                            <button className='button stroke blue' onClick={props.submitCommentAndReopen}>
                                                Reopen
                                            </button>
                                        )}
                                    </>

                                ) : (
                                    <>
                                        <button className='button fill gray block-when-responsive'>
                                            <span>Start recording</span>
                                            <span className='badge'>requires role</span>
                                        </button>
                                        <button className='button fill blue'>
                                            <span>Save</span>
                                            <span className='badge'>requires role</span>
                                        </button>
                                        {issue.state == 'open' ? (
                                            <button className='button stroke blue'>
                                                <span>Close</span>
                                                <span className='badge'>requires role</span>
                                            </button>
                                        ) : (
                                            <button className='button stroke blue'>
                                                <span>Reopen</span>
                                                <span className='badge'>requires role</span>
                                            </button>
                                        )}
                                    </>
                                )
                            ) : (
                                <>
                                    <button className='button fill gray block-when-responsive'>
                                        <span>Start recording</span>
                                        <span className='badge'>requires login</span>
                                    </button>
                                    <button className='button fill blue'>
                                        <span>Save</span>
                                        <span className='badge'>requires login</span>
                                    </button>
                                    {issue.state == 'open' ? (
                                        <button className='button stroke blue'>
                                            <span>Close</span>
                                            <span className='badge'>requires login</span>
                                        </button>
                                    ) : (
                                        <button className='button stroke blue'>
                                            <span>Reopen</span>
                                            <span className='badge'>requires login</span>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )
            }
        </>
    )

}