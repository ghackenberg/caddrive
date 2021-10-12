import * as React from 'react'

export const GenericInput = (props: {label: string, children: React.ReactNode}) => {
    return (
        <div>
            <div>
                <label>{props.label}</label>
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}