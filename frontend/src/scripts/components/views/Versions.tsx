import * as React from 'react'
import { Fragment, useState, useEffect } from 'react'
import { Version } from 'fhooe-audit-platform-common'
import { Link } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { VersionSearchBar } from '../widgets/SearchBar'
import { VersionList } from '../widgets/VersionList'
import { VersionAPI } from '../../rest'

export const VersionsView = () => {

    const [versions, setVersions] = useState<Version[]>()

    useEffect(() => { VersionAPI.findVersions().then(setVersions) }, [])

    return (
        <div className="view versions">
            <Header/>
            <Navigation/>
            <main>
                <Fragment>
                    <nav>
                        <span>
                            <Link to="/">Welcome Page</Link>
                        </span>
                        <span>
                            <a>Versions</a>
                        </span>
                    </nav>
                </Fragment>
                <h2>Available versions</h2>
                <VersionSearchBar change={setVersions}/>
                {versions ? <VersionList list={versions}/> : <p>Loading...</p>}
            </main>
        </div>
    )
}