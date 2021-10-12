import * as React from 'react'
// Inputs
import { GenericInput } from './GenericInput'

export const DateInput = (props: {label: string, change: (value: Date) => void, placeholder?: string, value?: Date, disabled?: boolean}) => {
    const [value, setValue] = React.useState<Date>(props.value || new Date())
    return (
        <GenericInput label={props.label}>
            <input
                type='date'
                placeholder={props.placeholder}
                value={value.toISOString().slice(0, 10)}
                disabled={props.disabled}
                onChange={event => {setValue(event.currentTarget.valueAsDate), props.change(event.currentTarget.valueAsDate)}}
                required/>
        </GenericInput>
    )
}