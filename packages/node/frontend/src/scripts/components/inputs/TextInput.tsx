import * as React from 'react'

import { GenericInput } from './GenericInput'

export const TextInput = (props: {class?: string, value: string, label?: string, input?: (value: string) => void, change?: (value: string) => void, placeholder?: string, disabled?: boolean, required?: boolean}) => {
    const label = props.label
    const type = 'text'
    const className = `button fill ${props.class || 'lightgray'}`
    const placeholder = props.placeholder
    const value = props.value
    const disabled = props.disabled
    const required = props.required
    
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.change && props.change(event.currentTarget.value)
    }
    function onInput(event: React.FormEvent<HTMLInputElement>) {
        props.input && props.input(event.currentTarget.value)
    }

    return (
        <GenericInput label={label}>
            <input type={type} className={className} placeholder={placeholder} value={value} disabled={disabled} required={required} onChange={onChange} onInput={onInput}/>
        </GenericInput>
    )
}