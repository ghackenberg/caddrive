import * as React from 'react'
// Commons
import { Audit } from 'fhooe-audit-platform-common'
// Clients
import { AuditAPI } from '../../clients/rest'
// Inputs
import { TextInput } from '../inputs/TextInput'

export const AuditSearch = (props: {version: string, change: (value: Audit[]) => void}) => {

    const [value, setValue] = React.useState<string>('')

    async function change(value: string) {
        props.change(await AuditAPI.findAudits(undefined, value, undefined, props.version))
    }

    return (
        <form>
            <TextInput label="Quick search" placeholder="Type query" value={value} change={value => {setValue(value), change(value)}}/>
        </form>
    )

}