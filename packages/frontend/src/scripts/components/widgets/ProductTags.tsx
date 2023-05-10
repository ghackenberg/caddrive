import * as React from 'react'

import { useTags } from "../../hooks/route"
import { TagWidget } from '../widgets/Tag'

import LoadIcon from '/src/images/load.png'

export const ProductTagsWidget = (props: { productId: string }) => {

    // HOOKS

    const tags = useTags(props.productId)

    // RETURN

    return (
        <>
            {tags ? tags.map((tag) => <TagWidget tagId={tag.id} />) : <img src={LoadIcon} className='icon medium pad animation spin' />}
        </>
    )
}
