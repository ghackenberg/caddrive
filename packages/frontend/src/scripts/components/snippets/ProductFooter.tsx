import * as React from 'react'

export type ProductFooterItem = {
    name: string
    text: string
    image: string
}

export const ProductFooter = (props: { items: ProductFooterItem[], active: string, setActive: (name: string) => void }) => {
    // CONSTANTS

    const items = props.items
    const active = props.active
    const setActive = props.setActive

    // FUNCTIONS

    function handleClick(event: React.UIEvent, active: string) {
        event.preventDefault()
        setActive(active)
    }

    return (
        <footer className='page'>
            <div>
                {items.map(({ name, image, text }) => (
                    <span key={name}>
                        <a className={name == active ? 'active' : ''} onClick={event => handleClick(event, name)}>
                            <img src={image} className='icon small'/>
                            <span>{text}</span>
                        </a>
                    </span>
                ))} 
            </div>
        </footer>
    )
}
