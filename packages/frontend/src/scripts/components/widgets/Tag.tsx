import * as React from 'react'
import { useParams } from 'react-router';

import { Tag } from 'productboard-common';

import { useTag } from '../../hooks/entity'
import { IssueCount } from '../counts/Issues';
export const TagWidget = (props: { tagId: string, onClick?: (tag: Tag) => void, active?: boolean, count?: boolean }) => {

    // PARAMS

    const { productId } = useParams<{ productId: string }>()
    const { milestoneId } = useParams<{ milestoneId: string }>()

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
                    {props.count &&  <span> (<IssueCount productId={productId} milestoneId={milestoneId} tags={[tag.id]}></IssueCount>)</span> }
                    
                </span>}
        </>
    )
}