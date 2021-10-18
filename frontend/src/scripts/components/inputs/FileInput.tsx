import * as React from 'react'
// Inputs
import { GenericInput } from './GenericInput'

export const FileInput = (props: {label: string, change?: (value: File) => void, accept?: string, placeholder?: string, disabled?: boolean}) => {
    return (
        <GenericInput label={props.label}>
            <input
                type='file'
                accept={props.accept}
                placeholder={props.placeholder}
                onChange={event => {props.change(event.currentTarget.files.length > 0 ? event.currentTarget.files[0] : undefined)}}
                disabled={props.disabled}/>
        </GenericInput>
    )  
}