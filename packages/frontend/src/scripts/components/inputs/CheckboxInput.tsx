import * as React from 'react'
// Inputs
import { GenericInput } from './GenericInput'

export const CheckboxInput = (props: {class?: string, label: string, change?: (value: boolean) => void, value?: string, checked?: boolean, placeholder?: string, disabled?: boolean}) => (
    <GenericInput label={props.label}>
        <input
            type='checkbox'
            className={props.class}
            placeholder={props.placeholder}
            value={props.value}
            checked={props.checked}
            disabled={props.disabled}
            onChange={event => { props.change(event.currentTarget.checked) }}/>
    </GenericInput>
)