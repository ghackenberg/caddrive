import * as React from 'react'

import { GenericInput } from './GenericInput'

export const NumberInput = (props: {class?: string, label: string, change?: (value: number) => void, value: number, placeholder?: string, disabled?: boolean}) => {
    const label = props.label
    const type = 'number'
    const min = 0
    const className = `button fill ${props.class || 'lightgray'}`
    const placeholder = props.placeholder
    const value = props.value
    const disabled = props.disabled
    const required = true
    
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.change && props.change(event.currentTarget.valueAsNumber)
    }

    return (
        <GenericInput label={label}>
            <input type={type} min={min} className={className} placeholder={placeholder} value={value} disabled={disabled} required={required} onChange={onChange}/>
        </GenericInput>
    )
}