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
      }

     function calcTextColor(): string {
        const r = parseInt(tag.color.substring(1, 3), 16);
        const g = parseInt(tag.color.substring(3, 5), 16);
        const b = parseInt(tag.color.substring(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        const textColor = brightness > 127 ? "#000000" : "#FFFFFF";
        return textColor
      }

    return (
        <>
            {tag && 
                <span onClick={handleClick} style={{backgroundColor: tag.color, color: calcTextColor()}} className={`badge ${props.active ? 'active' : ''}`}>
                    {tag.name} 
                    {props.count &&  <span> (<IssueCount productId={productId} milestoneId={milestoneId} tags={[tag.id]}></IssueCount>)</span> }
                    
                </span>}
        </>
    )
}