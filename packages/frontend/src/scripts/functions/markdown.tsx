import * as React from 'react'
import { createElement, MouseEvent } from "react"

import rehypeReact from "rehype-react"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

import { Comment } from 'productboard-common'

const PART_REGEX = /\/products\/(.*)\/versions\/(.*)\/objects\/(.*)/

const ATTACHMENT_REGEX = /\/products\/(.*)\/attachments\/(.*)\/file/

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
    return unified().use(remarkParse).use(remarkRehype).use(rehypeReact, {
        createElement, components: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            a: (props: any) => {
                //console.log('anchor', props)
                
                const part_match = PART_REGEX.exec(props.href || '')
                if (part_match) {
                    const productId = part_match[1]
                    const versionId = part_match[2]
                    const objectPath = part_match[3]
                    const objectName = props.children[0]
                    const part = { productId, versionId, objectPath, objectName }
                    return <a {...props} onMouseOver={event => handleMouseOver(event, part)} onMouseOut={event => handleMouseOut(event, part)} onClick={event => handleClick(event, part)}/>
                }

                const attachment_match = ATTACHMENT_REGEX.exec(props.href || '')
                if (attachment_match) {
                    return <a {...props} target='_blank'/>
                }

                return <a {...props} target='_blank'/>
            }
        }
    })
}