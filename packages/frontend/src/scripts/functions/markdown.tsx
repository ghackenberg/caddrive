import * as React from 'react'
import { createElement, MouseEvent } from "react"
import rehypeReact from "rehype-react"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { Parent } from 'mdast'

const regex = /\/products\/(.*)\/versions\/(.*)\/objects\/(.*)/

export interface Part {
    productId: string
    versionId: string
    objectName: string
}

type Handler = (event: MouseEvent<HTMLAnchorElement>, part: Part) => void

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