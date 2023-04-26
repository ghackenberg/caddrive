import 'process/browser'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import { BrowserRouter } from 'react-router-dom'

import { Root } from './components/Root'

import AppIcon from '/src/images/app.png'

// Create root
const root = document.createElement('div')
// Append root
document.body.appendChild(root)
// Render root
ReactDOM.render((
    <>
        <Helmet>
            <link rel="icon" href={AppIcon}/>
        </Helmet>
        <BrowserRouter>
            <Root/>
        </BrowserRouter>
    </>
), root)