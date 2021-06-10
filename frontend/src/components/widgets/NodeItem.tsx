import * as React from 'react'
import { Object3D } from 'three'
import { NodeList } from './NodeList'

export const NodeItem = (props: { object: Object3D }) => (
    <li>
        <em>{props.object.id}</em>
        <span> bzw. </span>
        <strong>{props.object.name}</strong>
        <span> : </span>
        <em>{props.object.type}</em>
        <NodeList list={props.object.children}/>
    </li>
)