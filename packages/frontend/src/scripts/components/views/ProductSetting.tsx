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
import { LoadingView } from './Loading'
import { TagManager } from '../../managers/tag'
import { TagInput } from '../inputs/TagInput'

import LeftIcon from '/src/images/setting.png'
import RightIcon from '/src/images/part.png'

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

    // STATES

    // - Entities
    const [product, setProduct] = React.useState<Product>(initialProduct)
    const [members, setMembers] = React.useState<Member[]>(initialMembers)
    const [tags, setTags] = React.useState<Tag[]>()
    // - Values
    const [name, setName] = React.useState<string>(initialName)
    const [description, setDescription] = React.useState<string>(initialDescription)
    const [_public, setPublic] = React.useState<boolean>(initialPublic)
    // - Interactions
    const [active, setActive] = React.useState<string>('left')
    
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

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Form view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        (productId == 'new' || product) && members && tags ? (
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
                                <TagInput label='Tags' value= {tags} productId= {productId} assignable= {true}/>
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