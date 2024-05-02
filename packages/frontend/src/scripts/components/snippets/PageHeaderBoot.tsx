import * as React from 'react'

import AppIcon from '/src/images/app.png'

export const PageHeaderBoot = () => {
    return (
        <header className='page'>
            <div>
                <span>
                    <a>
                        <img src={AppIcon} className='icon small'/>
                        <span>CAD</span>
                        <span>drive</span>
                        <span>Your collaborative workspace for LDraw&trade; models</span>
                    </a>
                </span>
            </div>
        </header>
    )
    
}