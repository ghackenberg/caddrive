import * as React from 'react'

import { GenericInput } from './GenericInput'

const year = new Intl.DateTimeFormat('en', {
    year: 'numeric',
})
const month = new Intl.DateTimeFormat('en', {
    month: '2-digit',
})
const day = new Intl.DateTimeFormat('en', {
    day: '2-digit',
})
const hour = new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    hour12: false
})
const minute = new Intl.DateTimeFormat('en', {
    minute: '2-digit'
})

export const DateInput = (props: {class?: string, label: string, change?: (value: Date) => void, value: Date, placeholder?: string, disabled?: boolean, required?: boolean}) => {
    const label = props.label
    const type = 'datetime-local'
    const className = `button fill ${props.class || 'lightgray'}`
    const placeholder = props.placeholder
    const valueAsDate = (props.value ? props.value : new Date())
    const value = `${year.format(valueAsDate)}-${month.format(valueAsDate)}-${day.format(valueAsDate)}T${hour.format(valueAsDate)}:${minute.format(valueAsDate)}`
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