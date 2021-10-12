import * as React from 'react'
// Inputs
import { GenericInput } from './GenericInput'

export const PasswordInput = (props: {label: string, change?: (value: string) => void, value: string, placeholder?: string, disabled?: boolean}) => {
    return (
        <GenericInput label={props.label}>
            <input
                type='password'
                placeholder={props.placeholder}
                value={props.value}
                disabled={props.disabled}
                onChange={event => {props.change(event.currentTarget.value)}}
                required/>
        </GenericInput>
    )
}