import * as React from 'react'

import { Tag } from 'productboard-common'

import { GenericDropdownWidget } from '../widgets/GenericDropdown'
import { TagWidget } from '../widgets/Tag'
import { GenericInput } from './GenericInput'

export const IssueFilterInput = (props: { label: string, tags: Tag[], selectedTags: Tag[], onClick: (tag: Tag) => void }) => {

    // FUNCTIONS
        
    const handleClick = (tag: Tag) => {
        props.onClick(tag)
      }

    return (
        <GenericInput label={props.label}>
            <GenericDropdownWidget>
                    {props.tags.map(tag => 
                        <TagWidget onClick={handleClick} key={tag.id} tagId={tag.id} active={props.selectedTags.includes(tag)} count={true}/> 
                    )}
            </GenericDropdownWidget>
        </GenericInput>
    )
}