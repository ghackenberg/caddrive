import * as React from 'react'
import { Redirect, useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'

import { Member, Product, Tag } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { MemberManager } from '../../managers/member'
import { ProductManager } from '../../managers/product'
import { BooleanInput } from '../inputs/BooleanInput'
import { SubmitInput } from '../inputs/SubmitInput'
import { TextInput } from '../inputs/TextInput'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductView3D } from '../widgets/ProductView3D'
import { TagManager } from '../../managers/tag'
import { LoadingView } from './Loading'

import LeftIcon from '/src/images/setting.png'
import RightIcon from '/src/images/part.png'
import DeleteIcon from '/src/images/delete.png'

export const ProductSettingView = (props: RouteComponentProps<{ product: string }>) => {

    const { replace } = useHistory()

    // CONTEXTS

    const { contextUser } = React.useContext(UserContext)

    // PARAMS

    const productId = props.match.params.product

    // INITIAL STATES

    const initialProduct = productId == 'new' ? undefined : ProductManager.getProductFromCache(productId)
    const initialMembers = productId == 'new' ? [] : MemberManager.findMembersFromCache(productId)
    const initialName = initialProduct ? initialProduct.name : ''
    const initialDescription = initialProduct ? initialProduct.description : ''
    const initialPublic = initialProduct ? initialProduct.public : false
    //const initialTags = productId == 'new' ? [] : TagManager.findTagsFromCache(productId)

    // STATES

    // - Entities
    const [product, setProduct] = React.useState<Product>(initialProduct)
    const [members, setMembers] = React.useState<Member[]>(initialMembers)
    const [tags, setTags] = React.useState<Tag[]>([])
    // - Values
    const [name, setName] = React.useState<string>(initialName)
    const [description, setDescription] = React.useState<string>(initialDescription)
    const [_public, setPublic] = React.useState<boolean>(initialPublic)
    const [tagName, setTagName] = React.useState<string>('')
    const [tagColor, setTagColor] = React.useState<string>('rgba(200, 200, 200, 0.6)')
    // - Interactions
    const [active, setActive] = React.useState<string>('left')
    const [selectedTag, setSelectedTag] = React.useState<Tag>(null)
    
    // EFFECTS

    // - Entities
    React.useEffect(() => { productId != 'new' && ProductManager.getProduct(productId).then(setProduct) }, [props])
    React.useEffect(() => { productId != 'new' && MemberManager.findMembers(productId).then(setMembers) }, [props])
    React.useEffect(() => { productId != 'new' && TagManager.findTags(productId).then(setTags) }, [props])
    // - Values
    React.useEffect(() => { product && setName(product.name) }, [product])
    React.useEffect(() => { product && setDescription(product.description) }, [product])
    React.useEffect(() => { product && setPublic(product.public) }, [product])

    // FUNCTIONS

    async function submit(event: React.FormEvent){
        event.preventDefault()
        if (productId == 'new') {
            if (name && description) {
                const product = await ProductManager.addProduct({ name, description, public: _public })
                replace(`/products/${product.id}`)
            }
        } else {
            if (name && description) {
                await setProduct(await ProductManager.updateProduct(product.id, { name, description, public: _public }))
                replace(`/products/${product.id}`)
            }
        }
    }

    async function addTag(event: React.FormEvent) {
        event.preventDefault()
        const tag = await TagManager.addTag({ productId: productId, color: tagColor, name: 'new tag' })
        setTags((prev) => [...prev, tag])
    }

    async function selectTag(tag: Tag) {
        setTagName(tag.name)
        setTagColor(tag.color)
        setSelectedTag(tag)
    }

    async function updateTag(event: React.FormEvent) {
        event.preventDefault()
        const updatedData = ({ color: tagColor, name: tagName })
        await TagManager.updateTag(selectedTag.id, { ...selectedTag, ...updatedData })
        setTags((prev) => {
            return prev.map((tag) => {
                return tag.id === selectedTag.id
                    ? { tag, ...selectedTag, ...updatedData }
                    : tag
            })
        })

        setSelectedTag(null)
        setTagColor('rgba(200, 200, 200, 0.6)')
        setTagName('')
    }

    async function deleteTag(tag: Tag) {
        await TagManager.deleteTag(tag.id)
        setTags(tags.filter(other => other.id != tag.id))
    }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Form view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        (productId == 'new' || product) && members ? (
            (product && product.deleted) ? (
                <Redirect to='/'/>
            ) : (
                <>
                    <main className= {`view product-setting sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <h1>Settings</h1>
                            <form onSubmit={submit}>
                                <TextInput label='Name' placeholder='Type name' value={name} change={setName} required/>
                                <TextInput label='Description' placeholder='Type description' value={description} change={setDescription} required/>
                                <BooleanInput label='Public' value={_public} change={setPublic}/>

                                <div>
                                            <div>
                                                <label>Tags</label>
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', maxWidth: '21em', flexWrap: 'wrap', padding: '0.5em', borderRadius: '0.5em' }}>
                                                    {tags && tags.map((tag) => (
                                                        <div key={tag.id} style={{margin: '0.3em', padding: '0.2em', backgroundColor: tag.color, display: 'flex', alignItems: 'center', borderRadius: '0.5em' }}>

                                                            <div onClick={() => selectTag(tag)} style={{ display: 'flex' }}>
                                                                {tag.name}
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'right' }}>
                                                                <a onClick={() => deleteTag(tag)}>
                                                                    <img src={DeleteIcon} className='icon medium pad' />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {
                                                        selectedTag === null
                                                            ?
                                                            <button style={{margin: '0.3em', padding: '0.2em', borderRadius: '0.5em' }} onClick={addTag}>
                                                                add tag
                                                            </button>
                                                            :
                                                            <div>
                                                                <TextInput label='update tag' placeholder='Type tag name' value={tagName} change={setTagName} required />

                                                                <select className='button fill lightgray' value={tagColor} onChange={event => setTagColor(event.currentTarget.value)}>
                                                                    <option value={'rgba(200, 200, 200, 0.6)'} >gray</option>
                                                                    <option value={'rgba(165, 115, 40, 0.6)'} >brown</option>
                                                                    <option value={'rgba(255, 150, 0, 0.6)'} >orange</option>
                                                                    <option value={'rgba(255, 255, 0, 0.6)'} >yellow</option>
                                                                    <option value={'rgba(0, 255, 0, 0.6)'} >green</option>
                                                                    <option value={'rgba(0, 0, 255, 0.6)'} >blue</option>
                                                                    <option value={'rgba(165, 0, 255, 0.6)'} >purple</option>
                                                                    <option value={'rgba(255, 0, 255, 0.6)'} >pink</option>
                                                                    <option value={'rgba(255, 0, 0, 0.6)'} >red</option>
                                                                </select>
                                                                <button className='button stroke blue' onClick={updateTag}>
                                                                    update tag
                                                                </button>
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
              
                                {contextUser ? (
                                    (productId == 'new' || members.filter(member => member.userId == contextUser.id && member.role == 'manager').length == 1) ? (
                                        <SubmitInput value='Save'/>
                                    ) : (
                                        <SubmitInput value='Save (requires role)' disabled={true}/>
                                    )
                                ) : (
                                    <SubmitInput value='Save (requires login)' disabled={true}/>
                                )}
                            </form>
                        </div>
                        <div>
                            <ProductView3D product={product} mouse={true}/>
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