import * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Audit, Product, Version } from 'fhooe-audit-platform-common/src/data'
import { AuditAPI, ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { DateInput, DropdownInput, TextInput } from '../snippets/InputForms'
import { Option } from 'react-dropdown'
import { AuditLink } from '../snippets/LinkSource'

export const AuditDetailView = (props: RouteComponentProps<{audit: string}>) => {

    const auditId = props.match.params.audit

    const [audit, setAudit] = useState<Audit>(null)
    const [product, setProduct] = useState<Product>(null)
    const [version, setVersion] = useState<Version>(null)
    const [products, setProducts] = useState<Product[]>(null)
    const [versions, setVersions] = useState<Version[]>(null)

    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()

    const [productInput, setProductInput] = useState<string>(null)
    const [versionInput, setVersionInput] = useState<string>(null)
    const [auditName, setAuditName] = useState<string>(null)

    const history = useHistory()

    useEffect(() => { ProductAPI.findProducts().then(setProducts) }, [])
    useEffect(() => { VersionAPI.findVersions().then(setVersions)}, [])

    if (auditId != 'new') {
        useEffect(() => { AuditAPI.getAudit(auditId).then(audit => {
            setAudit(audit)
            ProductAPI.getProduct(audit.productId).then(setProduct)
            VersionAPI.getVersion(audit.versionId).then(setVersion)
        }) }, [])
    }

    async function saveAudit(event: FormEvent){
        event.preventDefault()

        if (auditId == 'new') {
            if (auditName && startDate.getDate() != null && endDate.getDate() != null) {
                await AuditAPI.addAudit({   productId: productInput,
                                            versionId: versionInput,
                                            name: auditName,
                                            start: startDate,
                                            end: endDate})

                history.goBack()
            }
        }
        else {
            await AuditAPI.updateAudit(audit)

            history.goBack()
        }
    }

    async function cancelInput() {
        history.goBack()
    }

    async function productSelected(option: Option) {

        setVersions(await VersionAPI.findVersions(null, option.value))

        setProductInput(option.value)
    }

    async function versionSelected(option: Option) {
        setVersionInput(option.value)
    }

    return (
        <div className='view audit'>
            <Header/>
            <Navigation/>
            <main>
                <Fragment>
                    <nav>
                        <AuditLink audit={audit}/>                           
                    </nav>
                    <h1>{ auditId == 'new' ? 'Add new audit' : 'View existing audit'}</h1>
                    <form onSubmit={saveAudit} onReset={cancelInput} className='user-input'>
                        {auditId == 'new' || (auditId != 'new' && audit) ?
                        <TextInput  
                            label='Audit name' 
                            placeholder='Add new audit'
                            value={auditId != 'new' ? audit.name : undefined} 
                            change={value => setAuditName(value)}
                            disabled={auditId != 'new'}/> : <p>Loading...</p> }
                        {auditId == 'new' || (auditId != 'new' && audit) ? 
                        <DateInput  
                            label='Start time'
                            placeholder='Select start date'
                            change={date => setStartDate(date)}
                            selected={auditId != 'new' ? new Date(audit.start) : startDate}
                            disabled={auditId != 'new'}/> : <p>Loading...</p> }
                        {auditId == 'new' || (auditId != 'new' && audit) ? 
                        <DateInput
                            label='End time'
                            placeholder='Select end date'
                            change={date => setEndDate(date)}
                            selected={auditId != 'new' ? new Date(audit.end) : endDate}
                            disabled={auditId != 'new'}/> : <p>Loading...</p> }
                        {(auditId == 'new' && products) || (auditId != 'new'  && product && products) ?
                        <DropdownInput
                            label='Choose product'
                            placeholder='Select product'
                            options={products.map(product => { return {value: product.id, label: product.name} })}
                            value={auditId != 'new' ? {value: product.id, label: product.name} : undefined}  
                            change={productSelected}
                            disabled={auditId != 'new'}/> : <p>Loading...</p> }
                        {(auditId == 'new' && productInput && versions) || (auditId != 'new' && version && versions) ? 
                        <DropdownInput
                            label='Choose version'
                            placeholder='Select version'
                            options={versions.map(version => { return {value: version.id, label: version.name} })}
                            value={auditId != 'new' ? {value: version.id, label: version.name} : undefined}
                            change={versionSelected}
                            disabled={auditId != 'new'}/> : <p>Loading...</p> }
                        <div>
                            <div/>
                            <div>
                                <input type='reset' value='Cancel'/>
                                <input  type='submit' 
                                        value={auditId == 'new' ? "Save" : "Delete"} 
                                        className={auditId == 'new' ? 'saveItem' : 'deleteItem'}/>
                            </div>
                        </div>
                        <div>
                            <div/>
                            {auditId != 'new' &&
                            <div>
                                <Link to={`/audits/${auditId}/event`}>
                                    <input type="button" className='enter-audit' value="Enter audit"/>
                                </Link> 
                            </div>}
                        </div>
                    </form>
                </Fragment>
            </main>
        </div>
    )
}