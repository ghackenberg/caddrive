import { exit } from 'process'

import { Issue, Member, Milestone, Product, User, Version, Comment, Tag, TagAssignment } from 'productboard-common'
import { Database } from 'productboard-database'

const users: User[] = [
    { id: 'demo-1', consent: true, created: Date.now(), updated: null, deleted: null, name: 'Georg Hackenberg', email: 'georg.hackenberg@fh-wels.at', pictureId: 'demo-1'},
    { id: 'demo-2', consent: true, created: Date.now(), updated: null, deleted: null, name: 'Christian Zehetner', email: 'christian.zehetner@fh-wels.at', pictureId: 'demo-2' },
    { id: 'demo-4', consent: true, created: Date.now(), updated: null, deleted: null, name: 'Dominik Frühwirth', email: 'dominik.fruehwirth@fh-wels.at', pictureId: 'demo-4' }
]

const products: Product[] = [
    { id: 'demo-1', created: Date.now(), updated: null, deleted: null, userId: 'demo-1', name: 'Lego Buggy', description: 'The Lego Buggy is a toy for children and adults of all sizes.', public: true },
    { id: 'demo-2', created: Date.now(), updated: null, deleted: null, userId: 'demo-2', name: '2 Cylinder Engine', description: 'The 2 Cylinder Engine is a motor for applications of all sizes.', public: true },
    { id: 'demo-3', created: Date.now(), updated: null, deleted: null, userId: 'demo-4', name: 'testProduct1', description: 'test', public: true }
]

const members: Member[] = [
    { id: 'demo-1', created: Date.now(), updated: null, deleted: null, userId: 'demo-1', productId: "demo-1", role: 'manager'},
    { id: 'demo-2', created: Date.now(), updated: null, deleted: null, userId: 'demo-2', productId: "demo-2", role: 'manager'},
    { id: 'demo-3', created: Date.now(), updated: null, deleted: null, userId: 'demo-4', productId: "demo-1", role: 'manager'},
    { id: 'demo-4', created: Date.now(), updated: null, deleted: null, userId: 'demo-4', productId: "demo-2", role: 'manager'},
    { id: 'demo-5', created: Date.now(), updated: null, deleted: null, userId: 'demo-2', productId: "demo-1", role: 'manager'},
    { id: 'demo-6', created: Date.now(), updated: null, deleted: null, userId: 'demo-4', productId: "demo-3", role: 'manager'},
]

const versions: Version[] = [
    { id: 'demo-1', created: Date.now(), updated: null, deleted: null, userId: 'demo-1', productId: 'demo-1', baseVersionIds: [], major: 1, minor: 0, patch: 0, description: 'Platform design completed. Tank and engine installed.', modelType: 'glb', imageType: 'png' },
    { id: 'demo-2', created: Date.now(), updated: null, deleted: null, userId: 'demo-1', productId: 'demo-1', baseVersionIds: ['demo-1'], major: 1, minor: 1, patch: 0, description: 'Winter version of the vehicle. Lighting is installed and vehicle is heatable.', modelType: 'glb', imageType: 'png' },
    { id: 'demo-3', created: Date.now(), updated: null, deleted: null, userId: 'demo-2', productId: 'demo-1', baseVersionIds: ['demo-1'], major: 1, minor: 2, patch: 0, description: 'Summer version of the vehicle. Air conditioning, electric windows and convertible roof installed.', modelType: 'glb', imageType: 'png' },
    { id: 'demo-4', created: Date.now(), updated: null, deleted: null, userId: 'demo-2', productId: 'demo-2', baseVersionIds: [], major: 1, minor: 0, patch: 0, description: 'Initial commit.', modelType: 'glb', imageType: 'png' }
]

const milestones: Milestone[] = [
    { id: 'demo-1', created: Date.now(), updated: null, deleted: null, userId: 'demo-1', productId: 'demo-1', label: 'Sprint 1', start: new Date('2022-04-11').getTime(), end: new Date('2022-04-22').getTime()},
    { id: 'demo-2', created: Date.now(), updated: null, deleted: null, userId: 'demo-4', productId: 'demo-1', label: 'Sprint 2', start: new Date(new Date().setHours(0,0,0,0)).getTime(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).getTime()},
    { id: 'demo-3', created: Date.now(), updated: null, deleted: null, userId: 'demo-4', productId: 'demo-1', label: 'Sprint 3', start: new Date(new Date().setHours(0,0,0,0)).getTime(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).getTime()},
    { id: 'demo-4', created: Date.now(), updated: null, deleted: null, userId: 'demo-2', productId: 'demo-1', label: 'Sprint 4', start: new Date(new Date().setHours(0,0,0,0)).getTime(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).getTime()},
    { id: 'demo-5', created: Date.now(), updated: null, deleted: null, userId: 'demo-4', productId: 'demo-1', label: 'Sprint 5', start: new Date(new Date().setHours(0,0,0,0)).getTime(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).getTime()}
]

const issues: Issue[] = [
    { id: 'demo-1', created: Date.now(), updated: null, deleted: null, userId: 'demo-1', productId: 'demo-1', parentIssueId: 'demo1', stateId: 'demo1', issueTypeId: 'demo1', audioId: null, storypoints: null, progress: null, priority: 'High', name: 'Design vehicle that can be used in summer and winter.', description: '**Description**\n\n* In winter, the vehicle has to deal with cold temperatures and icy roads.\n* In summer, the vehicle has to deal with warm temperatures, rain, and mud.\n\n**Validation**\n\nWe plan to conduct test drives under winter and summer conditions to validate the product design.', state: 'open', assigneeIds: ['demo-4', 'demo-2'], milestoneId: 'demo-1' },
    { id: 'demo-2', created: Date.now(), updated: null, deleted: null, userId: 'demo-2', productId: 'demo-1', parentIssueId: 'demo1', stateId: 'demo1', issueTypeId: 'demo1', audioId: null, storypoints: null, progress: null, priority: 'High', name: 'Use different wheel profile in winter version.', description: 'Please change the wheel profile (see [body_115_instance_2](/products/demo-1/versions/demo-3/objects/body_115_instance_2)). We need a stronger profile to handle winter conditions properly.', state: 'open' ,assigneeIds: ['demo-4'], milestoneId: 'demo-1' },
    { id: 'demo-3', created: Date.now(), updated: null, deleted: null, userId: 'demo-4', productId: 'demo-1', parentIssueId: 'demo1', stateId: 'demo1', issueTypeId: 'demo1', audioId: null, storypoints: null, progress: null, priority: 'High', name: 'Use blue helmet for driver.', description: 'Please change the helmet color (see [technic_driver_helmet_p_SOLIDS_1_1](/products/demo-1/versions/demo-3/objects/technic_driver_helmet_p_SOLIDS_1_1)). We want a blue helmet because it fits better to our corporate design standards.', state: 'open' ,assigneeIds: ['demo-2'], milestoneId: 'demo-1' },
    { id: 'demo-4', created: Date.now(), updated: null, deleted: null, userId: 'demo-4', productId: 'demo-1', parentIssueId: 'demo1', stateId: 'demo1', issueTypeId: 'demo1', audioId: null, storypoints: null, progress: null, priority: 'High', name: 'Install car radio for music.', description: 'Please install a car radio, so the driver can listen to music and news.', state: 'closed' ,assigneeIds: ['demo-1', 'demo-2'], milestoneId: 'demo-1' },
    { id: 'demo-5', created: Date.now(), updated: null, deleted: null, userId: 'demo-4', productId: 'demo-1', parentIssueId: 'demo1', stateId: 'demo1', issueTypeId: 'demo1', audioId: null, storypoints: null, progress: null, priority: 'High', name: 'Provide a possibility to mount a roof.', description: 'Please provide a mount to give possibility to hang up a roof in rainy days', state: 'closed' ,assigneeIds: ['demo-1'], milestoneId: 'demo-1' },
    { id: 'demo-6', created: Date.now(), updated: null, deleted: null, userId: 'demo-1', productId: 'demo-1', parentIssueId: 'demo1', stateId: 'demo1', issueTypeId: 'demo1', audioId: null, storypoints: null, progress: null, priority: 'High', name: 'Install seat belt for driver.', description: 'Please install a seat belt for safety', state: 'closed' ,assigneeIds: ['demo-2', 'demo-4'], milestoneId: 'demo-1' },
    { id: 'demo-7', created: Date.now(), updated: null, deleted: null, userId: 'demo-2', productId: 'demo-1', parentIssueId: 'demo1', stateId: 'demo1', issueTypeId: 'demo1', audioId: null, storypoints: null, progress: null, priority: 'High', name: 'Add frontlight and backlight.', description: 'Please provide frontlights and backlights for driving in the dark', state: 'open' ,assigneeIds: ['demo-1', 'demo-4'], milestoneId: 'demo-1' },
 ]

const comments: Comment[] = [
    { id: 'demo-1', created: Date.now(), updated: null, deleted: null, userId: 'demo-1', issueId: 'demo-2', audioId: null, text: 'Ok, can you provide a profile specification?', action: 'close' },
    { id: 'demo-2', created: Date.now(), updated: null, deleted: null, userId: 'demo-1', issueId: 'demo-3', audioId: null, text: 'Ok, can you provide a RAL code?', action: 'none' },
    { id: 'demo-3', created: Date.now(), updated: null, deleted: null, userId: 'demo-2', issueId: 'demo-3', audioId: null, text: 'I will search for a RAL code', action: 'close' },
    { id: 'demo-4', created: Date.now(), updated: null, deleted: null, userId: 'demo-2', issueId: 'demo-1', audioId: null, text: 'Done', action: 'close' },
    { id: 'demo-5', created: Date.now(), updated: null, deleted: null, userId: 'demo-2', issueId: 'demo-4', audioId: null, text: 'Done', action: 'close' },
    { id: 'demo-6', created: Date.now(), updated: null, deleted: null, userId: 'demo-1', issueId: 'demo-5', audioId: null, text: 'Done', action: 'close' },
    { id: 'demo-7', created: Date.now(), updated: null, deleted: null, userId: 'demo-4', issueId: 'demo-6', audioId: null, text: 'Done', action: 'close' },
    { id: 'demo-8', created: Date.now(), updated: null, deleted: null, userId: 'demo-4', issueId: 'demo-7', audioId: null, text: 'Work in progress', action: 'none' },
]

const tags: Tag[] = [
    { id: 'demo-1', created: Date.now(), updated: null, deleted: null,  productId: 'demo-1', name: 'roof', color: 'brown' },
    { id: 'demo-2', created: Date.now(), updated: null, deleted: null,  productId: 'demo-1', name: 'wheels', color: 'orange' },
    { id: 'demo-3', created: Date.now(), updated: null, deleted: null,  productId: 'demo-1', name: 'safety', color: 'yellow' },
    { id: 'demo-4', created: Date.now(), updated: null, deleted: null,  productId: 'demo-1', name: 'entertainment', color: 'green' },
    { id: 'demo-5', created: Date.now(), updated: null, deleted: null,  productId: 'demo-1', name: 'motor', color: 'blue' },
    { id: 'demo-6', created: Date.now(), updated: null, deleted: null,  productId: 'demo-1', name: 'comfort', color: 'purple' },
    { id: 'demo-7', created: Date.now(), updated: null, deleted: null,  productId: 'demo-1', name: 'breaks', color: 'pink' },
    { id: 'demo-8', created: Date.now(), updated: null, deleted: null,  productId: 'demo-1', name: 'design', color: 'red' },
]

const tagAssignments: TagAssignment[] = [
    { id: 'demo-1', issueId: 'demo-1', tagId: 'demo-1', created: Date.now(), updated: null, deleted: null },
    { id: 'demo-2', issueId: 'demo-2', tagId: 'demo-1', created: Date.now(), updated: null, deleted: null },
    { id: 'demo-3', issueId: 'demo-2', tagId: 'demo-2', created: Date.now(), updated: null, deleted: null },
    { id: 'demo-4', issueId: 'demo-2', tagId: 'demo-3', created: Date.now(), updated: null, deleted: null },
]

// async function drop() {
//     await Database.init()
//     console.log('Drop: Connected')
    
//     await Database.get().dataSource.dropDatabase()
//     console.log('Drop: Database dropped')

//     await Database.get().dataSource.destroy()  
//     console.log('Drop: Disconnected')
// }

async function fill() {
    await Database.init()
    console.log('Fill: Connected')

    if (await Database.get().userRepository.count() == 0) {
        for (const user of users) {
            await Database.get().userRepository.save(user)
        }
        console.log('Fill: Users filled')
    }

    if (await Database.get().productRepository.count() == 0) {
        for (const product of products) {
            await Database.get().productRepository.save(product)
        }
        console.log('Fill: Products filled')
    }

    if (await Database.get().memberRepository.count() == 0) {
        for (const member of members) {
            await Database.get().memberRepository.save(member)
        }
        console.log('Fill: Members filled')
    }

    if (await Database.get().versionRepository.count() == 0) {
        for (const version of versions) {
            await Database.get().versionRepository.save(version)
        }
        console.log('Fill: Versions filled')
    }

    if (await Database.get().milestoneRepository.count() == 0) {
        for (const milestone of milestones) {
            await Database.get().milestoneRepository.save(milestone)
        }
        console.log('Fill: Milestones filled')
    }

    if (await Database.get().issueRepository.count() == 0) {
        for (const issue of issues) {
            await Database.get().issueRepository.save(issue)
        }
        console.log('Fill: Issues filled')
    }

    if (await Database.get().commentRepository.count() == 0) {
        for (const comment of comments) {
            await Database.get().commentRepository.save(comment)
        }
        console.log('Fill: Comments filled')
    }

    if (await Database.get().tagRepository.count() == 0) {
        for (const tag of tags) {
            await Database.get().tagRepository.save(tag)
        }
        console.log('Fill: Tags filled')
    }

    if (await Database.get().tagAssignmentRepository.count() == 0) {
        for (const tagAssignment of tagAssignments) {
            await Database.get().tagAssignmentRepository.save(tagAssignment)
        }
        console.log('Fill: Tags filled')
    }
    console.log('Fill: All Entities filled')

    await Database.get().dataSource.destroy()  
    console.log('Fill: Disconnected')
}
async function main() {
    console.log('Reset Database')
    //await drop()
    await fill()
    console.log('All Tasks finished')
    console.log('Exit')
    exit()
}

main()