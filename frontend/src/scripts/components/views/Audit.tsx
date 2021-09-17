import * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Audit, Product, Version } from '../../data'
import { AuditAPI, ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { DateInput, TextInput } from './forms/InputForms'
import Dropdown, { Option } from 'react-dropdown'
import { AuditLink } from './forms/AuditLink'

export const AuditView = (props: RouteComponentProps<{audit: string}>) => {

    const auditId = props.match.params.audit

    const [audit, setAudit] = useState<Audit>(null)
    const [products, setProducts] = useState<Product[]>(null)
    const [versions, setVersions] = useState<Version[]>(null)

    const [startDate, setStartDate] = useState<Date>(new Date())
    const [endDate, setEndDate] = useState<Date>(new Date())

    const [productInput, setProductInput] = useState<string>(null)
    const [versionInput, setVersionInput] = useState<string>(null)
    const [auditName, setAuditName] = useState<string>(null)

    const history = useHistory()

    useEffect(() => { ProductAPI.findProducts().then(setProducts) }, [])
    useEffect(() => { VersionAPI.findVersions().then(setVersions)}, [])

    if (auditId != 'new') {
        useEffect(() => { AuditAPI.getAudit(auditId).then(setAudit) }, [])
    }

    async function saveAudit(event: FormEvent){
        event.preventDefault()

        if (auditId == 'new') {
            if (auditName != '' && startDate.getDate() != null && endDate.getDate() != null) {
                await AuditAPI.addAudit({   productId: productInput,
                                            versionId: versionInput,
                                            name: auditName,
                                            start: startDate,
                                            end: endDate})

                history.goBack()
            }
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
                { auditId == 'new' || audit ? (
                    <Fragment>
                        <nav>
                            { audit ? <AuditLink audit={audit}/> : <AuditLink/> }                            
                        </nav>
                        <h1>{ auditId == 'new' ? 'Add new audit' : 'View existing audit'}</h1>
                        { auditId == 'new' ? (
                        <form onSubmit={saveAudit} onReset={cancelInput} className='user-input'>
                            <TextInput  
                                label='Audit name:' 
                                placeholder={auditId == 'new' ? 'Add new audit' : audit.name} 
                                change={value => setAuditName(value)}/>
                            <DateInput  
                                label='Start time:'
                                change={date => setStartDate(date)}
                                selected={startDate}/>
                            <DateInput
                                label='End time:'
                                change={date => setEndDate(date)}
                                selected={endDate}/>
                            <div>
                                { products ? (                                  
                                <><div>
                                    <label>Choose product</label>
                                </div><div>
                                    <Dropdown options={products.map(product => { return {value: product.id, label: product.name} })} placeholder='Select product' onChange={productSelected} />
                                </div></>
                                ) : ( <label>No existing products available</label> )}
                            </div>
                            <div>
                                { productInput && (
                                <><div>
                                    <label>Choose version</label>
                                </div><div>
                                    <Dropdown options={versions.map(version => { return {value: version.id, label: version.name} })} placeholder='Select version' onChange={versionSelected} />
                                </div></>)}
                            </div>
                            <div>
                                <div/>
                                <div>
                                    <input type='reset' value='Cancel'/>
                                    <input type='submit' value='Save'/>
                                </div>
                            </div>
                            <div>
                                <div/>
                                <div>
                                    { audit && productInput && versionInput &&
                                    <Link to={`/audits/${auditId}/event`}>
                                        <input type="button" className='enter-audit' value="Enter audit"/>
                                    </Link>
                                    }
                                </div>
                            </div>
                        </form>
                        ) : (
                        <form className='user-input'>
                            <TextInput  
                                label="Audit name:" 
                                value={audit.name} />
                            <TextInput
                                label='Start time:'
                                value={startDate.getDate().toString() + '/' + startDate.getMonth().toString() + '/' + startDate.getFullYear().toString()}/>
                            <TextInput
                                label='End time:'
                                value={endDate.getDate().toString() + '/' + endDate.getMonth().toString() + '/' + endDate.getFullYear().toString()}/>
                            <TextInput
                                label='Product:'
                                value={products.find(product => product.id == audit.productId).name}/>
                            <TextInput
                                label='Version:'
                                value={versions.find(version => version.id == audit.versionId).name}/>
                            <div>
                                <div/>
                                <div>
                                    <Link to={`/audits/${auditId}/event`}>
                                        <input type="button" className='enter-audit' value="Enter audit"/>
                                    </Link>
                                </div>
                            </div>
                        </form>
                        )}
                    </Fragment>
                    ) : (
                        <p>Loading...</p>
                    )}
            </main>
        </div>
    )
}