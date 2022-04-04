import * as React from 'react'
import { Object3D } from 'three'
// Widgets
import { NodeItem } from './NodeItem'

export const NodeList = (props: { list: Object3D[], click?: (object: Object3D) => void }) => (
    <div className="widget node_list">
        <ul>
            {props.list.map((child, index) => (
                <li key={index}>
                    <NodeItem object={child} click={props.click}/>
                </li>
            ))}
        </ul>
    </div>
)