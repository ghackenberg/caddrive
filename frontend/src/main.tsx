import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Root } from './components/Root'

// Create root
const root = document.createElement('div')
// Append root
document.body.appendChild(root)
// Render root
ReactDOM.render(<Root/>, root)