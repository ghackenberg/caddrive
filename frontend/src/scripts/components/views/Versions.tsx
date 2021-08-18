import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Version } from 'fhooe-audit-platform-common'
import { VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { VersionList } from '../widgets/VersionList'

export const Versions = () => {
    const [versions, setVersion] = useState<Version[]>(null)
    useEffect(() => { VersionAPI.findAll().then(setVersion) }, [])
    return (
        <div className="view versions">
            <Header/>
            <Navigation/>
            <main>
                <h1><Link to="/">Welcome Page</Link> &rsaquo; <Link to="/products">Products</Link> &rsaquo; Versions</h1>
                <h2>Available versions</h2>
                {versions ? <VersionList list={versions}/> : <p>Loading...</p>}
            </main>
        </div>
    )
}