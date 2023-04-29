import * as React from 'react'

export type ProductFooterItem = {
    name: string
    text: string
    image: string
}

export const ProductFooter = (props: { items: ProductFooterItem[], active: string, setActive: (name: string) => void }) => {
    return(
        <footer className='view'>
            <div>
                {props.items.map(item => (
                    <span key={item.name}>
                        <a className={item.name == props.active ? 'active' : ''} onClick={() => props.setActive(item.name)}>
                            <img src={item.image} className='icon small'/>
                            <span>{item.text}</span>
                        </a>
                    </span>
                ))} 
            </div>
        </footer>
    )
}
