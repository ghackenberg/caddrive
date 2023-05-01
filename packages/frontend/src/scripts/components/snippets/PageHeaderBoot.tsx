import * as React from 'react'

import AppIcon from '/src/images/app.png'

export const PageHeaderBoot = () => {
    return (
        <header className='page'>
            <div>
                <span>
                    <a>
                        <img src={AppIcon} className='icon small'/>
                        <span>Product</span>
                        <span>Board</span>
                    </a>
                </span>
            </div>
        </header>
    )
    
}