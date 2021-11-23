import  * as React from 'react'
import { useState, useEffect, useContext, FormEvent, Fragment } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
// Commons
import { Product, Version} from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI, VersionAPI } from '../../clients/rest'
// Contexts
import { UserContext } from '../../contexts/User'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Inputs
import { FileInput } from '../inputs/FileInput'
import { NumberInput } from '../inputs/NumberInput'
// Widgets
import { ModelView } from '../widgets/ModelView'

export const VersionView = (props: RouteComponentProps<{ product: string, version: string }>) => {

    const productId = props.match.params.product
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
    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { versionId != 'new' && VersionAPI.getVersion(versionId).then(setVersion) }, [props])

    // Load values
    useEffect(() => { version && setMajor(version.major) }, [version])
    useEffect(() => { version && setMinor(version.minor) }, [version])
    useEffect(() => { version && setPatch(version.patch) }, [version])

    async function submit(event: FormEvent){
        event.preventDefault()
        if (versionId == 'new') {
            const version = await VersionAPI.addVersion({ userId: user.id, productId: product.id, time: new Date().toISOString(), major, minor, patch }, file)
            history.replace(`/products/${productId}/versions/${version.id}`)
        } else {
            setVersion(await VersionAPI.updateVersion(version.id, { ...version, major, minor, patch }, file))
        }
    }
        
    return (
        <main className="view version">
            { (versionId == 'new' || version) && product && (
                <Fragment>
                    <ProductHeader product={product}/>
                    <main className="sidebar">
                        <div>
                            <form onSubmit={submit} className='data-input'>                     
                                <NumberInput label='Major' placeholder='Type major' value={major} change={setMajor}/>
                                <NumberInput label='Minor' placeholder='Type minor' value={minor} change={setMinor}/>
                                <NumberInput label='Patch' placeholder='Type patch' value={patch} change={setPatch}/>
                                <FileInput label='File' placeholder='Select file' accept='.glb' change={setFile}/>
                                <div>
                                    <div/>
                                    <div>
                                        <input type='submit' value='Save'/>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div>
                            { version && <ModelView url={`/rest/models/${version.id}`} mouse={true}/> }
                        </div>
                    </main>
                </Fragment>
            )}
        </main>
    )

}