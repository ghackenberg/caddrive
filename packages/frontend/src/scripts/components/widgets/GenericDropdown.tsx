import * as React from 'react'

import DownIcon from '/src/images/down.png'
import UpIcon from '/src/images/up.png'

export const GenericDropdownWidget = (props: { children?: React.ReactNode }) => {

    // - Interactions
    
    const [expanded, setExpanded] = React.useState<boolean>(false)

    return (
        <div className={`widget generic_dropdown button fill lightgray ${expanded ? 'expanded' : 'collapsed'}`}>
            <div className='dropdown_toggle' onClick={() => setExpanded((expanded) => !expanded)}>
                <img src={expanded ? UpIcon : DownIcon} className='icon medium pad' />
            </div>
            <div className='dropdown_content'>
                {props.children}
            </div>
        </div>
    )
}