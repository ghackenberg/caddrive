import * as React from 'react'
import { Fragment } from 'react'

import { GenericInput } from './GenericInput'
import { TextInput } from './TextInput'

export const FileInput = (props: {class?: string, label: string, change?: (value: File) => void, accept?: string, placeholder?: string, disabled?: boolean, required: boolean}) => {

    // REFERENCES
    
    const fileInput = React.useRef(null)

    // STATES
    
    const [fileName, setFileName] = React.useState<string>('')

    // FUNCTIONS

    async function handleClick(event: React.FormEvent) {
        event.preventDefault()
        fileInput.current.click()
    }

    // RETURN

    return (
        <Fragment>
            <TextInput class={props.class} label={props.label} value={fileName} placeholder={'No file selected yet'} required = {props.required}/>
            <GenericInput>
                <Fragment>
                    <input 
                        type='button'
                        className={props.class}
                        value={props.placeholder}
                        onClick={handleClick}/>
                    <input
                        type='file'
                        className={props.class}
                        accept={props.accept}
                        placeholder={props.placeholder}
                        ref={fileInput}
                        onChange={event => {props.change(event.currentTarget.files.length > 0 ? event.currentTarget.files[0] : undefined), setFileName(event.currentTarget.files.length > 0 ? event.currentTarget.files[0].name : '')}}
                        disabled={props.disabled}
                        style={{display: 'none'}}/>
                </Fragment>
            </GenericInput>
        </Fragment>
    )  
}