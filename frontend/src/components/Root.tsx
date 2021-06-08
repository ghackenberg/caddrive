import * as React from 'react'
import * as ReactHelmet from 'react-helmet'

export default class Root extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ReactHelmet.Helmet>
                    <title>FH OÖ Audit Platform Frontend</title>
                    <link rel="icon" href="/images/icon.png"/>
                </ReactHelmet.Helmet>
                <h1>FH OÖ Audit Platform Frontend</h1>
            </React.Fragment>
        )
    }
}