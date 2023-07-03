import * as React from 'react'
import { useEffect, useState, useContext } from 'react'

import { Object3D } from 'three'

import { Version } from 'productboard-common'

import { VersionContext } from '../../contexts/Version'
import { collectParts } from '../../functions/markdown'
import { useIssue } from '../../hooks/entity'
import { useComments, useVersions } from '../../hooks/list'
import { VersionView3D } from './VersionView3D'

import LoadIcon from '/src/images/load.png'
import EmptyIcon from '/src/images/empty.png'

interface Part {
    productId: string
    versionId: string
    objectPath: string
    objectName: string
}

export const ProductView3D = (props: { productId: string, issueId?: string, mouse: boolean, marked?: Part[], selected?: Part[], over?: (version: Version, object: Object3D) => void, out?: (version: Version, object: Object3D) => void, click?: (version: Version, object: Object3D) => void }) => {
    // CONSTANTS
    
    const productId = props.productId
    const issueId = props.issueId

    // CONTEXTS

    const { contextVersion, setContextVersion } = useContext(VersionContext)

    // HOOKS

    const versions = useVersions(productId)
    const issue = useIssue(productId, issueId)
    const comments = useComments(productId, issueId)

    // INITIAL STATES

    const initialIssueParts = issueId ? (issue && collectParts(issue.text)) : []
    const initialCommentsParts = issueId ? (comments && comments.map(comment => collectParts(comment.text))) : []
    
    let initialParts: Part[] = undefined
    if (initialIssueParts && initialCommentsParts) {
        initialParts = [...initialIssueParts]
        for (const initialCommentParts of initialCommentsParts) {
            initialParts = initialParts.concat(initialCommentParts)
        }
    }

    const initialHighlighted = initialParts && initialParts.filter(part => contextVersion && part.versionId == contextVersion.versionId).map(part => part.objectPath)
    const initialMarked = (props.marked || []).filter(part => contextVersion && part.versionId == contextVersion.versionId).map(part => part.objectPath)
    const initialSelected = (props.selected || []).filter(part => contextVersion && part.versionId == contextVersion.versionId).map(part => part.objectPath)

    // STATES

    const [issueParts, setIssueParts] = useState(initialIssueParts)
    const [commentsParts, setCommentsParts] = useState(initialCommentsParts)
    const [parts, setParts] = useState(initialParts)

    const [highlighted, setHighlighted] = useState(initialHighlighted)
    const [marked, setMarked] = useState(initialMarked)
    const [selected, setSelected] = useState(initialSelected)

    // EFFECTS
    
    useEffect(() => {
        !contextVersion && versions && versions.length > 0 && setContextVersion(versions[versions.length - 1])
    }, [versions])

    useEffect(() => {
        if (issue) {
            setIssueParts(collectParts(issue.text))
        } else {
            setIssueParts(undefined)
        }
    }, [issue])
    useEffect(() => {
        if (comments) {
            setCommentsParts(comments.map(comment => collectParts(comment.text)))
        } else {
            setCommentsParts(undefined)
        }
    }, [comments])
    useEffect(() => {
        if (issueParts && commentsParts) {
            let parts = [...issueParts]
            for (const commentParts of commentsParts) {
                parts = parts.concat(commentParts)
            }
            setParts(parts)
        } else {
            setParts(undefined)
        }
    }, [issueParts, commentsParts])

    useEffect(() => {
        setHighlighted((parts || []).filter(part => contextVersion && part.versionId == contextVersion.versionId).map(part => part.objectPath))
    }, [contextVersion, parts])
    useEffect(() => {
        setMarked((props.marked || []).filter(part => contextVersion && part.versionId == contextVersion.versionId).map(part => part.objectPath))
    }, [contextVersion, props.marked])
    useEffect(() => {
        setSelected((props.selected || []).filter(part => contextVersion && part.versionId == contextVersion.versionId).map(part => part.objectPath))
    }, [contextVersion, props.selected])

    // FUNCTIONS

    function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const version = versions.filter(version => version.versionId == event.currentTarget.value)[0]
        setContextVersion(version)
    }

    // RETURN
    
    return (
        <div className="widget product_view_3d">
            { props.productId != 'new' && (!versions || (versions.length > 0 && !contextVersion)) ? (
                <img src={LoadIcon} className='icon medium position center animation spin'/>
            ) : (
                props.productId != 'new' && versions.length > 0 ? (
                    <>
                        <select value={contextVersion.versionId} onChange={onChange} className='button fill lightgray'>
                            {versions.map(v => v).reverse().map((version, index) => (
                                <option key={index} value={version.versionId}>
                                    {version.major}.{version.minor}.{version.patch}: {version.description}
                                </option>
                            ))}
                        </select>
                        <VersionView3D version={contextVersion} mouse={props.mouse} highlighted={highlighted} marked={marked} selected={selected} over={props.over && (object => props.over(contextVersion, object))} out={props.out && (object => props.out(contextVersion, object))} click={props.click && (object => props.click(contextVersion, object))}/>
                    </>
                ) : (
                    <img src={EmptyIcon} className='icon medium position center'/>
                )
            )}
        </div>
    )
    
}