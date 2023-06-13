import * as React from 'react'
import { Redirect, useParams } from 'react-router'

import { UserContext } from '../../contexts/User'
import { useAsyncHistory } from '../../hooks/history'
import { useTag } from '../../hooks/entity'
import { useMembers } from '../../hooks/list'
import { TagManager } from '../../managers/tag'
import { ButtonInput } from '../inputs/ButtonInput'
import { ColorInput } from '../inputs/ColorInput'
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
    const initialColor = tag ? tag.color : generateRandomColor()

    // STATES

    // - Values
    const [name, setName] = React.useState<string>(initialName)
    const [description, setDescription] = React.useState<string>(initialDescription)
    const [color, setColor] = React.useState<string>(initialColor)

    // - Interactions
    const [active, setActive] = React.useState<string>('left')

    // FUNCTIONS

    async function submit(event: React.FormEvent) {
        // TODO handle unmount!
        event.preventDefault()
        if (tagId == 'new') {
            if (name && color) {
                await TagManager.addTag({ productId, name, description, color })
                replace(`/products/${productId}/tags`)
            }
        } else {
            if (name && color) {
                await TagManager.updateTag(tagId, { name, description, color })
                await replace(`/products/${productId}/tags`)

            }
        }
    }

    function generateRandomColor(): string {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256); 
        const hexR = r.toString(16).padStart(2, '0');
        const hexG = g.toString(16).padStart(2, '0');
        const hexB = b.toString(16).padStart(2, '0');
        return "#" + hexR + hexG + hexB;
      }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Form view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        (tagId == 'new' || (members && tag)) ? (
            (tag && tag.deleted) ? (
                <Redirect to='/' />
            ) : (
                <>
                    <main className={`view product-setting sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <div>
                                <h1>{tagId == 'new' ? 'New tag' : 'Tag settings'}</h1>
                                <form onSubmit={submit}>
                                    <TextInput label='Name' placeholder='Type name' value={name} change={setName} required />
                                    <TextInput label='Description' placeholder='Type description' value={description} change={setDescription} />
                                    <ColorInput label= 'Color' value={color} change={setColor}></ColorInput>
                                    
                                    {contextUser ? (
                                        (tagId == 'new' || members.filter(member => member.userId == contextUser.id && member.role == 'manager').length == 1) ? (
                                            <ButtonInput value='Save' />
                                        ) : (
                                            <ButtonInput value='Save (requires role)' disabled={true} />
                                        )
                                    ) : (
                                        <ButtonInput value='Save (requires login)' disabled={true} />
                                    )}
                                </form>
                            </div>
                            <LegalFooter />
                        </div>
                        <div>
                            <ProductView3D productId={productId} mouse={true} />
                        </div>
                    </main>
                    <ProductFooter items={items} active={active} setActive={setActive} />
                </>
            )
        ) : (
            <LoadingView />
        )
    )
}