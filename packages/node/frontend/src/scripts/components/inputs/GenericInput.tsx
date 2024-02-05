import * as React from 'react'

export const GenericInput = (props: {label?: string, children: React.ReactNode}) => (
    <div>
        <div className={props.label ? '' : 'empty'}>
            {props.label && (
                <label>
                    {props.label}
                </label>
            )}
        </div>
        <div>
            {props.children}
        </div>
    </div>
)