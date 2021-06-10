import * as React from 'react'
import { Object3D } from 'three'
import { NodeItem } from './NodeItem'

export const NodeList = (props: { list: Object3D[] }) => (
    <ul>
        {props.list.map((child, index) => (
            <NodeItem key={index} object={child}/>
        ))}
    </ul>
)