import * as React from 'react'

import { Tag } from 'productboard-common'

import { TagView } from '../widgets/TagView'
import { GenericInput } from './GenericInput'

export const TagInput2
 = (props: { label: string, tags: Tag[], productId: string, assignable: boolean, assignedTags?: Tag[], issueId?: string }) => {

    return (
        <GenericInput label={props.label}>
            <TagView tags={props.tags} productId={props.productId} assignable={props.assignable} assignedTags= {props.assignedTags} issueId = {props.issueId}></TagView>
        </GenericInput>
    )
}