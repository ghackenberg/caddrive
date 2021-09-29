import * as React from 'react'
import { Link } from 'react-router-dom'
import * as CreateIcon from '/src/images/create.png'

export interface Column <T,> {
    label: React.ReactNode
    content: (item: T) => React.ReactNode
}

export const Table = <T,> (props: {columns: Column<T>[], items: T[], create?: string}) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    {props.columns.map((column, index) =>
                        <th key={index}>{column.label}</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {props.items.map((item, index) =>
                    <tr key={index}>
                        <td>{index}</td>
                        {props.columns.map((column, index) =>
                            <td key={index}>{column.content(item)}</td>
                        )}
                    </tr>
                )}
                {props.create &&
                <tr className='create-icon'>
                    <td><Link to={`/${props.create.toLowerCase()}` + 's' +'/new'}><img src={CreateIcon}/></Link></td>
                </tr>}
            </tbody>
        </table>
    )
}