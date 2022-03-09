import  * as React from 'react'
import { useState, useEffect, useContext, FormEvent, ChangeEvent, Fragment } from 'react'
import { Redirect, useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
// Commons
import { Product, Version} from 'productboard-common'
// Managers
import { ProductManager } from '../../managers/product'
import { VersionManager } from '../../managers/version'
// Contexts
import { UserContext } from '../../contexts/User'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Inputs
import { FileInput } from '../inputs/FileInput'
import { NumberInput } from '../inputs/NumberInput'
import { TextInput } from '../inputs/TextInput'
// Widgets
import { VersionView3D } from '../widgets/VersionView3D'
// Images
import * as EmptyIcon from '/src/images/empty.png'
import { GenericInput } from '../inputs/GenericInput'

export const VersionView = (props: RouteComponentProps<{ product: string, version: string }>) => {

    const productId = props.match.params.product
    const versionId = props.match.params.version

    const history = useHistory()

    const user = useContext(UserContext)

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [versions, setVersions] = useState<Version[]>()
    const [version, setVersion] = useState<Version>()

    // Define values
    const [major, setMajor] = useState<number>(0)
    const [minor, setMinor] = useState<number>(0)
    const [patch, setPatch] = useState<number>(0)
    const [baseVersionIds, setBaseVersionIds] = useState<string[]>([])
    const [description, setDescription] = useState<string>('')
    const [file, setFile] = useState<File>()

    // Load entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { VersionManager.findVersions(productId).then(setVersions) }, [props])
    useEffect(() => { versionId != 'new' && VersionManager.getVersion(versionId).then(setVersion) }, [props])

    // Load values
    useEffect(() => { version && setMajor(version.major) }, [version])
    useEffect(() => { version && setMinor(version.minor) }, [version])
    useEffect(() => { version && setPatch(version.patch) }, [version])
    useEffect(() => { version && setDescription(version.description) }, [version])

    async function update(event: ChangeEvent<HTMLInputElement>) {
        if (event.currentTarget.checked) {
            setBaseVersionIds([...baseVersionIds, event.currentTarget.value])
        } else {
            setBaseVersionIds(baseVersionIds.filter(versionId => versionId != event.currentTarget.value))
        }
    }

    async function submit(event: FormEvent){
        event.preventDefault()
        if (versionId == 'new') {
            const version = await VersionManager.addVersion({ userId: user.id, productId: product.id, baseVersionIds, time: new Date().toISOString(), major, minor, patch, description }, file)
            history.replace(`/products/${productId}/versions/${version.id}`)
        } else {
            console.log(description)
            setVersion(await VersionManager.updateVersion(version.id, { ...version, major, minor, patch, description }, file))
        }
    }
        
    return (
        <main className="view extended version">
            { (versionId == 'new' || version) && product && versions && (
                <Fragment>
                    { version && version.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>
                                    <h1>Settings</h1>
                                    <form onSubmit={submit}>
                                        <NumberInput label='Major' placeholder='Type major' value={major} change={setMajor}/>
                                        <NumberInput label='Minor' placeholder='Type minor' value={minor} change={setMinor}/>
                                        <NumberInput label='Patch' placeholder='Type patch' value={patch} change={setPatch}/>
                                        <GenericInput label="Base">
                                            <Fragment>
                                                {versions.map(version => version).reverse().map(version => (
                                                    <div key={version.id}>
                                                        <input type="checkbox" value={version.id} onChange={update}/>
                                                        <label>{version.major}.{version.minor}.{version.patch}</label>
                                                    </div>
                                                ))}
                                            </Fragment>
                                        </GenericInput>
                                        <TextInput class='fill' label='Description' placeholder='Type description' value={description} change={setDescription}/>
                                        {versionId == 'new' && <FileInput label='File' placeholder='Select file' accept='.glb' change={setFile}/>}
                                        <div>
                                            <div/>
                                            <div>
                                                <input type='submit' value='Save'/>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div>
                                    { version ? (
                                        <VersionView3D version={version} mouse={true}/>
                                    ) : (
                                        <div className="widget model_view">
                                            <img className='empty' src={EmptyIcon}/>
                                        </div>
                                    )}
                                </div>
                            </main>
                        </Fragment>
                    ) }
                </Fragment>
            )}
        </main>
    )

}