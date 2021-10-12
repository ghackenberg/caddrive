import * as React from 'react'
// Inputs
import { GenericInput } from './GenericInput'

export const PasswordInput = (props: {label: string, change?: (value: string) => void, placeholder?: string, value?: string, disabled?: boolean}) => {
    const [value, setValue] = React.useState<string>(props.value)
    return (
        <GenericInput label={props.label}>
            <input
                type='password'
                placeholder={props.placeholder}
                value={value}
                disabled={props.disabled}
                onChange={event => {setValue(event.currentTarget.value), props.change(event.currentTarget.value)}}
                required/>
        </GenericInput>
    )
}