import * as React from 'react'

import { Tag } from 'productboard-common';

import { useTag } from '../../hooks/entity'
import { TagAssignmentCount } from '../counts/TagAssignments';

export const TagWidget = (props: { tagId: string, onClick?: (tag: Tag) => void, active?: boolean, count?: boolean }) => {

    // HOOKS

    const tag = useTag(props.tagId)

    // FUNCTIONS

    const handleClick = () => {
        props.onClick && props.onClick(tag);
      };

    return (
        <>
            {tag && 
                <span onClick={handleClick} className={`badge ${tag.color} ${props.active ? 'active' : ''}`}>
                    {tag.name} 
                    {props.count &&  <span> (<TagAssignmentCount tagId={tag.id}></TagAssignmentCount>)</span> }
                    
                </span>}
        </>
    )
}