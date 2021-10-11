import * as React from 'react'
import Datepicker from 'react-datepicker'
import Dropdown, { Option } from 'react-dropdown'

export const DateInput = (props: {label: string, change: (value: Date) => void, placeholder?: string, selected?: Date, disabled?: boolean}) => {
    return (
        <GenericInput label={props.label}>
            <Datepicker 
                placeholderText={props.placeholder} 
                selected={props.selected} 
                onChange={(date) => props.change(Array.isArray(date) ? date[0] : date)} 
                disabled={props.disabled} 
                required
                showTimeSelect/>
        </GenericInput>
    )
}

export const DropdownInput = (props: {label: string, options: Option[], change: (option: Option) => void, placeholder: string, value?: Option, disabled?: boolean}) => {
    return (
        <GenericInput label={props.label}>
            <Dropdown 
                options={props.options} 
                placeholder={props.placeholder} 
                onChange={props.change} 
                value={props.value} 
                disabled={props.disabled}/>
        </GenericInput>
    )
}

export const TextInput = (props: {label: string, change?: (value: string) => void, placeholder?: string, value?: string, disabled?: boolean}) => {
    
    const [input, setInput] = React.useState<string>(props.value)

    return (
        <GenericInput label={props.label}>
            <input 
                type='text' 
                placeholder={props.placeholder} 
                value={input} 
                disabled={props.disabled} 
                onChange={event => {setInput(event.currentTarget.value), props.change(event.currentTarget.value)}} 
                required/>
        </GenericInput>
    )
}


export const EmailInput = (props: {label: string, change?: (value: string) => void, placeholder?: string, value?: string, disabled?: boolean}) => {
    
    const [input, setInput] = React.useState<string>(props.value)

    return (
        <GenericInput label={props.label}>
            <input 
                type='email' 
                placeholder={props.placeholder} 
                value={input} 
                disabled={props.disabled} 
                onChange={event => {setInput(event.currentTarget.value), props.change(event.currentTarget.value)}} 
                required/>
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