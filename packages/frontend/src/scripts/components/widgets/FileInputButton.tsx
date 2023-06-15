import * as React from 'react'

export const FileInputButton = (props: {class?: string, label: string, change: (value: File) => void, accept?: string, placeholder?: string, disabled?: boolean, required: boolean}) => {

    // REFERENCES
    
    const fileInput = React.useRef(null)

    // FUNCTIONS

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.change(event.currentTarget.files.length > 0 ? event.currentTarget.files[0] : undefined)
        if (fileInput.current) { fileInput.current.value = '' }
    }
    function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        fileInput.current.click()
    }

    // RETURN

    return (
        <>
            <input style={{display: 'none'}} type='file' accept={props.accept} required={props.required} ref={fileInput} onChange={onChange}/>
            <button className={props.class} onClick={onClick} >{props.label}</button>
        </>
    )

}