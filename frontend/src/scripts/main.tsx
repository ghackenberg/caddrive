import * as React from 'react'
import * as ReactDOM from 'react-dom'
// Components
import { Root } from './components/Root'
// Styles
import '/src/styles/body.css'

// Create root
const root = document.createElement('div')
// Append root
document.body.appendChild(root)
// Render root
ReactDOM.render(<Root/>, root)