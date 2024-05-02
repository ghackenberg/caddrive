import * as React from 'react'

import { GenericInput } from './GenericInput'

export const EmailInput = (props: {class?: string, label: string, change?: (value: string) => void, value: string, placeholder?: string, disabled?: boolean}) => {
    const label = props.label
    const type = 'email'
    const className = `button fill ${props.class || 'lightgray'}`
    const placeholder = props.placeholder
    const value = props.value
    const disabled = props.disabled
    const required = true

    function onChange(event: React.FormEvent<HTMLInputElement>) {
        props.change && props.change(event.currentTarget.value)
    }

    return (
        <GenericInput label={label}>
            <input type={type} className={className} placeholder={placeholder} value={value} disabled={disabled} required={required} onChange={onChange}/>
        </GenericInput>
    )
}