import  * as React from 'react'
import { useState, useEffect, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
// Commons
import { Product, Version} from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI, VersionAPI } from '../../../clients/rest'
// Links
import { VersionLink } from '../../links/VersionLink'
// Inputs
import { TextInput } from '../../inputs/TextInput'
import { DateInput } from '../../inputs/DateInput'
import { FileInput } from '../../inputs/FileInput'

export const VersionEditView = (props: RouteComponentProps<{ version: string }>) => {

    const query = new URLSearchParams(props.location.search)

    const productId = query.get('product')
    const versionId = props.match.params.version

    const history = useHistory()

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [version, setVersion] = useState<Version>()

    // Define values
    const [name, setName] = useState<string>('')
    const [date, setDate] = useState<Date>(new Date())
    const [file, setFile] = useState<File>()

    // Load entities
    useEffect(() => { versionId == 'new' && ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { version && ProductAPI.getProduct(version.productId).then(setProduct) } , [props, version])
    useEffect(() => { versionId == 'new' || VersionAPI.getVersion(versionId).then(setVersion) }, [props])

    // Load values
    useEffect(() => { version && setName(version.name) }, [version])
    useEffect(() => { version && setDate(new Date(version.date)) }, [version])

    async function submit(event: FormEvent){
        event.preventDefault()
        if (versionId == 'new') {
            if (name && date) {
                const version = await VersionAPI.addVersion({ productId: product.id, name: name, date: date.toISOString() }, file)
                history.replace(`/audits?version=${version.id}`)
            }
        } else {
            if (name && date) {
                setVersion(await VersionAPI.updateVersion(version.id, { name: name, productId: version.productId, date: date.toISOString() }, file))
                history.replace(`/audits?version=${version.id}`)
            }
        }
    }

    async function reset(_event: React.FormEvent) {
        history.goBack()
    }
        
    return (
        <div className="view version">
            { (versionId == 'new' || version) && product && (
                <React.Fragment>
                    <header>
                        <nav>
                            <VersionLink version={version} product={product}/>
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>Version editor</h1>
                            <form onSubmit={submit} onReset={reset} className='data-input'>                     
                                <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                                <FileInput label='File' placeholder='Select file' accept='.txt,.glb' change={setFile}/>
                                <DateInput label='Date' placeholder='Select date' value={date} change={setDate}/>
                                <div>
                                    <div/>
                                    <div>
                                        { versionId == 'new' && <input type='reset' value='Cancel'/> }
                                        <input type='submit' value='Save'/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </main>
                </React.Fragment>
            )}
        </div>
    )

}