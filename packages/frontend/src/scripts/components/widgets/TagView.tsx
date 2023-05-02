import * as React from 'react'

import { Tag } from 'productboard-common'

import { TagManager } from '../../managers/tag'

import DownIcon from '/src/images/down.png'
import UpIcon from '/src/images/up.png'

export const TagView = (props: { value: Tag[], productId: string, assignable: boolean }) => {

    // PARAMS

    const productId = props.productId

    // STATES

    // - Entities
    const [tags, setTags] = React.useState<Tag[]>(props.value)
    // - Values
    const [tagName, setTagName] = React.useState<string>('new tag')
    const [tagColor, setTagColor] = React.useState<string>('blue')
    // - Interactions
    const [selectedTag, setSelectedTag] = React.useState<Tag>(null)
    const [expanded, setExpanded] = React.useState<boolean>(true)

    function toggleDropdown() {
        setExpanded(expanded => !expanded)
        expanded && setSelectedTag(null)
        setTagName('new tag')
        setTagColor('blue')
    }

    function selectTag(tag: Tag) {
        setTagName(tag.name)
        setTagColor(tag.color)
        setSelectedTag(tag)
        setExpanded(true)
    }
    function deselectTag(event: React.FormEvent) {
        event.preventDefault()
        setSelectedTag(null)
        setTagName('new tag')
        setTagColor('blue')
    }
    async function addTag(event: React.FormEvent) {
        event.preventDefault()
        const tag = await TagManager.addTag({ productId: productId, color: tagColor, name: tagName || 'new tag' })
        setTags((prev) => [...prev, tag])
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
    }

    async function deleteTag(event: React.FormEvent) {
        event.preventDefault()
        await TagManager.deleteTag(selectedTag.id)
        setTags(tags.filter(other => other.id != selectedTag.id))
        setSelectedTag(null)
        setTagColor('blue')
        setTagName('new tag')
    }

    return (
        <div className={`widget tag_view button fill lightgray ${expanded ? 'expanded' : 'collapsed'}`}>
            <div className='dropdown_toggle' onClick={toggleDropdown}>
                <img src={expanded ? UpIcon : DownIcon} className='icon medium pad' />
            </div>
            <div className='tag_container'>
                {tags && tags.map((tag) => (
                    <div className={`tag ${tag.color} ${selectedTag && selectedTag.id === tag.id ? 'active' : ''}`} key={tag.id} onClick={() => selectTag(tag)}>
                        {tag.name}
                    </div>
                ))}
            </div>
            <div className='tag_settings'>
                            <div className='form'>
                            <div>
                                <p>name:</p> <input placeholder='abc' className='button fill lightgray' type='text' value={tagName} onChange={(event) => setTagName(event.currentTarget.value)} required />
                            </div>
                            
                            <div>
                                <p>color:</p>
                                <div>
                                    <select className='button fill lightgray' value={tagColor} onChange={event => setTagColor(event.currentTarget.value)}>
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
                            </div>
                            <div className='buttons'>
                            { props.assignable && 
                                <button className='button fill green' onClick={updateTag}>
                                    assign
                                </button>
                            }
                            <button className='button fill green inline' onClick={addTag}>
                            add
                            </button>
                            <button className='button fill blue' onClick={updateTag}>
                                update
                            </button>
                            <button className='button fill red' onClick={deleteTag}>
                                delete
                            </button>
                            <button className='button stroke red' onClick={deselectTag}>
                                cancel
                            </button>
                            </div>
                        </div>
            </div>
    )
}