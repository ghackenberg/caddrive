import * as React from 'react'

import { GenericInput } from './GenericInput'

export const SubmitInput = (props: {disabled?: boolean}) => {
    const disabled = props.disabled
    
    return (
        <GenericInput>
            <input type='submit' className='button fill blue' value='Save' disabled={disabled}/>
        </GenericInput>
    )
}