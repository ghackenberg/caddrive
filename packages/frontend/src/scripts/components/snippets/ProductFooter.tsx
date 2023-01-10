import * as React from 'react'

export const ProductFooter = (props: {
    item1?: { text: string, image: string, sidebar: boolean, setSidebar: (sidebar: boolean) => void, set: boolean },
    item2?: { text: string, image: string, sidebar: boolean, setSidebar: (sidebar: boolean) => void, set: boolean }
}) => {
    return(
        <footer>
            <div/>
            <div>
                {props.item1 && (
                    <span>
                        <a className={`${props.item1.sidebar ? '' : 'active'}`} onClick={() => {props.item1.setSidebar(props.item1.set)}}>
                            <img src={require(`/src/images/${props.item1.image}.png`)}/>
                            {props.item1.text}
                        </a>
                    </span>
                )}
                {props.item2 && (
                    <span>
                        <a className={`${props.item2.sidebar ? 'active' : ''}`} onClick={() => {props.item2.setSidebar(props.item2.set)}}>
                            <img src= {require(`/src/images/${props.item2.image}.png`)}/>
                            {props.item2.text}
                        </a>
                    </span>
                )}  
            </div>
        </footer>
    )
}
