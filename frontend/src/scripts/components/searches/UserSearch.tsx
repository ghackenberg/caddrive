import * as React from 'react'
// Commons
import { User } from 'fhooe-audit-platform-common'
// Clients
import { UserAPI } from '../../clients/rest'
// Inputs
import { SearchInput } from '../inputs/SearchInput'

export const UserSearch = (props: {change: (value: User[]) => void}) => {

    const [value, setValue] = React.useState<string>('')

    async function change(quick: string) {
        props.change(await UserAPI.findUsers(quick))
    }

    return (
        <SearchInput placeholder="Type query" value={value} change={value => {setValue(value), change(value)}}/> 
    )

}