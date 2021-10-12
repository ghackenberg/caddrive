import * as React from 'react'
// Commons
import { Audit } from 'fhooe-audit-platform-common'
// Clients
import { AuditAPI } from '../../clients/rest'
// Inputs
import { TextInput } from '../inputs/TextInput'

export const AuditSearch = (props: {version: string, change: (value: Audit[]) => void}) => {

    async function change(value: string) {
        props.change(await AuditAPI.findAudits(undefined, value, undefined, props.version))
    }

    return (
        <form>
            <TextInput label="Quick search" placeholder="Type query here" change={change}/>
        </form>
    )

}