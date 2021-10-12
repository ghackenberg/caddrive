import * as React from 'react'
// Commons
import { Product } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI } from '../../clients/rest'
// Inputs
import { TextInput } from '../inputs/TextInput'

export const ProductSearch = (props: {change: (value: Product[]) => void}) => {
    
    async function change(value: string) {
        props.change(await ProductAPI.findProducts(value))
    }

    return (
        <form>
            <TextInput label="Quick search" placeholder="Type query here" change={change}/>
        </form>
    )

}