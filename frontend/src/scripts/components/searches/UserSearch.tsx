import * as React from 'react'
// Commons
import { User } from 'fhooe-audit-platform-common'
// Clients
import { UserAPI } from '../../clients/rest'
// Inputs
import { TextInput } from '../inputs/TextInput'

export const UserSearch = (props: {change: (value: User[]) => void}) => {

    async function change(value: string) {
        props.change(await UserAPI.findUsers(value))
    }

    return (
        <form>
            <TextInput label="Query" placeholder="Search users" change={change}/> 
        </form>
    )

}