import * as React from 'react'
// Commons
import { Audit } from 'fhooe-audit-platform-common'
// Clients
import { AuditAPI } from '../../clients/rest'
// Inputs
import { SearchInput } from '../inputs/SearchInput'

export const AuditSearch = (props: {version: string, change: (value: Audit[]) => void}) => {

    const versionId = props.version

    const [value, setValue] = React.useState<string>('')

    async function change(quick: string) {
        props.change(await AuditAPI.findAudits(quick, null, null, versionId))
    }

    return (
        <SearchInput placeholder="Type query" value={value} change={value => {setValue(value), change(value)}}/>
    )

}