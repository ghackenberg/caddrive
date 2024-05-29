import * as React from 'react'
import { useState } from 'react'

import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'

/*
function dateTickFormatter(time: number) {
    return formatDate(new Date(time))
}

function dateTimeTickFormatter(time: number) {
    return formatDateTime(new Date(time))
}
*/

export const BurndownChartWidget = (props: { start: number, end: number, total: number, actual: { time: number, actual: number }[] }) => {
    // CONSTANTS

    const start = props.start
    const end = props.end
    const now = Date.now()
    const total = props.total
    const actual = props.actual

    const padding = 50

    // INITIAL STATES

    const initialTarget = [{ time: start, target: total }, { time: end, target: 0 }]

    // STATES

    const [target, setTarget] = useState(initialTarget)

    // EFFECTS

    React.useEffect(() => {
        setTarget([{ time: start, target: total }, { time: end, target: 0 }])
    }, [start, end, total])

    // RETURN

    return (
        <div className="widget burndown_chart">
            <ResponsiveContainer>
                <LineChart>
                    <CartesianGrid/>
                    <XAxis name='Time' dataKey='time' type='number' domain={[start, end]} scale='time' interval={0} angle={-45} textAnchor='end' padding={{left: padding, right: padding}}/>
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