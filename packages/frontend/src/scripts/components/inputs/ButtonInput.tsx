import { GenericInput } from './GenericInput.js'

export const ButtonInput = (props: {label?: string, value: string, badge?: string, class?: string, click?: (event: React.MouseEvent<HTMLButtonElement>) => void, disabled?: boolean}) => {
    const label = props.label
    const value = props.value
    const badge = props.badge
    const className = `button fill ${props.class || 'gray'}`
    const disabled = props.disabled

    function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        props.click && props.click(event)
    }

    return (
        <GenericInput label={label}>
            <button className={className} disabled={disabled} onClick={onClick}>
                {true && (
                    <span>{value}</span>
                )}
                {badge && (
                    <span className='badge'>{badge}</span>
                )}
            </button>
        </GenericInput>
    )
}