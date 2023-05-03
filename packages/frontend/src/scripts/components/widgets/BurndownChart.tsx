import * as React from 'react'
import { useEffect, useState } from 'react'

import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { cropTimestamp } from '../../functions/burndown'

export const BurndownChartWidget = (props: { start: Date, end: Date, total: number, actual: { time: number, actual: number }[] }) => {
    // CONSTANTS

    const start = cropTimestamp(props.start.getTime())
    const end = cropTimestamp(props.end.getTime())
    const now = cropTimestamp(Date.now())
    const total = props.total
    const actual = props.actual
    const padding = 50
    
    // STATES
    
    // - Computations
    const [target, setTargetBurndown] = useState<{ time: number, target: number}[]>([])

    // EFFECTS

    // - Computations
    useEffect(() => {
        const target: { time: number, target: number }[] = []
        const days = (end - start) / (1000 * 60 * 60 * 24)
        const delta = total / days
        let value = total
        for (let iterator = start; iterator <= end; iterator += 1000 * 60 * 60 * 24) {
            target.push({ time: iterator, target: value })
            value -= delta
        }
        setTargetBurndown(target)
    }, [total])

    // RETURN

    return (
        <div className="widget burndown_chart">
            <ResponsiveContainer>
                <LineChart>
                    <CartesianGrid/>
                    <XAxis name='Time' dataKey='time' type='number' domain={[start, end]} scale='time' interval={0} angle={-45} height={100} textAnchor='end' tickFormatter={time => new Date(time).toISOString().substring(0, 10)} padding={{left: padding, right: padding}}/>
                    <YAxis name='Open issue count' dataKey='target' domain={[0, total]} allowDecimals={false} interval={0} tickFormatter={value => `${Math.round(value)}`} padding={{top: padding}}/>
                    <Legend/>
                    {now >= start && now <= end && (
                        <ReferenceLine x={now} label={{value: 'Today', position: 'right', fill: 'black'}} stroke='gray' strokeWidth={2} strokeDasharray='6 6'/>
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