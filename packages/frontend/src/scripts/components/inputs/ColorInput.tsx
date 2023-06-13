import * as React from 'react'

import { GenericInput } from './GenericInput'

export const ColorInput = (props: {label: string, change?: (value: string) => void, value: string, placeholder?: string, disabled?: boolean}) => {
    const label = props.label
    const type = 'color'
    const placeholder = props.placeholder
    const value = props.value
    const disabled = props.disabled
    
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.change && props.change(event.currentTarget.value)
    }

    return (
        <GenericInput label={label}>
            <input type={type} placeholder={placeholder} value={value} disabled={disabled} onChange={onChange}/>
        </GenericInput>
    )
}