import  * as React from 'react'
import { useRef, useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Product, Version} from 'fhooe-audit-platform-common'
import { ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { LinkSource } from '../widgets/LinkSource'
import Datepicker from 'react-datepicker'

export const VersionView = (props: RouteComponentProps<{ version: string, product: string }>) => {

    const versionId = props.match.params.version
    const productId = props.match.params.product

    const versionNameInput = useRef<HTMLInputElement>(null)
        
    const history = useHistory()

    const [product, setProduct] = useState<Product>(null)
    const [version, setVersion] = useState<Version>(null)
    const [currentDate, setCurrentDate] = useState<Date>(new Date())

    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [])

    if (versionId != 'new') {
        useEffect(() => { VersionAPI.getVersion(versionId).then(setVersion) }, [])
    }

    async function addVersion(event: FormEvent){
        event.preventDefault()

        if(versionId == 'new') {
            if (versionNameInput.current.value != '') {
                await VersionAPI.addVersion({ product: productId, name: versionNameInput.current.value, date: currentDate })

                history.goBack()
            }
        }          
    }

    async function cancelInput(_event: React.FormEvent) {
        history.goBack()
    }
        
    return (
        <div className="view version">
            <Header/>
            <Navigation/>
            <main>
                {product && ( version || versionId == 'new' ) ? (
                    <Fragment>
                        <nav>
                            <LinkSource object={product} id={product.id} name={product.name} type='Product'/>     
                            <span>
                                <Link to={`/products/${productId}/version`}>Versions</Link>
                            </span>
                            <span>
                                <Link to={`/products/${productId}/versions/${versionId}`}>{versionId == 'new' ? 'new' : version.name}</Link>
                            </span>
                        </nav>
                        <h1>{ versionId == 'new' ? 'Add new version' : `View existing version` }</h1>
                        <form onSubmit={addVersion} onReset={cancelInput} className='user-input'>
                            <div>
                                <div>
                                    <label>Version name:</label>
                                </div>
                                <div>
                                    <input ref={versionNameInput} placeholder={versionId == 'new' ? 'Add here new version' : version.name}/>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label>Version date:</label>
                                </div>
                                <div>
                                    <Datepicker selected={currentDate} onChange={(date) => setCurrentDate(date)}/>
                                </div>
                            </div>
                            <div>
                                <div/>
                                <div>
                                    <input type="reset" value={ versionId == 'new' ? 'Cancel' : 'Return'}/>
                                    { versionId == 'new' && <input type="submit" value="Save"/> }
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