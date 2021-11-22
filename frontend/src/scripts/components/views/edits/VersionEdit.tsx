import  * as React from 'react'
import { useState, useEffect, useContext, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
// Commons
import { Product, Version} from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI, VersionAPI } from '../../../clients/rest'
// Contexts
import { UserContext } from '../../../contexts/User'
// Links
import { VersionLink } from '../../links/VersionLink'
// Inputs
import { FileInput } from '../../inputs/FileInput'
// Widgets
import { ModelView } from '../../widgets/ModelView'
import { NumberInput } from '../../inputs/NumberInput'

export const VersionEditView = (props: RouteComponentProps<{ version: string }>) => {

    const query = new URLSearchParams(props.location.search)

    const productId = query.get('product')
    const versionId = props.match.params.version

    const history = useHistory()

    const user = useContext(UserContext)

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [version, setVersion] = useState<Version>()

    // Define values
    const [major, setMajor] = useState<number>(0)
    const [minor, setMinor] = useState<number>(0)
    const [patch, setPatch] = useState<number>(0)
    const [file, setFile] = useState<File>()

    // Load entities
    useEffect(() => { versionId == 'new' && ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { versionId != 'new' && VersionAPI.getVersion(versionId).then(setVersion) }, [props])
    useEffect(() => { version && ProductAPI.getProduct(version.productId).then(setProduct) } , [version])

    // Load values
    useEffect(() => { version && setMajor(version.major) }, [version])
    useEffect(() => { version && setMinor(version.minor) }, [version])
    useEffect(() => { version && setPatch(version.patch) }, [version])

    async function submit(event: FormEvent){
        event.preventDefault()
        if (versionId == 'new') {
            await VersionAPI.addVersion({ userId: user.id, productId: product.id, time: new Date().toISOString(), major, minor, patch }, file)
            history.replace(`/versions?product=${product.id}`)
        } else {
            await VersionAPI.updateVersion(version.id, { ...version, major, minor, patch }, file)
            history.replace(`/versions?product=${product.id}`)
        }
    }

    async function reset(_event: React.FormEvent) {
        history.goBack()
    }
        
    return (
        <div className="view sidebar version">
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
                                <NumberInput label='Major' placeholder='Type major' value={major} change={setMajor}/>
                                <NumberInput label='Minor' placeholder='Type minor' value={minor} change={setMinor}/>
                                <NumberInput label='Patch' placeholder='Type patch' value={patch} change={setPatch}/>
                                <FileInput label='File' placeholder='Select file' accept='.glb' change={setFile}/>
                                <div>
                                    <div/>
                                    <div>
                                        { versionId == 'new' && <input type='reset' value='Cancel'/> }
                                        <input type='submit' value='Save'/>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div>
                            { version && <ModelView url={`/rest/models/${version.id}`} mouse={true}/> }
                        </div>
                    </main>
                </React.Fragment>
            )}
        </div>
    )

}