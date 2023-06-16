import * as React from 'react'
import { useState, useContext, MouseEvent } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Object3D } from 'three'

import { Version } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { Part } from '../../functions/markdown'
import { computePath } from '../../functions/path'
import { useIssue, useProduct } from '../../hooks/entity'
import { useComments, useMembers } from '../../hooks/list'
// import { AttachmentManager } from '../../managers/attachment'
// import { CommentManager } from '../../managers/comment'
// import { IssueManager } from '../../managers/issue'
// import { AudioRecorder } from '../../services/recorder'
// import { FileInput } from '../inputs/FileInput'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
//import { CommentView } from '../widgets/CommentView'
// import { CommentView2 } from '../widgets/CommentView2'
import { CommentView3 } from '../widgets/CommentView3'
import { ProductUserNameWidget } from '../widgets/ProductUserName'
// import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'
import { LoadingView } from './Loading'

import LeftIcon from '/src/images/comment.png'
import RightIcon from '/src/images/part.png'
// import UserIcon from '/src/images/user.png'

export const ProductIssueCommentView = () => {

    // REFERENCES

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // PARAMS

    const { productId, issueId } = useParams<{ productId: string, issueId: string }>()

    // HOOKS

    const product = useProduct(productId)
    const members = useMembers(productId)
    const issue = useIssue(issueId)
    const comments = useComments(issueId)

    // STATES

    // - Values

    // const [audio, setAudio] = useState<Blob>()
    // const [image, setImage] = useState<File>()
    // console.log(image)

    // - Interactions
    // const [recorder, setRecorder] = useState<AudioRecorder>()
    // const [audioUrl, setAudioUrl] = useState<string>('')
    const [marked, setMarked] = useState<Part[]>()
    const [selected, setSelected] = useState<Part[]>()
    const [active, setActive] = useState<string>('left')
    const [selectedTimeStamp, setSelectedTimeStamp] = useState<number>()
    const [selectedVersion, setSelectedVersion] = useState<Version>()
    const [selectedObject, setSelectedObject] = useState<Object3D>()

    // EFFECTS

    // FUNCTIONS

    // async function startRecordAudio(event: React.MouseEvent<HTMLButtonElement>) {
    //     // TODO handle unmount!
    //     event.preventDefault()
    //     const recorder = new AudioRecorder()
    //     await recorder.start()
    //     setRecorder(recorder)
    // }

    // async function stopRecordAudio(event: React.MouseEvent<HTMLButtonElement>) {
    //     // TODO handle unmount!
    //     event.preventDefault()
    //     const data = await recorder.stop()
    //     setAudio(data)
    //     setAudioUrl(URL.createObjectURL(data))
    //     setRecorder(null)
    // }

    // async function removeAudio(event: React.MouseEvent<HTMLButtonElement>) {
    //     event.preventDefault()
    //     setAudio(null)
    //     setAudioUrl('')
    // }

    function handleMouseOver(event: MouseEvent<HTMLAnchorElement>, part: Part) {
        event.preventDefault()
        setSelected([part])
    }

    function handleMouseOut(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()
        setSelected(undefined)
    }

    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()
    }

    function overObject(version: Version, object: Object3D) {
        const path = computePath(object)
        setSelected([{ productId: version.productId, versionId: version.id, objectPath: path, objectName: object.name }])
    }

    function outObject() {
        setSelected([])
    }

    function selectObject(version: Version, object: Object3D) {

        setSelectedTimeStamp(Date.now())
        setSelectedVersion(version)
        setSelectedObject(object)

        // const path = computePath(object)
        // const markdown = `[${object.name || object.type}](/products/${product.id}/versions/${version.id}/objects/${path})`
        // if (document.activeElement == textReference.current) {
        //     const before = text.substring(0, textReference.current.selectionStart)
        //     const after = text.substring(textReference.current.selectionEnd)
        //     setText(`${before}${markdown}${after}`)
        //     setTimeout(() => {
        //         textReference.current.setSelectionRange(before.length + markdown.length, before.length + markdown.length)
        //     }, 0)
        // } else {
        //     setText(`${text}${markdown}`)
        //     setTimeout(() => {
        //         textReference.current.focus()
        //     }, 0)
        // }
    }

    // async function submitComment() {
    //     // TODO handle unmount!
    //     if (text || audio || image) {
    //         const comment = await CommentManager.addComment({ issueId: issue.id, text: text, action: 'none' }, {})
    //         setText('')
    //         if (audio) {
    //             await AttachmentManager.addAttachment({ commentId: comment.id, userId: contextUser.id, name: 'recording', type: 'webm', description: 'recording', data: 'data' }, { audio })
    //             setAudio(undefined)
    //         }
    //         if (image) {
    //             console.log(image)
    //             await AttachmentManager.addAttachment({ commentId: comment.id, userId: contextUser.id, name: 'picture', type: 'jpg', description: 'picture', data: 'data' }, { image })
    //             setImage(undefined)
    //         }
    //     }
    // }

    // async function submitCommentAndClose() {
    //     // TODO handle unmount!
    //     if (text) {
    //         await CommentManager.addComment({ issueId: issue.id, text: text, action: 'close' }, {})
    //         await IssueManager.updateIssue(issueId, { ...issue })
    //         setText('')
    //     }
    // }

    // async function submitCommentAndReopen() {
    //     // TODO handle unmount!
    //     if (text) {
    //         await CommentManager.addComment({ issueId: issue.id, text: text, action: 'reopen' }, {})
    //         await IssueManager.updateIssue(issueId, { ...issue })
    //         setText('')
    //     }
    // }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Thread view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        ((issueId == 'new' || issue) && product) ? (
            (issue && issue.deleted) ? (
                <Redirect to='/' />
            ) : (
                <>
                    <main className={`view product-issue-comment sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='header'>
                                {contextUser ? (
                                    members && members.filter(member => member.userId == contextUser.id).length == 1 ? (
                                        <NavLink to={`/products/${productId}/issues/${issueId}/settings`} className='button fill gray right'>
                                            <strong>Edit</strong> issue
                                        </NavLink>
                                    ) : (
                                        <a className='button fill gray right'>
                                            <strong>Edit</strong> issue <span className='badge'>requires role</span>
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill gray right'>
                                        <strong>Edit</strong> issue <span className='badge'>requires login</span>
                                    </a>
                                )}
                                <h1>
                                    {issue.name}
                                </h1>
                                <p>
                                    <span className={`state ${issue.state}`}>
                                        {issue.state}
                                    </span>
                                    &nbsp;
                                    <strong>
                                        <ProductUserNameWidget userId={issue.userId} productId={productId} />
                                    </strong>
                                    &nbsp;
                                    <>
                                        opened issue on {new Date(issue.created).toISOString().substring(0, 10)}
                                    </>
                                </p>
                            </div>
                            <div className='main'>
                                <div className="widget issue_thread">
                                    {comments && comments.map((comment, index) => (
                                        <CommentView3 key={comment.id} class={`${index == 0 ? 'first' : 'comment'}`} productId={productId} issueId={issueId} commentId={comment.id} selectedTimestamp={selectedTimeStamp} selectedVersion={selectedVersion} selectedObject={selectedObject} setMarked={setMarked} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick} />
                                    ))}
                                        <CommentView3 class={`${comments && comments.length == 0 ? 'first' : 'comment'} self`} productId={productId} issueId={issueId} commentId={'new'} selectedTimestamp={selectedTimeStamp} selectedVersion={selectedVersion} selectedObject={selectedObject} setMarked={setMarked} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick} />
                                </div>
                            </div>
                            <LegalFooter />
                        </div>
                        <div>
                            <ProductView3D productId={productId} issueId={issueId} mouse={true} marked={marked} selected={selected} over={overObject} out={outObject} click={selectObject} />
                        </div>
                    </main>
                    <ProductFooter items={items} active={active} setActive={setActive} />
                </>
            )
        ) : (
            <LoadingView />
        )
    )
}