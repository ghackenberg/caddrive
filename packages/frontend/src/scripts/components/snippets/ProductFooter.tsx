import * as React from 'react'
import * as ListIcon from '/src/images/listview.png'
import * as PartIcon from '/src/images/part.png'


export const ProductFooter = (props: {sidebar: boolean, setSidebar: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return(
        <footer>
            <div></div>
            <div>
                <span> <a className= {`${props.sidebar ? '' :'active' }`} onClick={() => {props.setSidebar(false)}}> <img src= {ListIcon}/> List-View</a> </span>
                <span> <a className= {`${props.sidebar ? 'active' :'' }`} onClick={() => {props.setSidebar(true)}}> <img src= {PartIcon}/> 3D-View</a> </span>
            </div>
        </footer>
    )
}