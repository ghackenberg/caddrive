import * as React from 'react'

import { GenericInput } from './GenericInput'

export const TextareaInput = (props: {class?: string, value: string, label?: string, change?: (value: string) => void, placeholder?: string, disabled?: boolean}) => {
    const label = props.label
    const className = `button fill ${props.class || 'lightgray'}`
    const placeholder = props.placeholder
    const value = props.value
    const disabled = props.disabled
    const required = true
    
    function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        props.change && props.change(event.currentTarget.value)
    }

    return (
        <GenericInput label={label}>
            <textarea className={className} placeholder={placeholder} value={value} disabled={disabled} required={required} onChange={onChange}/>
        </GenericInput>
    )
}