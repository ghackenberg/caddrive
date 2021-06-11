import * as React from 'react'
import { Link } from 'react-router-dom'
import { Object3D } from 'three'
import { NodeList } from './NodeList'

export const NodeItem = (props: { object: Object3D }) => (
    <div className="widget node_item">
        <Link to="#">
            <img src={`/images/types/${props.object.type}.png`}/>
            {props.object.name || 'Anonymous'}
        </Link>
        <NodeList list={props.object.children}/>
    </div>
)