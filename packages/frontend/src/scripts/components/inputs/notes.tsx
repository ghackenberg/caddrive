import * as React from 'react'

import { Tag } from 'productboard-common'

import { TagManager } from '../../managers/tag'
import { TextInput } from '../inputs/TextInput'

import DeleteIcon from '/src/images/delete.png'

export const TagInput = (props: { label: string, value: Tag[], productId: string }) => {

    // PARAMS

    const productId = props.productId

    // STATES

    // - Entities
    const [tags, setTags] = React.useState<Tag[]>(props.value)
    // - Values
    const [tagName, setTagName] = React.useState<string>('')
    const [tagColor, setTagColor] = React.useState<string>('rgba(200, 200, 200, 0.6)')
    // - Interactions
    const [selectedTag, setSelectedTag] = React.useState<Tag>(null)

    async function selectTag(tag: Tag) {
        setTagName(tag.name)
        setTagColor(tag.color)
        setSelectedTag(tag)
    }
    async function addTag(event: React.FormEvent) {
        event.preventDefault()
        const tag = await TagManager.addTag({ productId: productId, color: tagColor, name: 'new tag' })
        setTags((prev) => [...prev, tag])
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

    return (
            <div>
                <div style={{ display: 'flex', maxWidth: '21em', flexWrap: 'wrap', padding: '0.5em', borderRadius: '0.5em' }}>
                    {tags && tags.map((tag) => (
                        <div key={tag.id} style={{ margin: '0.3em', padding: '0.2em', backgroundColor: tag.color, display: 'flex', alignItems: 'center', borderRadius: '0.5em' }}>

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
                            <button style={{ margin: '0.3em', padding: '0.2em', borderRadius: '0.5em' }} onClick={addTag}>
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
    )
}