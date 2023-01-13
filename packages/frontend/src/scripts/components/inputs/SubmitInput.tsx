import * as React from 'react'

import { GenericInput } from './GenericInput'

export const SubmitInput = (props: {value: string, disabled?: boolean}) => {
    const value = props.value
    const disabled = props.disabled
    const style = disabled ? {fontStyle: 'italic'} : {}
    
    return (
        <GenericInput>
            <input type='submit' className='button fill blue' value={value} disabled={disabled} style={style} />
        </GenericInput>
    )
}