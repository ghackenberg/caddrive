import * as React from 'react'

import shortid from 'shortid'

import { Attachment } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { collectParts, createProcessor } from '../../functions/markdown'
import { useComment, useIssue } from '../../hooks/entity'
import { useAttachments, useMembers } from '../../hooks/list'
import { AttachmentManager } from '../../managers/attachment'
import { CommentManager } from '../../managers/comment'
import { IssueManager } from '../../managers/issue'
import { AudioRecorder } from '../../services/recorder'
import { TextInput } from '../inputs/TextInput'
import { FileInputButton } from './FileInputButton'
import { ProductUserNameWidget } from './ProductUserName'
import { ProductUserPictureWidget } from './ProductUserPicture'

import PartIcon from '/src/images/part.png'
import CloseIcon from '/src/images/close.png'
import ReopenIcon from '/src/images/reopen.png'
import DeleteIcon from '/src/images/delete.png'
import StartRecordingIcon from '/src/images/startRecording.png'
import StopRecordingIcon from '/src/images/stopRecording.png'

import { Column, Table } from './Table'

interface Part {
    productId: string
    versionId: string
    objectPath: string
    objectName: string
}

export const CommentView3 = (props: { class: string, productId: string, issueId: string, commentId: string, mouseover: (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void, mouseout: (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void, click: (event: React.MouseEvent<HTMLAnchorElement>, part: Part) => void }) => {

    // REFERENCES

    const textReference = React.useRef<HTMLTextAreaElement>()

    // CONTEXTS

    const { contextUser } = React.useContext(UserContext)

    // CONSTANTS

    let comment = useComment(props.commentId)
    const issue = useIssue(props.issueId)
    const members = useMembers(props.productId)
    const initialAttachments = useAttachments(props.commentId)

    // INITIAL STATES

    const initialHtml = comment && createProcessor(props.mouseover, props.mouseout, props.click).processSync(comment.text).result
    const initialParts = comment && collectParts(comment.text)

    // STATES
    const [attachments, setAttachments] = React.useState<Attachment[]>()
    const [text, setText] = React.useState<string>('')
    const [html, setHtml] = React.useState(initialHtml)
    const [parts, setParts] = React.useState(initialParts)

    // INTERACTIONS
    const [editMode, setEditMode] = React.useState<boolean>(!comment)
    const [files] = React.useState<{ id: string, image: File, audio: Blob, pdf: File }[]>([])
    const [recorder, setRecorder] = React.useState<AudioRecorder>()
    const [audio, setAudio] = React.useState<Blob>()

    // EFFECTS

    React.useEffect(() => {
        setAttachments(initialAttachments || [])
    }, [initialAttachments]);

    React.useEffect(() => {
        if (comment) {
            setHtml(createProcessor(props.mouseover, props.mouseout, props.click).processSync(comment.text).result)
            setParts(collectParts(comment.text))
        } else {
            setParts(undefined)
            setHtml(undefined)
        }
    }, [comment])

    // CONSTANTS

    const columns: Column<Attachment>[] = [
        {
            label: 'Name', class: 'left nowrap', content: attachment => (
                
                editMode ? (

                    <div>
                       
                    <TextInput value={attachment.name} change={(text) => handleTextChange(attachments.indexOf(attachment), 'name' ,text)} ></TextInput>
                </div>
                    ) :
                    ( <div>
                        {attachment.name}
                    </div>)
            )
        },
        {
            label: 'Description', class: 'center', content: attachment => (
                editMode ? (

                    <div>
                       
                    <TextInput value={attachment.description} change={(text) => handleTextChange(attachments.indexOf(attachment), 'description' ,text)} ></TextInput>
                </div>
                    ) :
                    ( <div>
                        {attachment.description}
                    </div>)
            )
        },
        {
            label: 'Type', class: 'center nowrap', content: attachment => (
                <div>
                    {attachment.type}
                </div>
            )
        },
        {
            label: '🛠️', class: 'center', content: attachment => (
                <a onClick={event => deleteAttachment(event, attachment)}>
                    <img src={DeleteIcon} className='icon medium pad' />
                </a>
            )
        }
    ]

    async function startRecordAudio(event: React.MouseEvent<HTMLButtonElement>) {
        // TODO handle unmount!
        event.preventDefault()
        const recorder = new AudioRecorder()
        await recorder.start()
        setRecorder(recorder)
    }

    async function stopRecordAudio(event: React.MouseEvent<HTMLButtonElement>) {
        // TODO handle unmount!
        event.preventDefault()
        const data = await recorder.stop()
        addAttachment(undefined, data)
        setRecorder(null)
        // setAudioUrl(URL.createObjectURL(data))
    }

    async function removeAudio(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setAudio(null)
    }

    function handleTextChange(index: number, property: string, text: string) {
        setAttachments(attachments => {
          return attachments.map((attachment, idx) => {
            if (idx === index) {
              return { ...attachment, [property]: text }
            }
            return attachment;
          })
        })
      }

    async function submitComment() {
        // TODO handle unmount!
        if (text) {
            if (comment) {
                comment = await CommentManager.updateComment(comment.id, { ...comment, text: text }, {})
                setEditMode(false)
            }
            else {
                comment = await CommentManager.addComment({ issueId: issue.id, text: text, action: 'none' }, {})
                setAttachments([])
            }
            // delete attachments      
            (initialAttachments || []).forEach(initialAttachment => {
                const attachment = (attachments || []).find(attachment => attachment.id == initialAttachment.id)
                if (!attachment) {
                    AttachmentManager.deleteAttachment(initialAttachment.id)
                }
            })
            // add attachments
            attachments.length > 0 && (attachments || []).forEach(attachment => {
                const initialAttachment = (initialAttachments || []).find(initialAttachment => initialAttachment.id == attachment.id)
                if (!initialAttachment) {
                    const attachmentFile = files.find(file => file.id == attachment.id)
                    const image = attachmentFile.image
                    const audio = attachmentFile.audio 
                    const pdf = attachmentFile.pdf
                    AttachmentManager.addAttachment({ commentId: comment.id, userId: contextUser.id, name: attachment.name, type: attachment.type, description: attachment.description }, { audio, image, pdf })
                }
                // update attachments
                else if (initialAttachment) {
                    AttachmentManager.updateAttachment(attachment.id, { name: attachment.name, description: attachment.description, type: attachment.type }, { })
                }
            })
            setText('')
        }
    }

    async function submitCommentAndClose() {
        // TODO handle unmount!
        if (text) {
            await CommentManager.addComment({ issueId: issue.id, text: text, action: 'close' }, {})
            await IssueManager.updateIssue(issue.id, { ...issue })
            setText('')
        }
    }

    async function submitCommentAndReopen() {
        // TODO handle unmount!
        if (text) {
            await CommentManager.addComment({ issueId: issue.id, text: text, action: 'reopen' }, {})
            await IssueManager.updateIssue(issue.id, { ...issue })
            setText('')
        }
    }

    function enterEditMode() {
        setText(comment.text)
        setEditMode(true)
    }
    function exitEditMode() {
        setText('')
        setAttachments(initialAttachments)
        setEditMode(false)
    }

    async function deleteAttachment(event: React.UIEvent, attachment: Attachment) {
        // TODO handle unmount!
        event.stopPropagation()
        if (confirm('Do you really want to delete this attachment?')) {
            setAttachments(attachments => attachments.filter(prev => prev.id != attachment.id))
        }
    }
    function addAttachment(file?: File, audio?: Blob) {
        const id = shortid()
        let newAttachment: Attachment
        if (file && !audio) {
            console.log(file.type.includes('pdf'))
            newAttachment = { id: id, created: Date.now(), updated: Date.now(), deleted: null, userId: contextUser.id, commentId: props.commentId, name: file.name.split('.')[0], description: 'description', type: file.type.split('/')[1] }
            if (file.type.includes('pdf')) {
                files.push({ id: id, image: undefined, audio: undefined, pdf: file})
            }
            if (file.type.includes('image')) {
                files.push({ id: id, image: file, audio: undefined, pdf: undefined})
            }
        }
        if (!file && audio) {
            newAttachment = { id: id, created: Date.now(), updated: Date.now(), deleted: null, userId: contextUser.id, commentId: props.commentId, name: 'recording', description: 'description', type: 'webm' }
            files.push({ id: id, image: undefined, audio: audio, pdf: undefined})
        }
        setAttachments((prev) => [...prev, newAttachment])
    }
    
    function openInNewTab(attachment: Attachment) {
        console.log(attachment)
        const url = `/rest/files/${attachment.id}.${attachment.type}`
        window.open(url, '_blank');
    }

    // RETURN

    return (
        <>
            {
                (
                    <div key={comment ? comment.id : 'new'} className={`widget comment_view ${props.class} ${comment && contextUser && comment.userId == contextUser.id ? 'self' : ''}`}>
                        <div className="head">
                            <div className="icon">
                                {editMode == false ? (
                                    <a href={`/users/${comment.userId}`}>
                                        <ProductUserPictureWidget userId={comment.userId} productId={props.productId} class='big' />
                                    </a>
                                ) : (
                                    <a href={`/users/${contextUser.id}`}>
                                        <ProductUserPictureWidget userId={contextUser.id} productId={props.productId} class='big' />
                                    </a>
                                )
                                }
                            </div>
                            <div className="text">
                                {comment ? (
                                    <p>
                                        <strong><ProductUserNameWidget userId={comment.userId} productId={props.productId} /></strong> commented on {new Date(comment.updated).toISOString().substring(0, 10)}
                                    </p>
                                ) : (
                                    <p>
                                        <strong>New comment</strong>
                                    </p>
                                )
                                }
                                {comment && editMode == false && contextUser.id == comment.userId &&
                                    <button className='editIcon' onClick={enterEditMode}>🛠️</button>
                                }

                            </div>
                        </div>
                        <div className="body">
                            <div className="free" />
                            <div className="text">
                                {
                                    editMode == false && (
                                        <>
                                            {html}
                                            {/* {attachments &&
                                                attachments.map(attachment => {
                                                    return attachment.type == 'webm'
                                                        ? <audio key={attachment.id} src={`/rest/files/${attachment.id}.${attachment.type}`} controls />
                                                        : attachment.type == 'png' || attachment.type == 'jpg' || attachment.type == 'jpeg'
                                                            ? <img className='icon xxlarge' key={attachment.id} src={`/rest/files/${attachment.id}.${attachment.type}`}></img>
                                                            : <> </>
                                                })
                                            } */}
                                            {attachments && attachments.length > 0 && <Table columns={columns.slice(0, columns.length - 1)} items={attachments} onClick={(entry) => {openInNewTab(entry)}} />}
                                        </>
                                    )
                                }
                                {editMode == true &&
                                    <>
                                        <textarea ref={textReference} placeholder={'Type text'} value={text} onChange={event => setText(event.currentTarget.value)} />
                                        {attachments && attachments.length > 0 && <Table columns={columns} items={attachments}  />}
                                        {contextUser ? (
                                            members && members.filter(member => member.userId == contextUser.id).length == 1 ? (
                                                <>
                                                    {comment && (
                                                        contextUser.id == comment.userId && (
                                                            <>
                                                                <button className='button fill blue' onClick={submitComment}>Update</button>
                                                                <button className='button fill red' onClick={exitEditMode}>Cancel</button>
                                                            </>
                                                        )

                                                    )}
                                                    {!comment && (
                                                        <>
                                                            <button className='button fill blue' onClick={submitComment}>Save</button>
                                                            {issue.state == 'open' ? (
                                                                <button className='button stroke blue' onClick={submitCommentAndClose}>
                                                                    Close
                                                                </button>
                                                            ) : (
                                                                <button className='button stroke blue' onClick={submitCommentAndReopen}>
                                                                    Reopen
                                                                </button>
                                                            )}
                                                        </>
                                                    )
                                                    }
                                                    <FileInputButton class='button stroke gray' label='upload' change={(file) => { addAttachment(file, undefined) }} accept='.jpg,.jpeg,.png,.pdf' required={false}></FileInputButton>
                                                    {recorder ? (
                                                                <button onClick={stopRecordAudio} className='button stroke gray block-when-responsive'>
                                                                    <img className='icon' src={StopRecordingIcon}></img>
                                                                </button>
                                                            ) : (
                                                                audio ? (
                                                                    <>
                                                                        {/* <audio src={audioUrl} controls /> */}
                                                                        <button onClick={removeAudio} className='button stroke gray block-when-responsive'>
                                                                            Remove recording
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button onClick={startRecordAudio} className='button stroke gray block-when-responsive'>
                                                                        <img className='icon' src={StartRecordingIcon}></img>
                                                                    </button>
                                                                )
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
                                    </>
                                }

                            </div>
                        </div>
                        {comment && parts && parts.map((part, index) => (
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
                        {comment && 'action' in comment && comment.action != 'none' && (
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
        </>
    )
}