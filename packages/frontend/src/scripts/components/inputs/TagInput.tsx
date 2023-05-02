import * as React from 'react'

import { Tag } from 'productboard-common'

import { TagView } from '../widgets/TagView'
import { GenericInput } from './GenericInput'

export const TagInput = (props: { label: string, value: Tag[], productId: string, assignable: boolean }) => {

    return (
        <GenericInput label={props.label}>
            <TagView value={props.value} productId={props.productId} assignable={props.assignable}></TagView>
        </GenericInput>
    )
}