import * as React from 'react'

export type ProductFooterItem = {
    name: string
    text: string
    image: string
}

export const ProductFooter = (props: { items: ProductFooterItem[], active: string, setActive: (name: string) => void }) => {
    return(
        <footer>
            <div/>
            <div>
                {props.items.map(item => (
                    <span key={item.name}>
                        <a className={item.name == props.active ? 'active' : ''} onClick={() => props.setActive(item.name)}>
                            <img src={item.image}/>
                            {item.text}
                        </a>
                    </span>
                ))} 
            </div>
        </footer>
    )
}
