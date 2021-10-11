import * as React from 'react'

export interface Column <T,> {
    label: React.ReactNode
    content: (item: T) => React.ReactNode
}

export const Table = <T,> (props: {columns: Column<T>[], items: T[]}) => {
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
            </tbody>
        </table>
    )
}