import * as React from 'react'

import { Tag } from 'productboard-common'

import { GenericDropdownWidget } from '../widgets/GenericDropdown'
import { TagWidget } from '../widgets/Tag'
import { GenericInput } from './GenericInput'

export const TagInput = (props: { label: string, tags: Tag[], productId: string, assignedTags: Tag[], issueId: string }) => {

    const handleClick = (tag: Tag) => {
        console.log(tag.id);
      }

    return (
        <GenericInput label={props.label}>
            <GenericDropdownWidget>
                    {props.tags.map(tag => 
                        <TagWidget onClick={handleClick} key={tag.id} tagId={tag.id}/> 
                    )}
            </GenericDropdownWidget>
        </GenericInput>
    )
}