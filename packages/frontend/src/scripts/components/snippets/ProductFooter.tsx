import * as React from 'react'
import { useLocation } from 'react-router'

import { useAsyncHistory } from '../../hooks/history'

export type ProductFooterItem = {
    hash: string
    text: string
    image: string
}

export const ProductFooter = (props: { items: ProductFooterItem[] }) => {

    // HISTORY

    const { goBack, push, replace } = useAsyncHistory()

    // LOCATION

    const { hash } = useLocation()

    // CONSTANTS

    const items = props.items

    // FUNCTIONS

    async function handleClick(event: React.UIEvent, item: ProductFooterItem) {
        event.preventDefault()
        if (!hash) {
            if (item.hash) {
                await push(item.hash)
            }
        } else {
            if (item.hash) {
                await replace(item.hash)
            } else {
                await goBack()
            }
        }
    }

    return (
        <footer className='page'>
            <div>
                {items.map(item => (
                    <span key={item.hash}>
                        <a className={hash == item.hash ? 'active' : ''} onClick={event => handleClick(event, item)}>
                            <img src={item.image} className='icon small'/>
                            <span>{item.text}</span>
                        </a>
                    </span>
                ))} 
            </div>
        </footer>
    )
}
