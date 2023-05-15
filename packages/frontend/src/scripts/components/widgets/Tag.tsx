import * as React from 'react'

import { Tag } from 'productboard-common';

import { useTag } from '../../hooks/entity'

export const TagWidget = (props: { tagId: string, onClick?: (tag: Tag) => void, active?: boolean }) => {

    // HOOKS

    const tag = useTag(props.tagId)

    // FUNCTIONS

    const handleClick = () => {
        props.onClick && props.onClick(tag);
      };

    return (
        <>
            {tag && <span onClick={handleClick} className={`badge ${tag.color} ${props.active ? 'active' : ''}`}>{tag.name}</span>}
        </>
    )
}