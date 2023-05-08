import * as React from 'react'

import { Tag } from 'productboard-common'

import { TagManager } from '../../managers/tag'
import { TagAssignmentManager } from '../../managers/tagAssignment'

import DownIcon from '/src/images/down.png'
import UpIcon from '/src/images/up.png'

export const TagView = (props: { tags: Tag[], productId: string, assignable: boolean, assignedTags?: Tag[], issueId?: string }) => {

    // PARAMS

    const productId = props.productId

    // STATES

    // - Entities
    const [tags, setTags] = React.useState<Tag[]>(props.tags)
    const [assignedTags, setAssignedTags] = React.useState<Tag[]>(props.assignedTags)
    // - Values
    const [tagName, setTagName] = React.useState<string>('new tag')
    const [tagColor, setTagColor] = React.useState<string>('blue')
    // - Interactions
    const [selectedTag, setSelectedTag] = React.useState<Tag>(null)
    const [expanded, setExpanded] = React.useState<boolean>(false)

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
        if (!tags.find(tag => tag.name === tagName)) {
            const tag = await TagManager.addTag({ productId: productId, color: tagColor, name: tagName || 'new tag' })
            setTags((prev) => [...prev, tag])
            setSelectedTag(tag)
        }
    }

    async function updateTag(event: React.FormEvent) {
        event.preventDefault()
        if (selectedTag) {
            const updatedData = ({ color: tagColor, name: tagName })
            await TagManager.updateTag(selectedTag.id, { ...selectedTag, ...updatedData })
            setTags((prev) => {
                return prev.map((tag) => {
                    return tag.id === selectedTag.id
                        ? { tag, ...selectedTag, ...updatedData }
                        : tag
                })
            })
            setAssignedTags((prev) => {
                return prev.map((tag) => {
                    return tag.id === selectedTag.id
                        ? { tag, ...selectedTag, ...updatedData }
                        : tag
                })
            })
        }
    }

    async function deleteTag(event: React.FormEvent) {
        event.preventDefault()
        if (selectedTag) {
            if (confirm('Do you really want to delete this tag?')) {
                await TagManager.deleteTag(selectedTag.id)
                setTags(tags.filter(other => other.id != selectedTag.id))
                setAssignedTags(assignedTags.filter(other => other.id != selectedTag.id))
                setSelectedTag(null)
                setTagColor('blue')
                setTagName('new tag')
            }
        }
    }
    async function assignTag(event: React.FormEvent) {
        event.preventDefault()
        if (selectedTag && !assignedTags.find(tag => tag.id === selectedTag.id)) {
            const assignment = await TagAssignmentManager.addTagAssignment({ tagId: selectedTag.id, issueId: props.issueId })
            setAssignedTags((prev) => [...prev, tags.find(tag => assignment.tagId === tag.id)])
        }
    }
    async function deassignTag(event: React.FormEvent) {
        event.preventDefault()
        if (selectedTag && assignedTags.includes(selectedTag)) {
            const assignment = await TagAssignmentManager.findTagAssignments(productId).then(assignments => assignments.find(assignment => assignment.tagId === selectedTag.id))
            await TagAssignmentManager.deleteTagAssignment(assignment.id)
            setAssignedTags(assignedTags.filter(other => other.id != selectedTag.id))
        }
    }

    return (
        <div className={`widget tag_view button fill lightgray ${expanded ? 'expanded' : 'collapsed'}`}>
            <div className='dropdown_toggle' onClick={toggleDropdown}>
                <img src={expanded ? UpIcon : DownIcon} className='icon medium pad' />
            </div>
            {props.assignable &&
                <div className='tag_container'>
                    <div>Assigned tags:</div>
                    {assignedTags && assignedTags.map((tag) => (
                        <div className={`tag ${tag.color} ${selectedTag && selectedTag.id === tag.id ? 'active' : ''}`} key={tag.id} onClick={() => selectTag(tag)}>
                            {tag.name}
                        </div>
                    ))}
                </div>
            }
            <div className='tag_container'>
                <div>All tags:</div>
                {tags && tags.map((tag) => (
                    <div className={`tag ${tag.color} ${selectedTag && selectedTag.id === tag.id ? 'active' : ''}`} key={tag.id} onClick={() => selectTag(tag)}>
                        {tag.name}
                    </div>
                ))}
            </div>
            <div className='tag_settings'>
                <div className='form'>
                    <div>
                        <p>name:</p> <input placeholder='name' className='button fill lightgray' type='text' value={tagName} onChange={(event) => setTagName(event.currentTarget.value)} required />
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
                    {props.assignable &&
                        <button className='button fill green' onClick={assignTag}>
                            assign
                        </button>
                    }
                    {props.assignable &&
                        <button className='button fill red' onClick={deassignTag}>
                            deassign
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