import * as React from 'react'
// Inputs
//import { GenericInput } from './GenericInput'
import { TextInput } from './TextInput'

export const FileInput = (props: {label: string, change?: (value: File) => void, accept?: string, placeholder?: string, disabled?: boolean}) => {
    
    const hiddenFileInput = React.useRef(null)
    const [fileName, setFileName] = React.useState<string>('')

    async function handleClick(event: React.FormEvent) {
        event.preventDefault()
        hiddenFileInput.current.click()
    }

    return (
        <React.Fragment>
            <TextInput label={props.label} value={fileName} placeholder={'No file selected yet'}/>
            <div>
                <div>
                </div>
                <div>
                    <input 
                        type='button'
                        value={props.placeholder}
                        onClick={handleClick}/>
                    <input
                        type='file'
                        accept={props.accept}
                        placeholder={props.placeholder}
                        ref={hiddenFileInput}
                        onChange={event => {props.change(event.currentTarget.files.length > 0 ? event.currentTarget.files[0] : undefined), setFileName(event.currentTarget.files[0].name)}}
                        disabled={props.disabled}
                        style={{display: 'none'}}/>
                </div>
            </div>
        </React.Fragment>
    )  
}