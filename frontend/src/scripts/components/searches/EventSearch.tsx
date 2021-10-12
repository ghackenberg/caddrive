import * as React from 'react'
// Commons
import { EventData } from 'fhooe-audit-platform-common'
// Clients
import { EventAPI } from '../../clients/rest'
// Inputs
import { TextInput } from '../inputs/TextInput'

export const EventSearch = (props: {audit: string, change: (value: (EventData & {id: string})[]) => void}) => {

    const [value, setValue] = React.useState<string>('')

    async function change(value: string) {
        props.change(await EventAPI.findEvents(value, props.audit))
    }

    return (
        <form>
            <TextInput label="Quick search" placeholder="Type query" value={value} change={value => {setValue(value), change(value)}}/>
        </form>
    )

}