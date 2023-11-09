import * as React from 'react'

import { CommentClient } from '../../clients/rest/comment'
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

    // REFERENCES

    const textReference = React.useRef<HTMLTextAreaElement>()

    // CONTEXTS

    const { contextUser } = React.useContext(UserContext)

    // CONSTANTS

    const productId = props.productId
    const issueId = props.issueId
    const commentId = props.commentId

    // HOOKS

    const entity = commentId ? useComment(productId, issueId, commentId) : useIssue(productId, issueId)

    // INITIAL STATES

    const initialText = entity && entity.text
    const initialHtml = initialText && createProcessor(props.mouseover, props.mouseout, props.click).processSync(initialText).result
    const initialParts = initialText && collectParts(initialText)
    const initialMode = 'view'

    // STATES

    const [textView, setTextView] = React.useState(initialText)
    const [textEdit, setTextEdit] = React.useState(initialText)
    const [text, setText] = React.useState(initialText)
    const [html, setHtml] = React.useState(initialHtml)
    const [parts, setParts] = React.useState(initialParts)
    const [mode, setMode] = React.useState(initialMode)

    // EFFECTS

    React.useEffect(() => {
        if (text) {
            setHtml(createProcessor(props.mouseover, props.mouseout, props.click).processSync(text).result)
            setParts(collectParts(text))
        } else {
            setParts(undefined)
            setHtml(undefined)
        }
    }, [text])

    // FUNCTIONS

    function handleEdit() {
        setMode('edit')
    }
    async function handleCancel() {
        setTextEdit(textView)
        setText(textView)
        setMode('view')
    }
    async function handlePreview() {
        setText(textEdit)
        setMode('preview')
    }
    async function handleSave() {
        await CommentClient.updateComment(productId, issueId, commentId, { text: textEdit })
        setTextView(textEdit)
        setText(textEdit)
        setMode('view')
    }

    // CONSTANTS

    const edit = <a onClick={handleEdit}>edit</a>
    const save = <a onClick={handleSave}>save</a>
    const cancel = <a onClick={handleCancel}>cancel</a>
    const preview = <a onClick={handlePreview}>preview</a>
    const toggle = mode == 'view' ? edit : (mode == 'preview' ? <>{edit} | preview | {cancel} | {save}</> : <>edit | {preview} | {cancel} | {save}</>) 
    const action = commentId && contextUser.userId == entity.userId ? <>({toggle})</> : <></>

    // RETURN

    return (
        entity && (
            <div key={'commentId' in entity ? entity.commentId : entity.issueId} className={`widget comment_view ${props.class} ${contextUser && entity.userId == contextUser.userId ? 'self' : ''}`}>
                <div className="head">
                    <div className="icon">
                        <a href={`/users/${entity.userId}`}>
                            <ProductUserPictureWidget userId={entity.userId} productId={props.productId} class='big'/>
                        </a>
                    </div>
                    <div className="text">
                        <p>
                            <strong><ProductUserNameWidget userId={entity.userId} productId={props.productId}/></strong> commented on {new Date(entity.created).toISOString().substring(0, 10)} {action}
                        </p>
                    </div>
                </div>
                <div className="body">
                    <div className="free"/>
                    <div className="text">
                        {(mode == 'view' || mode == 'preview') ? html : <textarea ref={textReference} value={textEdit} onChange={event => setTextEdit(event.currentTarget.value)}/>}
                        {entity.audioId && <audio src={`/rest/files/${entity.audioId}.webm`} controls/>}
                    </div>
                </div>
                {(mode == 'view' || mode == 'preview') && parts && parts.map((part, index) => (
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