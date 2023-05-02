import * as React from 'react'

import { Tag } from 'productboard-common'

import { TagManager } from '../../managers/tag'
import { TextInput } from '../inputs/TextInput'

import DownIcon from '/src/images/down.png'
import UpIcon from '/src/images/up.png'

export const TagView = (props: { value: Tag[], productId: string, assignable: boolean }) => {

    // PARAMS

    const productId = props.productId

    // STATES

    // - Entities
    const [tags, setTags] = React.useState<Tag[]>(props.value)
    // - Values
    const [tagName, setTagName] = React.useState<string>('')
    const [tagColor, setTagColor] = React.useState<string>('blue')
    // - Interactions
    const [selectedTag, setSelectedTag] = React.useState<Tag>(null)
    const [expanded, setExpanded] = React.useState<boolean>(false)

    async function selectTag(tag: Tag) {
        setTagName(tag.name)
        setTagColor(tag.color)
        setSelectedTag(tag)
        setExpanded(true)
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
        setTagColor('blue')
        setTagName('')
    }

    async function deleteTag(event: React.FormEvent) {
        event.preventDefault()
        await TagManager.deleteTag(selectedTag.id)
        setTags(tags.filter(other => other.id != selectedTag.id))
        setSelectedTag(null)
        setTagColor('blue')
        setTagName('')
    }

    return (
        <div className={`widget tag_view button fill lightgray ${expanded ? 'expanded' : 'collapsed'}`}>
            <div className='dropdown_toggle' onClick={() => setExpanded(expanded => !expanded)}>
                <img src={expanded ? UpIcon : DownIcon} className='icon medium pad' />
            </div>
            <div className='tag_container'>
                {tags && tags.map((tag) => (
                    <div className={`tag ${tag.color}`} key={tag.id} onClick={() => selectTag(tag)}>
                        {tag.name}
                    </div>
                ))}
            </div>
            <div className='tag_settings'>
                {
                    selectedTag === null
                        ?
                        <button className='button fill green inline' onClick={addTag}>
                            add tag
                        </button>
                        :
                        <div>
                        <form>
                            <TextInput label='Name' placeholder='Type tag name' value={tagName} change={setTagName} required />
                            <div>

                                <div>
                                    <label>Color</label>
                                </div>
                                <div>
                                    <select className='button fill lightgray' value={tagColor} onChange={event => setTagColor(event.currentTarget.value)}>
                                        <option value={'gray'} >gray</option>
                                        <option value={'brown'} >brown</option>
                                        <option value={'orange'} >orange</option>
                                        <option value={'yellow'} >yellow</option>
                                        <option value={'green'} >green</option>
                                        <option value={'blue'} >blue</option>
                                        <option value={'purple'} >purple</option>
                                        <option value={'pink'} >pink</option>
                                        <option value={'red'} >red</option>
                                    </select>
                                </div>
                            </div>
                            </form>
                            <div className='buttons'>
                            { props.assignable && 
                                <button className='button fill green' onClick={updateTag}>
                                    assign
                                </button>
                            }
                            
                            <button className='button fill blue' onClick={updateTag}>
                                update
                            </button>
                            <button className='button fill red' onClick={deleteTag}>
                                delete
                            </button>
                            <button className='button stroke red' onClick={() => setSelectedTag(null)}>
                                cancel
                            </button>
                            </div>
                            </div>
                }
            </div>
        </div>
    )
}