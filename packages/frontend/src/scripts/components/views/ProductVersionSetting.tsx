import * as React from 'react'
import { useState, useEffect, useContext, FormEvent, ChangeEvent } from 'react'
import { Redirect, useParams } from 'react-router'

import { Group } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { Version } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { VersionContext } from '../../contexts/Version'
import { useProduct, useMembers, useVersions, useVersion } from '../../hooks/route'
import { render } from '../../functions/render'
import { useAsyncHistory } from '../../hooks/history'
import { VersionManager } from '../../managers/version'
import { parseGLTFModel } from '../../loaders/gltf'
import { parseLDrawModel } from '../../loaders/ldraw'
import { FileInput } from '../inputs/FileInput'
import { GenericInput } from '../inputs/GenericInput'
import { NumberInput } from '../inputs/NumberInput'
import { SubmitInput } from '../inputs/SubmitInput'
import { TextareaInput } from '../inputs/TextareaInput'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
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

    const { goBack } = useAsyncHistory()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)
    const { setContextVersion } = useContext(VersionContext)

    // PARAMS

    const { productId, versionId } = useParams<{ productId: string, versionId: string }>()

    // HOOKS

    const product = useProduct(productId)
    const { members } = useMembers(productId)
    const versions = useVersions(productId)
    const version = useVersion(versionId)

    // STATES

    const [major, setMajor] = useState<number>(0)
    const [minor, setMinor] = useState<number>(0)
    const [patch, setPatch] = useState<number>(0)
    const [baseVersionIds, setBaseVersionIds] = useState<string[]>([])
    const [description, setDescription] = useState<string>('')
    const [file, setFile] = useState<File>()

    const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer>(null)
    const [text, setText] = useState<string>(null)
    const [model, setModel] = useState<GLTF>(null)
    const [group, setGroup] = useState<Group>(null)
    const [blob, setBlob] = useState<Blob>(null) 
    const [dataUrl, setDataUrl] = useState<string>(null) 
    const [active, setActive] = useState<string>('left')

    // EFFECTS

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
            if (file.name.endsWith('.glb')) {
                file.arrayBuffer().then(arrayBuffer => exec && setArrayBuffer(arrayBuffer))
            } else if (file.name.endsWith('.ldr') || file.name.endsWith('.mpd')) {
                file.text().then(text => exec && setText(text))
            }
        }
        return () => { exec = false }
    }, [file])

    useEffect(() => {
        let exec = true
        arrayBuffer && parseGLTFModel(arrayBuffer).then(model => exec && setModel(model))
        return () => { exec = false }
    }, [arrayBuffer])

    useEffect(() => {
        let exec = true
        text && parseLDrawModel(text).then(group => exec && setGroup(group))
        return () => { exec = false }
    }, [text])

    useEffect(() => { model && setGroup(model.scene) }, [model])
    
    useEffect(() => {
        let exec = true
        group && render(group.clone(true), PREVIEW_WIDTH, PREVIEW_HEIGHT).then(result => {
            if (exec) {
                setBlob(result.blob)
                setDataUrl(result.dataUrl)
            }
        })
        return () => { exec = false }
    }, [group])

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
            const version = await VersionManager.addVersion({ productId: product.id, baseVersionIds, major, minor, patch, description }, { model: file, image: blob })
            setContextVersion(version)
        } else {
            await VersionManager.updateVersion(version.id, { ...version, major, minor, patch, description }, { model: file, image: blob })
            setContextVersion(version)
        }
        await goBack()
    }

    // CONSTANTS

    const columns: Column<Version>[] = [
        { label: '📷', class: 'center', content: version => (
            <div className='model' style={{backgroundImage: `url(/rest/files/${version.id}.png)`, width: '5em', height: '5em'}}/>
        ) },
        { label: 'Number', class: 'left fill', content: version => (
            <span>
                {version.major}.{version.minor}.{version.patch}
            </span>
        ) },
        { label: '🛠️', class: 'center', content: version => (
            <input type="checkbox" value={version.id} onChange={onChange}/>
        ) }
    ]

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Form view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        ((versionId == 'new' || version) && product && versions) ? (
            (version && version.deleted) ? (
                <Redirect to='/'/>
            ) : (
                <>
                    <main className= {`view sidebar product-version-setting ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <div>
                                <h1>{versionId == 'new' ? 'New version' : 'Version settings'}</h1>
                                <form onSubmit={onSubmit}>
                                    <NumberInput label='Major' placeholder='Type major' value={major} change={setMajor}/>
                                    <NumberInput label='Minor' placeholder='Type minor' value={minor} change={setMinor}/>
                                    <NumberInput label='Patch' placeholder='Type patch' value={patch} change={setPatch}/>
                                    {versions.length > 0 && (
                                        <GenericInput label="Base">
                                            <Table columns={columns} items={versions.map(v => v).reverse()}/>
                                        </GenericInput>
                                    )}
                                    <TextareaInput label='Description' placeholder='Type description' value={description} change={setDescription}/>
                                    {versionId == 'new' && (
                                        <FileInput label='File' placeholder='Select file' accept='.glb,.ldr,.mpd' change={setFile} required={true}/>
                                    )}
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
                                        members.filter(member => member.userId == contextUser.id && member.role != 'customer').length == 1 ? (
                                            blob ? (
                                                <SubmitInput value='Save'/>
                                            ) : (
                                                <SubmitInput value='Save (requires file)' disabled={true}/>
                                            )
                                        ) : (
                                            <SubmitInput value='Save (requires role)' disabled={true}/>
                                        )
                                    ) : (
                                        <SubmitInput value='Save (requires login)' disabled={true}/>
                                    )}
                                </form>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div>
                            {version ? (
                                <VersionView3D version={version} mouse={true}/>
                            ) : (
                                <div className="widget version_view_3d">
                                    {!file ? (
                                        <img src={EmptyIcon} className='icon medium position center'/>
                                    ) : (
                                        !group ? (
                                            <img src={LoadIcon} className='icon small position center animation spin'/>
                                        ) : (
                                            <ModelView3D model={group} highlighted={[]} marked={[]} selected={[]}/>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </main>
                    <ProductFooter items={items} active={active} setActive={setActive}/>
                </>
            )
        ) : (
            <LoadingView/>
        )
    )
}