import * as React from 'react'
import * as ListIcon from '/src/images/listview.png'
import * as PartIcon from '/src/images/part.png'

type SetPropType = {
    sidebar: boolean
    setSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

export const ProductFooter = ({sidebar ,setSidebar }: SetPropType) => {
    console.log(sidebar)
    return(
        <footer>
            <div></div>
            <div>
                <span> <a className= {`${sidebar ? '' :'active' }`} onClick={() => {setSidebar(false)}}> <img src= {ListIcon}/> List-View</a> </span>
                <span> <a className= {`${sidebar ? 'active' :'' }`} onClick={() => {setSidebar(true)}}> <img src= {PartIcon}/> 3D-View</a> </span>
            </div>
        </footer>
    )
}