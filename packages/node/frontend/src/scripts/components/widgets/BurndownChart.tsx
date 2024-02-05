import * as React from 'react'
import { useEffect, useState } from 'react'

import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { cropTimestamp, defineIncrement } from '../../functions/burndown'
import { formatDate, formatDateTime } from '../../functions/time'

function computeTarget(total: number, start: number, end: number, increment:  number) {
    const steps = (end - start) / increment
    const target: { time: number, target: number }[] = []
    const delta = total / steps
    let value = total
    for (let iterator = start; iterator <= end; iterator += increment) {
        target.push({ time: iterator, target: value })
        value -= delta
    }
    return target
}

function dateTickFormatter(time: number) {
    return formatDate(new Date(time))
}

function dateTimeTickFormatter(time: number) {
    return formatDateTime(new Date(time))
}

export const BurndownChartWidget = (props: { start: number, end: number, total: number, actual: { time: number, actual: number }[] }) => {
    // CONSTANTS

    const increment = defineIncrement(props.start, props.end)

    const start = cropTimestamp(props.start, props.start, props.end)
    const end = cropTimestamp(props.end, props.start, props.end)
    const now = cropTimestamp(Date.now(), props.start, props.end)

    const total = props.total
    const actual = props.actual

    const padding = 50

    // INITIAL STATES

    const initialTarget = computeTarget(total, start, end, increment)
    const initialHeight = increment < 1000 * 60 * 60 * 24 ? 130 : 100
    
    // STATES

    const [target, setTargetBurndown] = useState(initialTarget)
    const [height, setHeight] = useState(initialHeight)

    // EFFECTS

    useEffect(() => {
        setTargetBurndown(computeTarget(total, start, end, increment))
    }, [props.start, props.end, total])

    useEffect(() => {
        setHeight(increment < 1000 * 60 * 60 * 24 ? 130 : 100)
    }, [increment])

    // RETURN

    return (
        <div className="widget burndown_chart">
            <ResponsiveContainer>
                <LineChart>
                    <CartesianGrid/>
                    <XAxis name='Time' dataKey='time' type='number' domain={[start, end]} scale='time' interval={0} angle={-45} height={height} textAnchor='end' tickFormatter={time => increment < 1000 * 60 * 60 * 24 ? dateTimeTickFormatter(time) : dateTickFormatter(time)} padding={{left: padding, right: padding}}/>
                    <YAxis name='Open issue count' dataKey='target' domain={[0, total]} allowDecimals={false} interval={0} tickFormatter={value => `${Math.round(value)}`} padding={{top: padding}}/>
                    <Legend/>
                    {now >= start && now <= end && (
                        <ReferenceLine x={now} label={{value: 'Now', position: now <= (start + end) / 2 ? 'right' : 'left', fill: 'black'}} stroke='gray' strokeWidth={2} strokeDasharray='6 6'/>
                    )}
                    <ReferenceLine x={start} label={{value: 'Start', position: 'left', fill: 'darkred'}} stroke='red' strokeWidth={2} strokeDasharray='6 6'/>
                    <ReferenceLine x={end} label={{value: 'End', position: 'right', fill: 'darkred'}} stroke='red' strokeWidth={2} strokeDasharray='6 6'/>
                    <ReferenceLine y={total} label={{value: 'Total', position: 'top', fill: 'darkred'}} stroke='red' strokeWidth={2} strokeDasharray='6 6'/>
                    <Line name='Target burndown' isAnimationActive={false} data={target} dataKey='target' stroke='green' strokeWidth={2} strokeDasharray='6 6' dot={{fill: 'rgb(215,215,215)', stroke: 'green', strokeDasharray: ''}}/>
                    <Line name='Actual burndown' isAnimationActive={false} data={actual} dataKey='actual' stroke='blue' strokeWidth={2} dot={{fill: 'blue', stroke: 'blue'}}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    )

}