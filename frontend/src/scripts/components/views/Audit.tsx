import * as React from 'react'
import { useRef, useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Audit, Product, Version } from '../../data'
import { AuditAPI, ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { LinkSource } from '../widgets/LinkSource'
import Datepicker from 'react-datepicker'
import Dropdown from 'react-dropdown'

export const AuditView = (props: RouteComponentProps<{audit: string}>) => {

    const auditId = props.match.params.audit

    const [audit, setAudit] = useState<Audit>(null)
    const [products, setProducts] = useState<Product[]>(null)
    const [versions, setVersions] = useState<Version[]>(null)

    const [startDate, setStartDate] = useState<Date>(new Date())
    const [endDate, setEndDate] = useState<Date>(new Date())

    useEffect(() => { ProductAPI.findAll().then(setProducts) }, [])
    useEffect(() => { VersionAPI.findAll('productId').then(setVersions) }, [])      // TODO: change to productId from dropdown userinput

    if (auditId != 'new') {
        useEffect(() => { AuditAPI.getAudit(auditId).then(setAudit) }, [])
    }

    const productString = [ 'one', 'two', 'three']
// TODO: implement to dropdown menu
//   const productNames = products.map(product => product.name)
//    const versionNames = versions.map(version => version.name)

    const auditInput = useRef<HTMLInputElement>(null)
    const history = useHistory()

    async function saveAudit(event: FormEvent){
        event.preventDefault()

        if (auditId == 'new') {
            if (auditInput.current.value != '' && startDate.getDate() != null && endDate.getDate() != null) {
                await AuditAPI.addAudit({   productId: 'null',
                                            versionId: 'null',
                                            name: auditInput.current.value,
                                            start: startDate,
                                            end: endDate})

                history.goBack()
            }
        }
        else {
            if (auditInput.current.value != '' && startDate.getDate() != null && endDate.getDate() != null) {
                await AuditAPI.updateAudit({id: auditId,
                                            productId: 'null',
                                            versionId: 'null',  
                                            name: auditInput.current.value, 
                                            start: startDate, 
                                            end: endDate})

                history.goBack()
            }
        }
    }

    async function cancelInput() {
        history.goBack()
    }

    async function enterAudit(event: FormEvent) {
        event.preventDefault()
        
        // TODO: implement AuditAPI.addComment
    }

    return (
        <div className='view audit'>
            <Header/>
            <Navigation/>
            <main>
                { auditId == 'new' || audit ? (
                    <Fragment>
                        <nav>
                            { audit ? ( 
                            <LinkSource object={audit} id={audit.id} name={audit.name} type='Audit'/> 
                            ) : (
                            <LinkSource object={'new'} id={'new'} name={'new'} type='Audit'/> 
                            )}
                        </nav>
                        <h1>{ auditId == 'new' ? 'Add new Audit' : 'Change existing Audit' }</h1>
                        <form onSubmit={saveAudit} onReset={cancelInput}>
                            <div>
                                <div>
                                    <label>Audit name:</label>
                                </div>
                                <div>
                                    <input ref={auditInput} placeholder={ auditId == 'new' ? 'Add new audit' : audit.name }/>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label>Start time:</label>
                                </div>
                                <div>
                                    <Datepicker selected={startDate} onChange={(date) => setStartDate(date)}/>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label>End time:</label>
                                </div>
                                <div>
                                    <Datepicker selected={endDate} onChange={(date) => setEndDate(date)}/>
                                </div>
                            </div>

                            <div>
                                { products ? (
                                <><div>
                                    <label>Chose product</label>
                                </div><div>
                                    <Dropdown options={productString} placeholder='Select product' /* TODO: get selected productId for version*/ />
                                </div></>
                                ) : ( <label>No existing products available</label> )}
                            </div>
                            <div>
                                { versions /* TODO: && add product.id*/ ? (
                                <><div>
                                    <label>Chose version</label>
                                </div><div>
                                    <Dropdown options={productString} placeholder='Select version' /* TODO: get selected versionId */ />
                                </div></>
                                ) : ( <label>No existing versions to chosen product available</label> )}
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
                                    { audit && 
                                    <Link to={`/audits/${audit.id}/memo`}>
                                        <input type="button" className='enter-audit' value="Enter audit" onChange={enterAudit} />
                                    </Link>
                                    }
                                </div>
                            </div>
                        </form>
                    </Fragment>
                    ) : (
                        <p>Loading...</p>
                    )}
            </main>
        </div>
    )
}