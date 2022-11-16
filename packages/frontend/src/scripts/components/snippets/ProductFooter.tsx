import * as React from 'react'

export const ProductFooter = (props: {sidebar: boolean, setSidebar: React.Dispatch<React.SetStateAction<boolean>>, item1?:{text: string, image: string}, item2?:{text: string, image: string}  }) => {
    return(
        <footer>
            <div></div>
            <div>
                { props.item1 && <span> <a className= {`${props.sidebar ? '' :'active' }`} onClick={() => {props.setSidebar(false)}}> <img src= {require(`/src/images/${props.item1.image}.png`)}/>{props.item1.text}</a> </span> }
                { props.item1 && <span> <a className= {`${props.sidebar ? 'active' :'' }`} onClick={() => {props.setSidebar(true)}}> <img src= {require(`/src/images/${props.item2.image}.png`)}/>{props.item2.text}</a> </span> }
            </div>
        </footer>
    )
}