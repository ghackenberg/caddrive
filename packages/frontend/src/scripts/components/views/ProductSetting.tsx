import { useContext, useEffect, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router'
import { ProductClient } from '../../clients/rest/product.js'
import { UserContext } from '../../contexts/User.js'
import { back, push, replace } from '../../functions/history.js'
import { useProduct } from '../../hooks/entity.js'
import { useMembers } from '../../hooks/list.js'
import { BooleanInput } from '../inputs/BooleanInput.js'
import { ButtonInput } from '../inputs/ButtonInput.js'
import { TextInput } from '../inputs/TextInput.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter.js'
import { ProductView3D } from '../widgets/ProductView3D.js'
import { LoadingView } from './Loading.js'
import RightIcon from '/src/images/part.png'
import LeftIcon from '/src/images/setting.png'

export const ProductSettingView = () => {

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // LOCATION

    const { hash, search } = useLocation()

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

    // QUERY

    const _initialPublic = new URLSearchParams(search).get('public') == 'false' ? 'false' : 'true'

    // ENTITIES

    const product = useProduct(productId)
    const members = useMembers(productId)

    // INITIAL STATES

    const initialName = product ? product.name : ''
    const initialDescription = product ? product.description : ''
    const initialPublic = product ? product.public : _initialPublic == 'true'

    // STATES

    // - Values
    const [name, setName] = useState<string>(initialName)
    const [description, setDescription] = useState<string>(initialDescription)
    const [_public, setPublic] = useState<boolean>(initialPublic)
    
    // EFFECTS
    
    useEffect(() => { product && setName(product.name) }, [product])
    useEffect(() => { product && setDescription(product.description) }, [product])
    useEffect(() => { product && setPublic(product.public) }, [product])

    // FUNCTIONS

    async function submit(event: React.FormEvent){
        // TODO handle unmount!
        event.preventDefault()
        if(productId == 'new') {
            if (name && description) {
                const product = await ProductClient.addProduct({ name, description, public: _public })
                await back()
                await replace(`/products?public=${_public}`)
                await push(`/products/${product.productId}`)
            }
        } else {
            if (name && description) {
                await ProductClient.updateProduct(productId, { name, description, public: _public })
                await back()
                await replace(`/products?public=${_public}`)
                await push(`/products/${productId}`)
            }
        }
    }

    async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (confirm('Do you really want to delete the product?')) {
            await ProductClient.deleteProduct(productId)
            await back()
        }
    }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { text: 'Form view', image: LeftIcon, hash: '' },
        { text: 'Model view', image: RightIcon, hash: '#model' }
    ]

    const isNew = productId == 'new'
    const isManager = contextUser && members && members.filter(member => member.userId == contextUser.userId && member.role == 'manager').length == 1
    const isOwner = contextUser && product && contextUser.userId == product.userId

    const canSave = contextUser && (contextUser.admin || isNew || isManager)
    const canDelete = contextUser && (contextUser.admin || isOwner)

    // RETURN

    return (
        (productId == 'new' || (product && members)) ? (
            (product && product.deleted) ? (
                <Navigate to='/'/>
            ) : (
                <>
                    <main className= {`view product-setting sidebar ${!hash ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='main'>
                                <h1>
                                    {productId == 'new' ? (
                                        'New product'
                                    ) : (
                                        'Product settings'
                                    )}
                                </h1>
                                <form onSubmit={submit}>
                                    <TextInput label='Name' placeholder='Type name' value={name} change={setName} required/>
                                    <TextInput label='Description' placeholder='Type description' value={description} change={setDescription} required/>
                                    <BooleanInput label='Public' value={_public} change={setPublic}/>
                                    {contextUser ? (
                                        <>
                                            {canSave ? (
                                                <ButtonInput value='Save'/>
                                            ) : (
                                                <ButtonInput value='Save' badge='requires role' disabled={true}/>
                                            )}
                                            {!isNew && (
                                                canDelete ? (
                                                    <ButtonInput value='Delete' class='red' click={handleDelete}/>
                                                ) : (
                                                    <ButtonInput value='Delete' class='red' badge='requires owner' disabled={true}/>
                                                )
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <ButtonInput value='Save' badge='requires login' disabled={true}/>
                                            {!isNew && (
                                                <ButtonInput value='Delete' class='red' badge='requires login' disabled={true}/>
                                            )}
                                        </>
                                    )}
                                </form>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div>
                            <ProductView3D productId={productId} mouse={true}/>
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