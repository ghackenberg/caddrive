import * as React from 'react'

import { GenericInput } from './GenericInput'

export const DateInput = (props: {class?: string, label: string, change?: (value: Date) => void, value: Date, placeholder?: string, disabled?: boolean, required?: boolean}) => {
    const label = props.label
    const type = 'date'
    const className = `button fill ${props.class || 'lightgray'}`
    const placeholder = props.placeholder
    const value = (props.value ? props.value : new Date()).toISOString().slice(0, 10)
    const disabled = props.disabled
    const required = props.required

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.change && props.change(event.currentTarget.valueAsDate)
    }
    
    return (
        <GenericInput label={label}>
            <input type={type} className={className} placeholder={placeholder} value={value} disabled={disabled} required={required} onChange={onChange}/>
        </GenericInput>
    )
}