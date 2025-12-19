import { useRef, useState } from 'react'
import { ButtonInput } from './ButtonInput.js'
import { TextInput } from './TextInput.js'

export const FileInput = (props: {class?: string, label: string, change: (value: File) => void, accept?: string, placeholder?: string, disabled?: boolean, required: boolean}) => {
    const label = props.label
    const accept = props.accept
    const required = props.required
    const placeholder = props.placeholder
    const disabled = props.disabled
    const clazz = props.class

    // REFERENCES
    
    const fileInput = useRef(null)

    // STATES
    
    const [fileName, setFileName] = useState<string>('')

    // FUNCTIONS

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.change(event.currentTarget.files.length > 0 ? event.currentTarget.files[0] : undefined)
        setFileName(event.currentTarget.files.length > 0 ? event.currentTarget.files[0].name : '')
    }
    function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        fileInput.current.click()
    }

    // RETURN

    return (
        <>
            <input type='file' accept={accept} required={required} ref={fileInput} onChange={onChange}/>
            <TextInput class={clazz} label={label} value={fileName} placeholder={'No file selected yet'}/>
            <ButtonInput value={placeholder} disabled={disabled} click={onClick}/>
        </>
    )

}