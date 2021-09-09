import * as React from 'react'
import Datepicker from 'react-datepicker'

export const TextInput = (props: {label: string, change: (value: string) => void, placeholder?: string}) => {
    return (
        <GenericInput label={props.label}>
            <input type="text" placeholder={props.placeholder} onChange={event => props.change(event.currentTarget.value)} required/>
        </GenericInput>
    )
}

export const DateInput = (props: {label: string, change: (value: Date) => void, selected?: Date}) => {

    return (
        <GenericInput label={props.label}>
            <Datepicker selected={props.selected} onChange={(date) => props.change(date)} required/>
        </GenericInput>
    )
}

const GenericInput: React.FunctionComponent<{label: string}> = (props) => {
    return (
        <div>
            <div>
                <label>{props.label}</label>
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}