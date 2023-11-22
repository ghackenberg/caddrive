import * as React from 'react'

import { Object3D } from 'three'

import { Version } from 'productboard-common'

import { CommentClient } from '../../clients/rest/comment'
import { CommentContext } from '../../contexts/Comment'
import { UserContext } from '../../contexts/User'
import { useComment, useIssue } from '../../hooks/entity'
import { useMembers } from '../../hooks/list'
import { collectParts, createProcessor } from '../../functions/markdown'
import { formatDateTime } from '../../functions/time'
import { computePath } from '../../functions/path'
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

enum Mode {
    VIEW, EDIT, PREVIEW
}

type ObjectHandler = (version: Version, object: Object3D) => void
type PartHandler = (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void
type SubHandler = (commentId: string, handler: ObjectHandler) => () => void
type UpdateHandler = (commentId: string, markedView: Part[], markedEdit: Part[]) => void

export const CommentView = (props: { productId: string, issueId: string, commentId?: string, sub: SubHandler, up: UpdateHandler, over: PartHandler, out: PartHandler, click: PartHandler }) => {

    // REFERENCES

    const textRef = React.useRef<HTMLTextAreaElement>()

    // CONTEXTS

    const { contextUser } = React.useContext(UserContext)
    const { contextComment, setContextComment } = React.useContext(CommentContext)

    // CONSTANTS

    const productId = props.productId
    const issueId = props.issueId
    const commentId = props.commentId

    const sub = props.sub
    const up = props.up
    const over = props.over
    const out = props.out
    const click = props.click

    // HOOKS

    const members = useMembers(productId)
    const issue = useIssue(productId, issueId)
    const comment = commentId && useComment(productId, issueId, commentId)

    const userId = comment ? comment.userId : (contextUser ? contextUser.userId : undefined)

    // INITIAL STATES

    const initialTextView = comment && comment.text
    const initialTextEdit = ''

    const initialHtmlView = initialTextView && createProcessor(over, out, click).processSync(initialTextView).result
    const initialHtmlEdit = createProcessor(over, out, click).processSync(initialTextEdit).result

    const initialPartsView = initialTextView && collectParts(initialTextView)
    const initialPartsEdit = collectParts(initialTextEdit)

    const initialMode = commentId ? Mode.VIEW : Mode.EDIT

    // STATES

    const [textView, setTextView] = React.useState(initialTextView)
    const [textEdit, setTextEdit] = React.useState(initialTextEdit)

    const [htmlView, setHtmlView] = React.useState(initialHtmlView)
    const [htmlEdit, setHtmlEdit] = React.useState(initialHtmlEdit)

    const [partsView, setPartsView] = React.useState(initialPartsView)
    const [partsEdit, setPartsEdit] = React.useState(initialPartsEdit)

    const [mode, setMode] = React.useState(initialMode)

    // EFFECTS

    React.useEffect(() => {
        return sub(commentId || '', (version, object) => {
            if (contextComment == comment && mode == Mode.EDIT) {
                const text = textEdit || ''
                const before = text.substring(0, textRef.current.selectionStart)
                const after = text.substring(textRef.current.selectionEnd)
                const markdown = `${before && before.charAt(before.length - 1) != '\n' ? '\n' : ''} - [${object.name} @ Version ${version.major}.${version.minor}.${version.patch}](/products/${productId}/versions/${version.versionId}/objects/${computePath(object)})${after && after.charAt(0) != '\n' ? '\n' : ''}`
                setTextEdit(`${before}${markdown}${after}`)
                setTimeout(() => {
                    textRef.current.setSelectionRange(before.length + markdown.length, before.length + markdown.length)
                    textRef.current.focus()
                }, 0)
            } else {
                console.log('not context comment')
            }
        })
    })

    React.useEffect(() => {
        if (textEdit) {
            setPartsEdit(collectParts(textEdit))
        } else {
            setPartsEdit(undefined)
        }
    }, [textEdit])

    React.useEffect(() => {
        if (textView) {
            setHtmlView(createProcessor(over, out, click).processSync(textView).result)
            setPartsView(collectParts(textView))
        } else {
            setPartsView(undefined)
            setHtmlView(undefined)
        }
    }, [textView])

    React.useEffect(() => {
        const view = (mode == Mode.VIEW ? partsView : (mode == Mode.PREVIEW ? partsEdit : undefined))
        const edit = (mode == Mode.EDIT && partsEdit)
        up(commentId || '', view, edit)
    }, [partsView, partsEdit, mode])

    // FUNCTIONS

    function handleFocus() {
        setContextComment(comment)
    }

    function handleEdit() {
        if (mode == Mode.VIEW) {
            setTextEdit(textView)
        }
        setMode(Mode.EDIT)
        setTimeout(() => {
            textRef.current.focus()
        }, 0)
    }

    async function handleCancel() {
        setTextEdit(initialTextEdit)
        setMode(initialMode)
        if (contextComment == comment) {
            setContextComment(undefined)
        }
    }

    async function handlePreview() {
        setHtmlEdit(createProcessor(over, out, click).processSync(textEdit).result)
        setMode(Mode.PREVIEW)
    }

    async function handleSave() {
        if (textEdit) {
            await CommentClient.updateComment(productId, issueId, commentId, { text: textEdit })
            setTextEdit('')
            setTextView(textEdit)
            setMode(Mode.VIEW)
            if (contextComment == comment) {
                setContextComment(undefined)
            }
        } else {
            alert('Please enter some text')
        }
    }
    async function handleAdd() {
        if (textEdit) {
            await CommentClient.addComment(productId, issueId, { text: textEdit, action: 'none' }, {})
            setTextEdit('')
            setMode(Mode.EDIT)
            if (contextComment == comment) {
                setContextComment(undefined)
            }
        } else {
            alert('Please enter some text')
        }
    }
    async function handleClose() {
        if (textEdit) {
            await CommentClient.addComment(productId, issueId, { text: textEdit, action: 'close' }, {})
            setTextEdit('')
            setMode(Mode.EDIT)
            if (contextComment == comment) {
                setContextComment(undefined)
            }
        } else {
            alert('Please enter some text')
        }
    }
    async function handleOpen() {
        if (textEdit) {
            await CommentClient.addComment(productId, issueId, { text: textEdit, action: 'reopen' }, {})
            setTextEdit('')
            setMode(Mode.EDIT)
            if (contextComment == comment) {
                setContextComment(undefined)
            }
        } else {
            alert('Please enter some text')
        }
    }

    // CONSTANTS

    const edit = <a onClick={handleEdit}>edit</a>
    const preview = <a onClick={handlePreview}>preview</a>
    const cancel = <a onClick={handleCancel}>cancel</a>
    const update = <a onClick={handleSave}>update</a>
    const add = <a onClick={handleAdd}>add</a>
    const close = <a onClick={handleClose}>add <em>and close issue</em></a>
    const open = <a onClick={handleOpen}>add <em>and re-open issue</em></a>

    const save = commentId ? update : <>{add} | {issue.state == 'open' ? close : open}</>
    const toggle = mode == Mode.VIEW ? edit : (mode == Mode.PREVIEW ? <>{edit} | preview | {cancel} | {save}</> : <>edit | {preview} | {cancel} | {save}</>) 
    const action = contextUser && comment && contextUser.userId == comment.userId ? <>({toggle})</> : <></>

    const parts = (mode == Mode.VIEW && partsView) || (mode == Mode.PREVIEW && partsEdit) || []

    const disabled = !members || !userId || members.filter(member => member.userId == userId).length == 0
    const placeholder = 'Enter your comment here.'

    // RETURN

    return (
        <div className={`widget comment_view ${contextUser && contextUser.userId == userId ? 'self' : ''}`}>
            <div className="head">
                <div className="icon">
                    <a href={`/users/${userId}`}>
                        <ProductUserPictureWidget userId={userId} productId={productId} class='big'/>
                    </a>
                </div>
                <div className="text">
                    <p>
                        {comment ? (
                            <>
                                <strong><ProductUserNameWidget userId={userId} productId={productId}/></strong> commented on {formatDateTime(new Date(comment.created))} {action}
                            </>
                        ) : (
                            <>
                                <strong>New comment</strong> ({disabled ? 'requires login' : toggle})
                            </>
                        )}
                    </p>
                </div>
            </div>
            <div className="body">
                <div className="free"/>
                <div className="text">
                    {mode == Mode.VIEW && htmlView}
                    {mode == Mode.PREVIEW && htmlEdit}
                    {mode == Mode.EDIT && <textarea ref={textRef} value={textEdit} onFocus={handleFocus} onChange={event => setTextEdit(event.currentTarget.value)} disabled={disabled} placeholder={placeholder}/>}
                </div>
            </div>
            {parts.map((part, index) => (
                <div key={index} className="note part">
                    <div className="free"/>
                    <div className="text">
                        <a href={`/products/${part.productId}/versions/${part.versionId}/objects/${part.objectPath}`} onMouseOver={event => props.over(event, part)} onMouseOut={event => props.out(event, part)} onClick={event => props.click(event, part)}>
                            <span>
                                <img src={PartIcon}/>
                            </span>
                            {part.objectName}
                        </a>
                        was mentioned
                    </div>
                </div>
            ))}
            {comment && comment.action != 'none' && (
                <div className={`note action ${comment.action}`}>
                    <div className="free"/>
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