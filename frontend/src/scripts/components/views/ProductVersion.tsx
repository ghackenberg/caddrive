import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Product, Version} from 'fhooe-audit-platform-common'
import { ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { DateInput, TextInput } from './forms/InputForms'
import { ProductLink } from './forms/ProductLink'

export const ProductVersionView = (props: RouteComponentProps<{ version: string, product: string }>) => {

    const versionId = props.match.params.version
    const productId = props.match.params.product
        
    const history = useHistory()

    const [product, setProduct] = useState<Product>(null)
    const [version, setVersion] = useState<Version>(null)
    const [versionName, setVersionName] = useState<string>(null)
    const [currentDate, setCurrentDate] = useState<Date>(new Date())

    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [])

    if (versionId != 'new') {
        useEffect(() => { VersionAPI.getVersion(versionId).then(setVersion) }, [])
    }

    async function addVersion(event: FormEvent){
        event.preventDefault()

        if(versionId == 'new') {
            if (versionName != '') {
                await VersionAPI.addVersion({ product: productId, name: versionName, date: currentDate })

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
                            <ProductLink product={product}/>
                            <span>
                                <Link to={`/products/${productId}/version`}>Versions</Link>
                            </span>
                            <span>
                                <Link to={`/products/${productId}/versions/${versionId}`}>{versionId == 'new' ? 'new' : version.name}</Link>
                            </span>
                        </nav>
                        <h1>{ versionId == 'new' ? 'Add new version' : `View existing version` }</h1>
                        <form onSubmit={addVersion} onReset={cancelInput} className='user-input'>
                            <TextInput 
                                label='Version name:'
                                placeholder={versionId == 'new' ? 'Add here new version' : version.name}
                                change={value => setVersionName(value)}/>
                            <DateInput
                                label='Version date:'
                                change={date => setCurrentDate(date)}
                                selected ={currentDate}/>
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