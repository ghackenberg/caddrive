import 'process/browser'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import { BrowserRouter } from 'react-router-dom'

import { Auth0Provider } from '@auth0/auth0-react'

import { Root } from './components/Root'
import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from './env'

import * as AppIcon from '/src/images/app.png'

// Create root
const root = document.createElement('div')
// Append root
document.body.appendChild(root)
// Render root
ReactDOM.render((
    <Auth0Provider domain={AUTH0_DOMAIN} clientId={AUTH0_CLIENT_ID} audience={AUTH0_AUDIENCE} redirectUri={window.location.origin}>
        <Helmet>
            <link rel="icon" href={AppIcon}/>
        </Helmet>
        <BrowserRouter>
            <Root/>
        </BrowserRouter>
    </Auth0Provider>
), root)