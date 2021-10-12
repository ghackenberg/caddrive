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
            <TextInput label="Quick search" placeholder="Type query here" change={change}/> 
        </form>
    )

}