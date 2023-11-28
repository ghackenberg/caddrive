import * as React from 'react'
import { MouseEvent } from "react"

import * as jsxRuntime from 'react/jsx-runtime'
import rehypeReact, { Options } from "rehype-react"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

import { Comment } from 'productboard-common'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JSX_RUNTIME: any = jsxRuntime

const PART_REGEX = /\/products\/(.*)\/versions\/(.*)\/objects\/(.*)/

const ATTACHMENT_REGEX = /\/products\/(.*)\/attachments\/(.*)\/(.*)/

export interface Part {
    productId: string
    versionId: string
    objectPath: string
    objectName: string
}

type Handler = (event: MouseEvent<HTMLAnchorElement>, part: Part) => void

export function collectCommentParts(comments: {[id: string]: Comment[]}) {
    const commentPartsNew: {[id: string]: Part[]} = {}
    for (const issueId of Object.keys(comments || {})) {
        for (const comment of comments[issueId] || []) {
            const parts: Part[] = []
            collectParts(comment.text, parts)
            commentPartsNew[comment.commentId] = parts
        }
    }
    return commentPartsNew
}

export function collectParts(text: string, parts: Part[] = []) {
    const parser = unified().use(remarkParse)
    collectPartsInternal(parser.parse(text), parts)
    return parts
}

type Node = { type: string, value?: string, url?: string, children?: Node[] }

function collectPartsInternal(parent: Node, parts: Part[]) {
    for (const child of parent.children) {
        if (child.type == 'link') {
            const match = PART_REGEX.exec(child.url)
            if (match) {
                const productId = match[1]
                const versionId = match[2]
                const objectPath = match[3]
                const objectName = child.children.length == 1 && child.children[0].type == 'text' && child.children[0].value
                const part = { productId, versionId, objectPath, objectName }
                parts.push(part)
            }
        }
        if ('children' in child) {
            collectPartsInternal(child, parts)
        }
    }
}

export function createProcessor(handleMouseOver: Handler, handleMouseOut: Handler, handleClick: Handler) {
    const options: Options = {
        ...JSX_RUNTIME,
        components: {
            a: props => {
                let match: RegExpMatchArray
                // Part
                match = PART_REGEX.exec(props.href || '')
                if (match) {
                    const productId = match[1]
                    const versionId = match[2]
                    const objectPath = match[3]
                    const objectName = props.children.toString()
                    const part = { productId, versionId, objectPath, objectName }
                    return <a {...props} onMouseOver={event => handleMouseOver(event, part)} onMouseOut={event => handleMouseOut(event, part)} onClick={event => handleClick(event, part)}/>
                }
                // Attachment
                match = ATTACHMENT_REGEX.exec(props.href || '')
                if (match) {
                    const productId = match[1]
                    const attachmentId = match[2]
                    const name = decodeURIComponent(match[3])
                    console.log('file attachment found', productId, attachmentId, name)
                    return <a {...props} target='_blank'/>
                }

                return <a {...props} target='_blank'/>
            },
            img: props => {
                const match = ATTACHMENT_REGEX.exec(props.src || '')
                if (match) {
                    const productId = match[1]
                    const attachmentId = match[2]
                    const name = decodeURIComponent(match[3])
                    console.log('image attachment found', productId, attachmentId, name)
                    return <a href={props.src} target='_blank'><img {...props}/></a>
                }

                return <img {...props}/>
            }
        }
    }
    return unified().use(remarkParse).use(remarkRehype).use(rehypeReact, options)
}