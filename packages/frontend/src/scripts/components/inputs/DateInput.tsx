import * as React from 'react'
// Inputs
import { GenericInput } from './GenericInput'

export const DateInput = (props: {class?: string, label: string, change: (value: Date) => void, value: Date, placeholder?: string, disabled?: boolean}) => (
    <GenericInput label={props.label}>
        <input
            type='date'
            className={props.class}
            placeholder={props.placeholder}
            value={(props.value ? props.value : new Date()).toISOString().slice(0, 10)}
            disabled={props.disabled}
            onChange={event => {props.change(event.currentTarget.valueAsDate)}}
            required/>
    </GenericInput>
)