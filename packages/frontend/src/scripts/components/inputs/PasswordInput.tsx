import * as React from 'react'
// Inputs
import { GenericInput } from './GenericInput'

export const PasswordInput = (props: {class?: string, label: string, change?: (value: string) => void, value?: string, placeholder?: string, disabled?: boolean, required: boolean}) => (
    <GenericInput label={props.label}>
        <input
            type='password'
            className={props.class}
            placeholder={props.placeholder}
            value={props.value}
            disabled={props.disabled}
            onChange={event => {props.change(event.currentTarget.value)}}
            required = {props.required}/>
    </GenericInput>
)