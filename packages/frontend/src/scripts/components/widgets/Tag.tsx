import * as React from 'react'

import { useTag } from '../../hooks/route'

import LoadIcon from '/src/images/load.png'

export const TagWidget = (props: { tagId: string }) => {

    // HOOKS

    const tag = useTag(props.tagId)

    return (
        <>
            {tag ? (<span className={`badge ${tag.color}`}>{tag.name}</span>) : <img src={LoadIcon} className='icon medium pad animation spin' />}
        </>
    )
}