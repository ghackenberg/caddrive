import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
import { Product, Version} from 'fhooe-audit-platform-common'
import { ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { DateInput, DropdownInput, TextInput } from '../snippets/InputForms'
import { VersionLink } from '../snippets/LinkSource'
import { Option } from 'react-dropdown'

export const VersionView = (props: RouteComponentProps<{ version: string}>) => {

    const versionId = props.match.params.version
        
    const history = useHistory()

    const [version, setVersion] = useState<Version>(null)
    const [product, setProduct] = useState<Product>(null)
    const [products, setProducts] = useState<Product[]>(null)
    const [versionName, setVersionName] = useState<string>(null)
    const [currentDate, setCurrentDate] = useState<Date>()
    const [productInput, setProductInput] = useState<string>(null)

    useEffect(() => { ProductAPI.findProducts().then(setProducts) }, [])

    if (versionId != 'new') {
        useEffect(() => { VersionAPI.getVersion(versionId).then(version => {
            setVersion(version)
            ProductAPI.getProduct(version.productId).then(setProduct)
        }) }, [])
    }

    async function addVersion(event: FormEvent){
        event.preventDefault()

        if(versionId == 'new') {
            if (versionName && currentDate && productInput) {
                await VersionAPI.addVersion({ productId: productInput, name: versionName, date: currentDate })

                history.goBack()
            }
        }
        else {
            await VersionAPI.deleteVersion(version)

            history.goBack()
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
                { (version) || (versionId == 'new' && products) ? (
                    <Fragment>
                        <nav>
                            { version ? <VersionLink version={version}/> : <VersionLink/> }
                        </nav>
                        <h1>{ versionId == 'new' ? 'Add new version' : `View existing version` }</h1>
                        <form onSubmit={addVersion} onReset={cancelInput} className='user-input'>                     
                            <TextInput 
                                label='Version name'
                                placeholder='Add here new version'
                                value={version ? version.name : undefined}
                                change={value => setVersionName(value)}
                                disabled={versionId != 'new'}/>
                            {versionId == 'new' || (versionId != 'new' && version) ?
                            <DateInput
                                label='Version date'
                                placeholder='Select version date'
                                change={date => setCurrentDate(date)}
                                selected ={versionId != 'new' ? new Date(version.date) : currentDate}
                                disabled={versionId != 'new'}/> : <p>Loading...</p> }
                            {(versionId == 'new' && products) || (versionId != 'new' && product && products) ?
                            <DropdownInput
                                label='Choose product'
                                placeholder='Select product'
                                options={products.map(product => { return {value: product.id, label: product.name} })}
                                value={versionId != 'new' ? {value: product.id, label: product.name} : undefined}
                                change={productSelected}
                                disabled={versionId != 'new'}/> : <p>Loading...</p> }
                            <div>
                                <div/>
                                <div>
                                    <input type="reset" value={ versionId == 'new' ? 'Cancel' : 'Return'}/>
                                    <input  type="submit" 
                                            value={versionId == 'new' ? 'Save' : 'Delete'}
                                            className={versionId == 'new' ? 'saveItem' : 'deleteItem'}/>
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