import * as React from 'react'
// Commons
import { Version } from 'fhooe-audit-platform-common'
// Clients
import { VersionAPI } from '../../clients/rest'
// Inputs
import { TextInput } from '../inputs/TextInput'

export const VersionSearch = (props: {product: string, change: (value: Version[]) => void}) => {

    const [value, setValue] = React.useState<string>('')
    
    async function change(value: string) {
        props.change(await VersionAPI.findVersions(undefined, value, props.product))
    }

    return (
        <form>
            <TextInput label="Quick search" placeholder="Type query" value={value} change={value => {setValue(value), change(value)}}/>
        </form>
    )

}