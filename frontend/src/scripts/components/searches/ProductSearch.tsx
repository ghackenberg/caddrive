import * as React from 'react'
// Commons
import { Product } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI } from '../../clients/rest'
// Inputs
import { SearchInput } from '../inputs/SearchInput'

export const ProductSearch = (props: {change: (value: Product[]) => void}) => {

    const [value, setValue] = React.useState<string>('')
    
    async function change(value: string) {
        props.change(await ProductAPI.findProducts(value))
    }

    return (
        <SearchInput placeholder="Type query" value={value} change={value => {setValue(value), change(value)}}/>
    )

}