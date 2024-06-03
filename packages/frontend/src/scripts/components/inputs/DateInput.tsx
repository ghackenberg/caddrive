import * as React from 'react'

import { GenericInput } from './GenericInput'

function format(value: number) {
    if (value < 10) {
        return `0${value}`
    } else {
        return `${value}`
    }
}

export const DateInput = (props: {class?: string, label: string, change?: (value: Date) => void, value: Date, placeholder?: string, disabled?: boolean, required?: boolean}) => {
    const label = props.label
    const type = 'datetime-local'
    const className = `button fill ${props.class || 'lightgray'}`
    const placeholder = props.placeholder
    const valueAsDate = (props.value ? props.value : new Date())
    const value = `${valueAsDate.getFullYear()}-${format(valueAsDate.getMonth() + 1)}-${format(valueAsDate.getDate())}T${format(valueAsDate.getHours())}:${format(valueAsDate.getMinutes())}`
    const disabled = props.disabled
    const required = props.required

    console.log(value)

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const date = new Date()
        date.setTime(event.currentTarget.valueAsNumber + date.getTimezoneOffset() * 1000 * 60)
        props.change && props.change(date)
    }
    
    return (
        <GenericInput label={label}>
            <input type={type} className={className} placeholder={placeholder} value={value} disabled={disabled} required={required} onChange={onChange}/>
        </GenericInput>
    )
}