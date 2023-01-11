import * as React from 'react'

import { GenericInput } from './GenericInput'

export const ButtonInput = (props: {class?: string, label?: string, click: (event: React.MouseEvent<HTMLInputElement>) => void, value: string, disabled?: boolean}) => {
    const label = props.label
    const type = 'button'
    const className = `button fill ${props.class || 'gray'}`
    const value = props.value
    const disabled = props.disabled

    function onClick(event: React.MouseEvent<HTMLInputElement>) {
        props.click && props.click(event)
    }

    return (
        <GenericInput label={label}>
            <input type={type} className={className} value={value} disabled={disabled} onClick={onClick}/>
        </GenericInput>
    )
}