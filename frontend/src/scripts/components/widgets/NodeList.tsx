import * as React from 'react'
import { Object3D } from 'three'
import { NodeItem } from './NodeItem'

export const NodeList = (props: { list: Object3D[] }) => (
    <div className="widget node_list">
        <ul>
            {props.list.map((child, index) => (
                <li key={index}>
                    <NodeItem object={child}/>
                </li>
            ))}
        </ul>
    </div>
)