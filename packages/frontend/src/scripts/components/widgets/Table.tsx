import * as React from 'react'

export interface Column <T,> {
    class?: string
    label: React.ReactNode
    content: (item: T, index: number) => React.ReactNode
}

export const Table = <T,> (props: {columns: Column<T>[], items: T[], onMouseOver?: (item: T) => void, onMouseOut?: (item: T) => void, onClick?: (item: T) => void}) => {
    const onMouseOver = props.onMouseOver || (() => {
        // empty
    })
    const onMouseOut = props.onMouseOut || (() => {
        // empty
    })
    const onClick = props.onClick || (() => {
        // empty
    })
    return (
        <table>
            <thead>
                <tr>
                    {props.columns.map((column, index) =>
                        <th key={`head-cell-${index}`} className={column.class}>
                            {column.label}
                        </th>
                    )}
                </tr>
            </thead>
            <tbody>
                {props.items.map((item, itemIndex) =>
                    <tr key={`body-row-${itemIndex}`} onMouseOver={() => onMouseOver(item)} onMouseOut={() => onMouseOut(item)} onClick={() => onClick(item)} style={{cursor: props.onClick ? 'pointer' : 'default'}}>
                        {props.columns.map((column, columnIndex) =>
                            <td key={`body-cell-${columnIndex}`} className={column.class}>
                                {column.content(item, itemIndex)}
                            </td>
                        )}
                    </tr>
                )}
                {props.items.length == 0 && (
                    <tr>
                        <td colSpan={props.columns.length} className='center'>
                            <em>Empty</em>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}