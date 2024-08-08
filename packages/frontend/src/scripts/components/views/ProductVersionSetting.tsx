import * as React from 'react'
import { useState, useEffect, useContext, FormEvent, ChangeEvent } from 'react'
import { Redirect, useLocation, useParams } from 'react-router'

import { Group } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { VersionRead } from 'productboard-common'

import { CacheAPI } from '../../clients/cache'
import { VersionClient } from '../../clients/rest/version'
import { UserContext } from '../../contexts/User'
import { VersionContext } from '../../contexts/Version'
import { useProduct, useVersion } from '../../hooks/entity'
import { useMembers, useVersions } from '../../hooks/list'
import { render } from '../../functions/render'
import { useAsyncHistory } from '../../hooks/history'
import { parseGLTFModel } from '../../loaders/gltf'
import { parseLDrawModel, pauseLoadLDrawPath } from '../../loaders/ldraw'
import { parsePLYModel } from '../../loaders/ply'
import { parseSTLModel } from '../../loaders/stl'
import { ButtonInput } from '../inputs/ButtonInput'
import { FileInput } from '../inputs/FileInput'
import { GenericInput } from '../inputs/GenericInput'
import { NumberInput } from '../inputs/NumberInput'
import { TextareaInput } from '../inputs/TextareaInput'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ModelGraph } from '../widgets/ModelGraph'
import { clearModel } from '../widgets/FileView3D'
import { ModelView3D } from '../widgets/ModelView3D'
import { Column, Table } from '../widgets/Table'
import { VersionView3D } from '../widgets/VersionView3D'
import { LoadingView } from './Loading'

import EmptyIcon from '/src/images/empty.png'
import LoadIcon from '/src/images/load.png'
import LeftIcon from '/src/images/setting.png'
import RightIcon from '/src/images/part.png'

const PREVIEW_WIDTH = 1000
const PREVIEW_HEIGHT = 1000

export const ProductVersionSettingView = () => {

    // HISTORY

    const { goBack } = useAsyncHistory()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)
    const { setContextVersion } = useContext(VersionContext)

    // LOCATION

    const { hash } = useLocation()

    // PARAMS

    const { productId, versionId } = useParams<{ productId: string, versionId: string }>()

    // ENTITIES

    const product = useProduct(productId)
    const members = useMembers(productId)
    const versions = useVersions(productId)
    const version = useVersion(productId, versionId)

    // INITIAL STATES

    const initialMajor = version ? version.major : (versions && versions.length > 0 ? versions[versions.length - 1].major : 0)
    const initialMinor = version ? version.minor : (versions && versions.length > 0 ? versions[versions.length - 1].minor : 0)
    const initialPatch = version ? version.patch : (versions && versions.length > 0 ? versions[versions.length - 1].patch + 1 : 0)
    const initialBaseVersionIds = version ? version.baseVersionIds : []
    const initialDescription = version && version.description

    // STATES

    const [major, setMajor] = useState<number>(initialMajor)
    const [minor, setMinor] = useState<number>(initialMinor)
    const [patch, setPatch] = useState<number>(initialPatch)
    const [baseVersionIds, setBaseVersionIds] = useState<string[]>(initialBaseVersionIds)
    const [description, setDescription] = useState<string>(initialDescription)
    const [file, setFile] = useState<File>()

    const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer>(null)
    const [text, setText] = useState<string>(null)
    const [model, setModel] = useState<GLTF>(null)
    const [group, setGroup] = useState<Group>(null)
    const [update, setUpdate] = useState<number>()
    const [loaded, setLoaded] = useState<number>()
    const [total, setTotal] = useState<number>()
    const [blob, setBlob] = useState<Blob>(null) 
    const [dataUrl, setDataUrl] = useState<string>(null)

    // EFFECTS

    useEffect(() => { version && setBaseVersionIds(version.baseVersionIds) }, [version])
    useEffect(() => { version && setMajor(version.major) }, [version])
    useEffect(() => { version && setMinor(version.minor) }, [version])
    useEffect(() => { version && setPatch(version.patch) }, [version])
    useEffect(() => { version && setDescription(version.description) }, [version])

    useEffect(() => {
        let exec = true
        if (file) {
            setArrayBuffer(null)
            setText(null)
            setModel(null)
            setGroup(null)
            setBlob(null)
            setDataUrl(null)
            if (file.name.endsWith('.stl') || file.name.endsWith('.glb')) {
                file.arrayBuffer().then(arrayBuffer => exec && setArrayBuffer(arrayBuffer))
            } else if (file.name.endsWith('.ply') || file.name.endsWith('.ldr') || file.name.endsWith('.mpd')) {
                file.text().then(text => exec && setText(text))
            }
        }
        return () => { exec = false }
    }, [file])

    useEffect(() => {
        let exec = true
        if (arrayBuffer) {
            if (file.name.endsWith('.stl')) {
                parseSTLModel(arrayBuffer).then(group => exec && setGroup(group))
            } else if (file.name.endsWith('.glb')) {
                parseGLTFModel(arrayBuffer).then(model => exec && setModel(model))
            }
        }
        return () => { exec = false }
    }, [arrayBuffer])

    useEffect(() => {
        let exec = true
        function update(_part: string, loaded: number, total: number) {
            setUpdate(Date.now())
            setLoaded(loaded)
            setTotal(total)
        }
        const path = `${Math.random()}`
        if (text) {
            if (file.name.endsWith('.ply')) {
                parsePLYModel(text).then(group => exec && setGroup(group))
            } else if (file.name.endsWith('.ldr') || file.name.endsWith('.mpd')) {
                parseLDrawModel(path, text, update).then(group => exec && setGroup(group))
            }
        }
        return () => {
            exec = false
            pauseLoadLDrawPath(path)
        }
    }, [text])

    useEffect(() => { model && setGroup(model.scene) }, [model])
    
    useEffect(() => {
        let exec = true
        group && loaded == total && render(group.clone(true), PREVIEW_WIDTH, PREVIEW_HEIGHT).then(result => {
            if (exec) {
                setBlob(result.blob)
                setDataUrl(result.dataUrl)
            }
        })
        return () => { exec = false }
    }, [group, loaded, total])

    // FUNCTIONS

    async function onChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.currentTarget.checked) {
            setBaseVersionIds([...baseVersionIds, event.currentTarget.value])
        } else {
            setBaseVersionIds(baseVersionIds.filter(versionId => versionId != event.currentTarget.value))
        }
    }

    async function onSubmit(event: FormEvent) {
        // TODO handle unmount!
        event.preventDefault()
        if (versionId == 'new') {
            const data = { baseVersionIds, major, minor, patch, description }
            const files = { model: file, image: blob }
            const version = await VersionClient.addVersion(productId, data, files)
            setContextVersion(version)
        } else {
            const previous = `${versionId}.${version.modelType}`
            const data = { baseVersionIds, major, minor, patch, description }
            const files = file && { model: file, image: blob }
            await VersionClient.updateVersion(productId, versionId, data, files)
            if (file) {
                CacheAPI.clearFile(previous)
                clearModel(previous)
            }
            setContextVersion(version)
        }
        await goBack()
    }

    async function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (confirm('Are you sure?')) {
            await VersionClient.deleteVersion(productId, versionId)
            const filtered = versions && versions.filter(version => version.versionId != versionId)
            if (filtered && filtered.length > 0) {
                setContextVersion(filtered[filtered.length - 1])
            } else {
                setContextVersion(undefined)
            }
            await goBack()
        }
    }

    // CONSTANTS

    const columns: Column<VersionRead>[] = [
        { label: '📷', class: 'center', content: version => (
            <div className='model' style={{backgroundImage: `url(/rest/files/${version.versionId}.png)`, width: '5em', height: '5em'}}/>
        ) },
        { label: 'Number', class: 'left fill', content: version => (
            <span>
                {version.major}.{version.minor}.{version.patch}
            </span>
        ) },
        { label: '🛠️', class: 'center', content: version => (
            <input type="checkbox" value={version.versionId} checked={baseVersionIds.includes(version.versionId)} onChange={onChange}/>
        ) }
    ]

    const items: ProductFooterItem[] = [
        { text: 'Form view', image: LeftIcon, hash: '' },
        { text: 'Model view', image: RightIcon, hash: '#model' }
    ]

    // RETURN

    return (
        ((versionId == 'new' || version) && product && versions) ? (
            (version && version.deleted) ? (
                <Redirect to='/'/>
            ) : (
                <>
                    <main className= {`view sidebar product-version-setting ${!hash ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='main'>
                                <h1>
                                    {versionId == 'new' ? (
                                        'New version'
                                    ) : (
                                        'Version settings'
                                    )}
                                </h1>
                                <form onSubmit={onSubmit}>
                                    <NumberInput label='Major' placeholder='Type major' value={major} change={setMajor}/>
                                    <NumberInput label='Minor' placeholder='Type minor' value={minor} change={setMinor}/>
                                    <NumberInput label='Patch' placeholder='Type patch' value={patch} change={setPatch}/>
                                    {versions.length > 0 && (
                                        <GenericInput label="Base">
                                            <Table columns={columns} items={versions.filter(vers => version == undefined || vers.created < version.created).map(v => v).reverse()}/>
                                        </GenericInput>
                                    )}
                                    <TextareaInput label='Description' placeholder='Type description' value={description} change={setDescription}/>
                                    <FileInput label='File' placeholder='Select file' accept='.stl,.ply,.glb,.ldr,.mpd' change={setFile} required={version == undefined}/>
                                    <GenericInput label='Preview'>
                                        {dataUrl ? (
                                            <img src={dataUrl} style={{width: '10em', background: 'rgb(215,215,215)', borderRadius: '1em', display: 'block'}}/>
                                        ) : (
                                            file ? (
                                                <em>Rendering preview...</em>
                                            ) : (
                                                <em>Please select file</em>
                                            )
                                        )}
                                    </GenericInput>
                                    {contextUser ? (
                                        contextUser.admin || members.filter(member => member.userId == contextUser.userId && member.role != 'customer').length == 1 ? (
                                            <>
                                                {version || blob ? (
                                                    <ButtonInput value='Save'/>
                                                ) : (
                                                    <ButtonInput value='Save' badge='requires file' disabled={true}/>
                                                )}
                                                <ButtonInput value='Delete' class='red' click={onClick}/>
                                            </>
                                        ) : (
                                            <ButtonInput value='Save' badge='requires role' disabled={true}/>
                                        )
                                    ) : (
                                        <ButtonInput value='Save' badge='requires login' disabled={true}/>
                                    )}
                                </form>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div>
                            {version ? (
                                file ? (
                                    <div className="widget version_view_3d">
                                        <div className="widget file_view_3d">
                                            {!group ? (
                                                <img src={LoadIcon} className='icon small position center animation spin'/>
                                            ) : (
                                                <>
                                                    {loaded != total ? (
                                                        <div className='widget model_graph'>
                                                            Loading ...
                                                        </div>
                                                    ) : (
                                                        <ModelGraph model={group}/>
                                                    )}

                                                    <ModelView3D model={group} update={update}/>

                                                    {loaded != total && (
                                                        <div className='progress_bar'>
                                                            <div className='indicator' style={{width: `${Math.floor(loaded / total * 100)}%`}}></div>
                                                            <div className='text'>{Math.floor(loaded / total * 100)}%</div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <VersionView3D version={version} mouse={true}/>
                                )
                            ) : (
                                <div className="widget version_view_3d">
                                    <div className="widget file_view_3d">
                                        {!file ? (
                                            <img src={EmptyIcon} className='icon medium position center'/>
                                        ) : (
                                            !group ? (
                                                <img src={LoadIcon} className='icon small position center animation spin'/>
                                            ) : (
                                                <>
                                                    {loaded != total ? (
                                                        <div className='widget model_graph'>
                                                            Loading ...
                                                        </div>
                                                    ) : (
                                                        <ModelGraph model={group}/>
                                                    )}

                                                    <ModelView3D model={group} update={update}/>

                                                    {loaded != total && (
                                                        <div className='progress_bar'>
                                                            <div className='indicator' style={{width: `${Math.floor(loaded / total * 100)}%`}}></div>
                                                            <div className='text'>{Math.floor(loaded / total * 100)}%</div>
                                                        </div>
                                                    )}
                                                </>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                    <ProductFooter items={items}/>
                </>
            )
        ) : (
            <LoadingView/>
        )
    )
}