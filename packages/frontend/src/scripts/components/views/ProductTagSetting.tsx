import * as React from 'react'
import { Redirect, useParams } from 'react-router'

import { UserContext } from '../../contexts/User'
import { useAsyncHistory } from '../../hooks/history'
import { useTag } from '../../hooks/entity'
import { useMembers } from '../../hooks/list'
import { TagManager } from '../../managers/tag'
import { SubmitInput } from '../inputs/SubmitInput'
import { TextInput } from '../inputs/TextInput'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductView3D } from '../widgets/ProductView3D'
import { LoadingView } from './Loading'

import LeftIcon from '/src/images/setting.png'
import RightIcon from '/src/images/part.png'

export const ProductTagSettingView = () => {

    const { replace } = useAsyncHistory()

    // CONTEXTS

    const { contextUser } = React.useContext(UserContext)

    // PARAMS

    const { productId } = useParams<{ productId: string }>()
    const { tagId } = useParams<{ tagId: string }>()

    // HOOKS

    const tag = useTag(tagId)
    const members = useMembers(productId)

    // INITIAL STATES

    const initialName = tag ? tag.name : ''
    const initialDescription = tag ? tag.description : ''

    const colors: string[] = ['brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red' ]
    const initialColor = tag ? tag.color : colors[Math.floor(colors.length * Math.random())]

    // STATES

    // - Values
    const [name, setName] = React.useState<string>(initialName)
    const [description, setDescription] = React.useState<string>(initialDescription)
    const [color, setColor] = React.useState<string>(initialColor)

    // - Interactions
    const [active, setActive] = React.useState<string>('left')
    
    // EFFECTS

    // - Values
    
    // React.useEffect(() => { tag && setName(tag.name) }, [tag])
    // React.useEffect(() => { tag && setDescription(tag.productId) }, [tag])
    // React.useEffect(() => { tag && setColor(tag.color) }, [tag])

    // FUNCTIONS

    async function submit(event: React.FormEvent){
        // TODO handle unmount!
        event.preventDefault()
        if (tagId == 'new') {
            if (name && color) {
                await TagManager.addTag({productId, name, description, color })
                replace(`/products/${productId}/tags`)
            }
        } else {
            if (name && color) {
                await TagManager.updateTag(tagId, { name, description, color })
                await replace(`/products/${productId}/tags`)
                
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
        (tagId == 'new' || ( members && tag)) ? (
            (tag && tag.deleted) ? (
                <Redirect to='/'/>
            ) : (
                <>
                    <main className= {`view product-setting sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <div>
                                <h1>{tagId == 'new' ? 'New tag' : 'Tag settings'}</h1>
                                <form onSubmit={submit}>
                                    <TextInput label='Name' placeholder='Type name' value={name} change={setName} required/>
                                    <TextInput label='Description' placeholder='Type description' value={description} change={setDescription}/>
                                    <div>
                                    <p>color:</p>
                                    <div>
                                        <select className='button fill lightgray' value={color} onChange={event => setColor(event.currentTarget.value)}>
                                            { colors.map((color) => <option key={color} value={color}>{color}</option>) }
                                        </select>
                                    </div>
                                </div>
                                    {contextUser ? (
                                        (tagId == 'new' || members.filter(member => member.userId == contextUser.id && member.role == 'manager').length == 1) ? (
                                            <SubmitInput value='Save'/>
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