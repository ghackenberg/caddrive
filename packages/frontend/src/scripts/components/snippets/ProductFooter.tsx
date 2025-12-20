import { useLocation } from 'react-router'
import { back, pushState, replaceState } from '../../functions/history.js'

export type ProductFooterItem = {
    hash: string
    text: string
    image: string
}

export const ProductFooter = (props: { items: ProductFooterItem[] }) => {

    // LOCATION

    const { hash } = useLocation()

    // CONSTANTS

    const items = props.items

    // FUNCTIONS

    async function handleClick(event: React.UIEvent, item: ProductFooterItem) {
        event.preventDefault()
        if (!hash) {
            if (item.hash) {
                await pushState(item.hash)
            }
        } else {
            if (item.hash) {
                await replaceState(item.hash)
            } else {
                await back()
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
