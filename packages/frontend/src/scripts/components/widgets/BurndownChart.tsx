import * as React from 'react'
import { useState } from 'react'

import { CartesianGrid, Label, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { formatDate, formatDateHour, formatDateHourMinute, formatMonth } from '../../functions/time'

function monthTickFormatter(time: number) {
    return formatMonth(new Date(time))
}

function dateTickFormatter(time: number) {
    return formatDate(new Date(time))
}

function dateHourTickFormatter(time: number) {
    return formatDateHour(new Date(time))
}

function dateHourMinuteTickFormatter(time: number) {
    return formatDateHourMinute(new Date(time))
}

export const BurndownChartWidget = (props: { start: number, end: number, total: number, actual: { time: number, actual: number }[] }) => {
    // CONSTANTS

    let start = props.start
    let end = props.end

    const span = end - start
    const now = Date.now()

    const startDate = new Date(start)
    const endDate = new Date(end)

    let step: number

    if (span <= 1000 * 60 * 60) {

        step = 1000 * 60

        startDate.setMinutes(startDate.getMinutes(), 0, 0)
        start = startDate.getTime()

        endDate.setMinutes(endDate.getMinutes() + 1, 0, 0)
        end = endDate.getTime()

    } else if (span <= 1000 * 60 * 60 * 24) {
    
        step = 1000 * 60 * 60

        startDate.setHours(startDate.getHours(), 0, 0, 0)
        start = startDate.getTime()

        endDate.setHours(endDate.getHours() + 1, 0, 0, 0)
        end = endDate.getTime()

    } else if (span <= 1000 * 60 * 60 * 24 * 48) {

        step = 1000 * 60 * 60 * 24

        startDate.setDate(startDate.getDate())
        startDate.setHours(0, 0, 0, 0)
        start = startDate.getTime()

        endDate.setDate(endDate.getDate() + 1)
        endDate.setHours(0, 0, 0, 0)
        end = endDate.getTime()

    } else {

        startDate.setMonth(startDate.getMonth(), 2)
        startDate.setHours(0, 0, 0, 0)
        start = startDate.getTime()

        endDate.setMonth(endDate.getMonth() + 1, 2)
        endDate.setHours(0, 0, 0, 0)
        end = endDate.getTime()

    }

    const total = props.total
    const actual = props.actual

    const padding = 50

    const domain = [start, end]

    const ticks = []
    if (step) {
        for (let i = start; i <= end; i += step) {
            ticks.push(i)
        }
    } else {
        while (startDate <= endDate) {
            ticks.push(startDate.getTime())
            startDate.setMonth(startDate.getMonth() + 1)
        }
    }

    let tickFormatter: (timestamp: number) => string
    if (step) {
        if (step <= 1000 * 60) {
            tickFormatter = dateHourMinuteTickFormatter
        } else if (step <= 1000 * 60 * 60) {
            tickFormatter = dateHourTickFormatter
        } else {
            tickFormatter = dateTickFormatter
        }
    } else {
        tickFormatter = monthTickFormatter
    }

    let height: number
    if (step) {
        if (step <= 1000 * 60) {
            height = 125
        } else if (step <= 1000 * 60 * 60) {
            height = 125
        } else {
            height = 90
        }
    } else {
        height = 80
    }

    // INITIAL STATES

    const initialTarget = [{ time: start, target: total }, { time: end, target: 0 }]

    // STATES

    const [target, setTarget] = useState(initialTarget)

    // EFFECTS

    React.useEffect(() => {
        setTarget([{ time: props.start, target: total }, { time: props.end, target: 0 }])
    }, [props.start, props.end, total])

    // RETURN

    return (
        <div className="widget burndown_chart">
            <ResponsiveContainer>
                <LineChart margin={{top: 20, left: 20, right: 20, bottom: 20}}>
                    <CartesianGrid/>
                    <XAxis dataKey='time' type='number' scale='time' domain={domain} ticks={ticks} tickFormatter={tickFormatter} height={height} angle={-45} fontSize={12} textAnchor='end' padding={{left: padding, right: padding}}>
                        <Label value='Time' fontWeight='bold' position='bottom' offset={-20}/>
                    </XAxis>
                    <YAxis dataKey='target' domain={[0, total]} allowDecimals={false} interval={0} tickFormatter={value => `${Math.round(value)}`} fontSize={12} padding={{top: padding}}>
                        <Label value='Open issue count' angle={-90} fontWeight='bold'/>
                    </YAxis>
                    <Legend/>
                    {now >= start && now <= end && (
                        <ReferenceLine x={now} label={{value: 'Now', position: now <= (start + end) / 2 ? 'right' : 'left', fill: 'gray', fontWeight: 'bold'}} stroke='gray' strokeWidth={2} strokeDasharray='6 6'/>
                    )}
                    <ReferenceLine x={props.start} label={{value: 'Start', position: 'left', fill: 'red', fontWeight: 'bold', offset: 10}} stroke='red' strokeWidth={2} strokeDasharray='6 6'/>
                    <ReferenceLine x={props.end} label={{value: 'End', position: 'right', fill: 'red', fontWeight: 'bold', offset: 10}} stroke='red' strokeWidth={2} strokeDasharray='6 6'/>
                    <ReferenceLine y={total} label={{value: 'Total issue count', position: 'top', fill: 'black', fontWeight: 'bold', offset: 10}} stroke='black' strokeWidth={2} strokeDasharray='6 6'/>
                    <Line name='Target burndown' isAnimationActive={false} data={target} dataKey='target' stroke='green' strokeWidth={2} strokeDasharray='6 6' dot={{fill: 'rgb(215,215,215)', stroke: 'green', strokeDasharray: ''}}/>
                    <Line name='Actual burndown' isAnimationActive={false} data={actual} dataKey='actual' stroke='blue' strokeWidth={2} dot={{fill: 'blue', stroke: 'blue'}}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    )

}