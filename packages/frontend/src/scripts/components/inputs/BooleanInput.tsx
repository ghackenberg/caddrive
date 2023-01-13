import * as React from 'react'

import { GenericInput } from './GenericInput'

export const BooleanInput = (props: {label: string, change?: (value: boolean) => void, value: boolean, disabled?: boolean, required?: boolean}) => {
    const label = props.label
    const type = 'checkbox'
    const checked = props.value
    const disabled = props.disabled
    const required = props.required

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.change && props.change(event.currentTarget.checked)
    }
    
    return (
        <GenericInput label={label}>
            <input type={type} checked={checked} disabled={disabled} required={required} onChange={onChange}/>
        </GenericInput>
    )
}