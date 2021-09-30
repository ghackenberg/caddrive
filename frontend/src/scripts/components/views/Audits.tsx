import { Audit, Product, Version } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuditAPI, ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { AuditSearchBar } from '../widgets/SearchBar'
import { Column, Table } from '../widgets/Table'
import * as AuditIcon from '/src/images/audit.png'


export const AuditsView = () =>  {

    const [audits, setAudits] = useState<Audit[]>()
    const [products, setProducts] = useState<{[id: string]: Product}>({})
    const [versions, setVersions] = useState<{[id: string]: Version}>({})

    useEffect(() => { 
        AuditAPI.findAudits().then(async audits => {   
            setAudits(audits) 

            const newProducts = {...products}
            const newVersions = {...versions}
            
            for (var index = 0; index < audits.length; index++) {
                const audit = audits[index]
                if (!(audit.productId in newProducts)) {
                    newProducts[audit.productId] = await ProductAPI.getProduct(audit.productId)
                }
                if(!(audit.versionId in newVersions)) {
                    newVersions[audit.versionId] = await VersionAPI.getVersion(audit.versionId)
                }
            }
            setProducts(newProducts)
            setVersions(newVersions)
        })
    }, [])

    const columns: Column<Audit>[] = [
        {label: 'Icon', content: _audit => <img src={AuditIcon} style={{width: '1em'}}/>},
        {label: 'Audit', content: audit => <b>{audit.name}</b>},
        {label: 'Product', content: audit => audit.productId in products ? products[audit.productId].name : 'Loading...'},
        {label: 'Version', content: audit => audit.versionId in versions ? versions[audit.versionId].name : 'Loading...'},
        {label: 'Link', content: audit => <Link to={`/audits/${audit.id}`}>Details</Link>},
        {label: 'Link', content: audit => <Link to={`/events/?audit=${audit.id}`}>Events</Link>}
    ]

    return (
        <div className="view audits">
            <Header/>
            <Navigation/>
            <main>
                <Fragment>
                    <nav>
                        <span>
                            <Link to="/">Welcome Page</Link> 
                        </span>
                        <span>
                            <a>Audits</a>
                        </span>
                    </nav>
                </Fragment>
                <h2>Available audits</h2>
                <AuditSearchBar change={setAudits}/>
                {audits && <Table columns={columns} items={audits} create='Audit'/>}
            </main>
        </div>
    )
} 