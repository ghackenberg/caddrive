import * as React from 'react'
import { Redirect, useParams } from 'react-router'

import { ProductClient } from '../../clients/rest/product'
import { UserContext } from '../../contexts/User'
import { useAsyncHistory } from '../../hooks/history'
import { useProduct } from '../../hooks/entity'
import { useMembers } from '../../hooks/list'
import { BooleanInput } from '../inputs/BooleanInput'
import { ButtonInput } from '../inputs/ButtonInput'
import { TextInput } from '../inputs/TextInput'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductView3D } from '../widgets/ProductView3D'
import { LoadingView } from './Loading'

import LeftIcon from '/src/images/setting.png'
import RightIcon from '/src/images/part.png'

export const ProductSettingView = () => {

    const { goBack, replace, push } = useAsyncHistory()

    // CONTEXTS

    const { contextUser } = React.useContext(UserContext)

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

    // QUERIES

    const _initialPublic = new URLSearchParams(location.search).get('public') == 'false' ? 'false' : 'true'

    // HOOKS

    const product = useProduct(productId)
    const members = useMembers(productId)

    // INITIAL STATES

    const initialName = product ? product.name : ''
    const initialDescription = product ? product.description : ''
    const initialPublic = product ? product.public : _initialPublic == 'true'

    // STATES

    // - Values
    const [name, setName] = React.useState<string>(initialName)
    const [description, setDescription] = React.useState<string>(initialDescription)
    const [_public, setPublic] = React.useState<boolean>(initialPublic)

    // - Interactions
    const [active, setActive] = React.useState<string>('left')
    
    // EFFECTS
    
    React.useEffect(() => { product && setName(product.name) }, [product])
    React.useEffect(() => { product && setDescription(product.description) }, [product])
    React.useEffect(() => { product && setPublic(product.public) }, [product])

    // FUNCTIONS

    async function submit(event: React.FormEvent){
        // TODO handle unmount!
        event.preventDefault()
        if(productId == 'new') {
            if (name && description) {
                const product = await ProductClient.addProduct({ name, description, public: _public })
                await goBack()
                await replace(`/products?public=${_public}`)
                await push(`/products/${product.productId}`)
            }
        } else {
            if (name && description) {
                await ProductClient.updateProduct(productId, { name, description, public: _public })
                await goBack()
                await replace(`/products?public=${_public}`)
                await push(`/products/${productId}`)
            }
        }
    }

    async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (confirm('Do you really want to delete the product?')) {
            await ProductClient.deleteProduct(productId)
            await goBack()
        }
    }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Form view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
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
                <Redirect to='/'/>
            ) : (
                <>
                    <main className= {`view product-setting sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
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
                    <ProductFooter items={items} active={active} setActive={setActive}/>
                </>
            )
        ) : (
            <LoadingView/>
        )
    )
}