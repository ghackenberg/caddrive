import * as React from 'react'
import { createElement, MouseEvent } from "react"
import rehypeReact from "rehype-react"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { Parent } from 'mdast'
import { Issue, Comment } from 'productboard-common'

const regex = /\/products\/(.*)\/versions\/(.*)\/objects\/(.*)/

export interface Part {
    productId: string
    versionId: string
    objectName: string
}

type Handler = (event: MouseEvent<HTMLAnchorElement>, part: Part) => void

export function collectIssueParts(issues: Issue[]) {
    const issuePartsNew: { [id: string]: Part[] } = {}
    for (const issue of issues || []) {
        const parts: Part[] = []
        collectParts(issue.text, parts)
        issuePartsNew[issue.id] = parts
    }
    return issuePartsNew
}

export function collectCommentParts(comments: {[id: string]: Comment[]}) {
    const commentPartsNew: {[id: string]: Part[]} = {}
    for (const issueId of Object.keys(comments || {})) {
        for (const comment of comments[issueId] || []) {
            const parts: Part[] = []
            collectParts(comment.text, parts)
            commentPartsNew[comment.id] = parts
        }
    }
    return commentPartsNew
}

export function collectParts(text: string, parts: Part[]) {
    collectPartsInternal(unified().use(remarkParse).parse(text), parts)
}

function collectPartsInternal(parent: Parent, parts: Part[]) {
    for (const child of parent.children) {
        if (child.type == 'link') {
            const match = regex.exec(child.url)
            if (match) {
                const productId = match[1]
                const versionId = match[2]
                const objectName = match[3]
                const part = { productId, versionId, objectName }
                parts.push(part)
            }
        }
        if ('children' in child) {
            collectPartsInternal(child, parts)
        }
    }
}

export function createProcessor(parts: Part[], handleMouseOver: Handler, handleMouseOut: Handler, handleClick: Handler) {
    return unified().use(remarkParse).use(remarkRehype).use(rehypeReact, {
        createElement, components: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            a: (props: any) => {
                const match = regex.exec(props.href || '')
                if (match) {
                    const productId = match[1]
                    const versionId = match[2]
                    const objectName = match[3]
                    const part = { productId, versionId, objectName }
                    parts.push(part)
                    return <a {...props} onMouseOver={event => handleMouseOver(event, part)} onMouseOut={event => handleMouseOut(event, part)} onClick={event => handleClick(event, part)}/>
                } else {
                    return <a {...props}/>
                }
            }
        }
    })
}