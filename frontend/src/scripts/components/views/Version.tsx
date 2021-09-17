import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
import { Product, Version} from 'fhooe-audit-platform-common'
import { ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { DateInput, TextInput } from './forms/InputForms'
import { VersionLink } from './forms/VersionLink'
import Dropdown, { Option } from 'react-dropdown'

export const VersionView = (props: RouteComponentProps<{ version: string}>) => {

    const versionId = props.match.params.version
        
    const history = useHistory()

    const [version, setVersion] = useState<Version>(null)
    const [products, setProducts] = useState<Product[]>(null)
    const [versionName, setVersionName] = useState<string>(null)
    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const [productInput, setProductInput] = useState<string>(null)

    useEffect(() => { ProductAPI.findProducts().then(setProducts) }, [])

    if (versionId != 'new') {
        useEffect(() => { VersionAPI.getVersion(versionId).then(setVersion) }, [])
    }

    async function addVersion(event: FormEvent){
        event.preventDefault()

        if(versionId == 'new') {
            if (versionName != '') {
                await VersionAPI.addVersion({ product: productInput, name: versionName, date: currentDate })

                history.goBack()
            }
        }          
    }

    async function productSelected(option: Option) {
        setProductInput(option.value)
    }

    async function cancelInput(_event: React.FormEvent) {
        history.goBack()
    }
        
    return (
        <div className="view version">
            <Header/>
            <Navigation/>
            <main>
                { version || versionId == 'new' ? (
                    <Fragment>
                        <nav>
                            { version ? <VersionLink version={version}/> : <VersionLink/> }
                        </nav>
                        <h1>{ versionId == 'new' ? 'Add new version' : `View existing version` }</h1>
                        { versionId == 'new' ? (
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
                                { products ? (                                  
                                <><div>
                                    <label>Choose product</label>
                                </div><div>
                                    <Dropdown options={products.map(product => { return {value: product.id, label: product.name} })} placeholder='Select product' onChange={productSelected} />
                                </div></>
                                ) : ( <label>No existing products available</label> )}
                            </div>
                            <div>
                                <div/>
                                <div>
                                    <input type="reset" value={ versionId == 'new' ? 'Cancel' : 'Return'}/>
                                    { versionId == 'new' && versionName!='' && productInput!=null && <input type="submit" value="Save"/> }
                                </div>
                            </div>
                        </form>
                        ) : (
                        <form onReset={cancelInput} className='user-input'>
                            <TextInput
                                label='Version name:'
                                value={version.name}/>
                            <TextInput
                                label='Version date:'
                                value={currentDate.getDate().toString() + '/' + currentDate.getMonth().toString() + '/' + currentDate.getFullYear().toString()}/>
                            <TextInput
                                label='Product'
                                value={products.find(product => product.id == version.product).name}/>
                            <div>
                                <div/>
                                <div>
                                    <input type='reset' value='Return'/>
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