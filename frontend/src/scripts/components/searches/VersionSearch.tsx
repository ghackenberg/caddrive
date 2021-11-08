import * as React from 'react'
// Commons
import { Version } from 'fhooe-audit-platform-common'
// Clients
import { VersionAPI } from '../../clients/rest'
// Inputs
import { SearchInput } from '../inputs/SearchInput'

export const VersionSearch = (props: {product: string, change: (value: Version[]) => void}) => {

    const productId = props.product

    const [value, setValue] = React.useState<string>('')
    
    async function change(quick: string) {
        props.change(await VersionAPI.findVersions(quick, null, productId))
    }

    return (
        <SearchInput placeholder="Type query" value={value} change={value => {setValue(value), change(value)}}/>
    )

}