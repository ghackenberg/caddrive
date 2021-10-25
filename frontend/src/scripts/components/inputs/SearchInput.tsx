import * as React from 'react'
import { Fragment } from 'react'

export const SearchInput = (props: {value: string, change?: (value: string) => void, placeholder?: string}) => {

    return (
        <Fragment>
            <form className='search-input'>
                <span>
                    <input
                        type="text"
                        value={props.value}
                        onChange={event => {props.change(event.currentTarget.value)}}
                        className="header-search"
                        placeholder={props.placeholder}/>
                </span>
            </form>
        </Fragment>

    )
}