import * as React from 'react'

import { Tag } from 'productboard-common';

import { useTag } from '../../hooks/route'

import LoadIcon from '/src/images/load.png'

export const TagWidget = (props: { tagId: string, onClick?: (tag: Tag) => void }) => {

    // HOOKS

    const handleClick = () => {
        props.onClick && props.onClick(tag);
      };

    const tag = useTag(props.tagId)

    return (
        <>
            {tag ? (<span onClick={handleClick} className={`badge ${tag.color}`}>{tag.name}</span>) : <img src={LoadIcon} className='icon medium pad animation spin' />}
        </>
    )
}