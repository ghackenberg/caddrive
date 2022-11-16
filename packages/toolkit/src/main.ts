import * as hash from 'hash.js'
import { Comment, Issue, Member, Milestone, Product, User, Version } from 'productboard-common'
import { AppDataSource, CommentRepository, IssueRepository, MemberRepository, MilestoneRepository, ProductRepository, UserRepository, VersionRepository } from 'productboard-database'

const users: User[] = [
    { id: 'demo-1', name: 'Georg Hackenberg', email: 'georg.hackenberg@fh-wels.at', password: hash.sha256().update('test').digest('hex'), pictureId: 'demo-1', userManagementPermission: true, productManagementPermission: true, deleted: false},
    { id: 'demo-2', name: 'Christian Zehetner', email: 'christian.zehetner@fh-wels.at', password: hash.sha256().update('test').digest('hex'), pictureId: 'demo-2', userManagementPermission: true, productManagementPermission: true, deleted: false },
    { id: 'demo-4', name: 'Dominik Frühwirth', email: 'dominik.fruehwirth@fh-wels.at', password: hash.sha256().update('test').digest('hex'), pictureId: 'demo-4', userManagementPermission: true, productManagementPermission: true, deleted: false }
]

const products: Product[] = [
    { id: 'demo-1', userId: 'demo-1', name: 'Lego Buggy', description: 'The Lego Buggy is a toy for children and adults of all sizes.', deleted: false },
    { id: 'demo-2', userId: 'demo-2', name: '2 Cylinder Engine', description: 'The 2 Cylinder Engine is a motor for applications of all sizes.', deleted: false }
]

const members: Member[] = [
    { id: 'demo-1', userId: 'demo-1', productId: "demo-1", deleted: false, role: 'manager'},
    { id: 'demo-2', userId: 'demo-2', productId: "demo-2", deleted: false, role: 'manager'},
    { id: 'demo-3', userId: 'demo-4', productId: "demo-1", deleted: false, role: 'manager'},
    { id: 'demo-4', userId: 'demo-4', productId: "demo-2", deleted: false, role: 'manager'},
    { id: 'demo-5', userId: 'demo-2', productId: "demo-1", deleted: false, role: 'manager'},
]

const versions: Version[] = [
    { id: 'demo-1', userId: 'demo-1', productId: 'demo-1', baseVersionIds: [], time: new Date().toISOString(), major: 1, minor: 0, patch: 0, description: 'Platform design completed. Tank and engine installed.', deleted: false },
    { id: 'demo-2', userId: 'demo-1', productId: 'demo-1', baseVersionIds: ['demo-1'], time: new Date().toISOString(), major: 1, minor: 1, patch: 0, description: 'Winter version of the vehicle. Lighting is installed and vehicle is heatable.', deleted: false },
    { id: 'demo-3', userId: 'demo-2', productId: 'demo-1', baseVersionIds: ['demo-1'], time: new Date().toISOString(), major: 1, minor: 2, patch: 0, description: 'Summer version of the vehicle. Air conditioning, electric windows and convertible roof installed.', deleted: false },
    { id: 'demo-4', userId: 'demo-2', productId: 'demo-2', baseVersionIds: [], time: new Date().toISOString(), major: 1, minor: 0, patch: 0, description: 'Initial commit.', deleted: false }
]

const milestones: Milestone[] = [
    { id: 'demo-1', userId: 'demo-1', productId: 'demo-1', label: 'Sprint 1', start: new Date('2022-04-11').toISOString(), end: new Date('2022-04-22').toISOString(), deleted: false},
    { id: 'demo-2', userId: 'demo-4', productId: 'demo-1', label: 'Sprint 2', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false},
    { id: 'demo-3', userId: 'demo-4', productId: 'demo-1', label: 'Sprint 3', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false},
    { id: 'demo-4', userId: 'demo-2', productId: 'demo-1', label: 'Sprint 4', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false},
    { id: 'demo-5', userId: 'demo-4', productId: 'demo-1', label: 'Sprint 5', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false}
]

const issues: Issue[] = [
    { id: 'demo-1', userId: 'demo-1', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Design vehicle that can be used in summer and winter.', text: '**Description**\n\n* In winter, the vehicle has to deal with cold temperatures and icy roads.\n* In summer, the vehicle has to deal with warm temperatures, rain, and mud.\n\n**Validation**\n\nWe plan to conduct test drives under winter and summer conditions to validate the product design.', state: 'closed', deleted: false, assigneeIds: ['demo-4', 'demo-2'], milestoneId: 'demo-1' },
    { id: 'demo-2', userId: 'demo-2', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Use different wheel profile in winter version.', text: 'Please change the wheel profile (see [body_115_instance_2](/products/demo-1/versions/demo-3/objects/body_115_instance_2)). We need a stronger profile to handle winter conditions properly.', state: 'closed', deleted: false ,assigneeIds: ['demo-4'], milestoneId: 'demo-1' },
    { id: 'demo-3', userId: 'demo-4', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Use blue helmet for driver.', text: 'Please change the helmet color (see [technic_driver_helmet_p_SOLIDS_1_1](/products/demo-1/versions/demo-3/objects/technic_driver_helmet_p_SOLIDS_1_1)). We want a blue helmet because it fits better to our corporate design standards.', state: 'closed', deleted: false ,assigneeIds: ['demo-2'], milestoneId: 'demo-1' },
    { id: 'demo-4', userId: 'demo-4', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Install car radio for music.', text: 'Please install a car radio, so the driver can listen to music and news.', state: 'closed', deleted: false ,assigneeIds: ['demo-1', 'demo-2'], milestoneId: 'demo-1' },
    { id: 'demo-5', userId: 'demo-4', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Provide a possibility to mount a roof.', text: 'Please provide a mount to give possibility to hang up a roof in rainy days', state: 'closed', deleted: false ,assigneeIds: ['demo-1'], milestoneId: 'demo-1' },
    { id: 'demo-6', userId: 'demo-1', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Install seat belt for driver.', text: 'Please install a seat belt for safety', state: 'closed', deleted: false ,assigneeIds: ['demo-2', 'demo-4'], milestoneId: 'demo-1' },
    { id: 'demo-7', userId: 'demo-2', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Add frontlight and backlight.', text: 'Please provide frontlights and backlights for driving in the dark', state: 'open', deleted: false ,assigneeIds: ['demo-1', 'demo-4'], milestoneId: 'demo-1' },
]

const comments: Comment[] = [
    { id: 'demo-1', userId: 'demo-1', issueId: 'demo-2', time: new Date('2022-04-12').toISOString(), text: 'Ok, can you provide a profile specification?', action: 'close', deleted: false },
    { id: 'demo-2', userId: 'demo-1', issueId: 'demo-3', time: new Date('2022-04-13').toISOString(), text: 'Ok, can you provide a RAL code?', action: 'none', deleted: false },
    { id: 'demo-3', userId: 'demo-2', issueId: 'demo-3', time: new Date('2022-04-14').toISOString(), text: 'I will search for a RAL code', action: 'close', deleted: false },
    { id: 'demo-4', userId: 'demo-2', issueId: 'demo-1', time: new Date('2022-04-15').toISOString(), text: 'Done', action: 'close', deleted: false },
    { id: 'demo-5', userId: 'demo-2', issueId: 'demo-4', time: new Date('2022-04-17').toISOString(), text: 'Done', action: 'close', deleted: false },
    { id: 'demo-6', userId: 'demo-1', issueId: 'demo-5', time: new Date('2022-04-20').toISOString(), text: 'Done', action: 'close', deleted: false },
    { id: 'demo-7', userId: 'demo-4', issueId: 'demo-6', time: new Date('2022-04-21').toISOString(), text: 'Done', action: 'close', deleted: false },
    { id: 'demo-8', userId: 'demo-4', issueId: 'demo-7', time: new Date('2022-04-22').toISOString(), text: 'Work in progress', action: 'none', deleted: false },
]

async function main() {
    await AppDataSource.initialize()

    if (await UserRepository.count() == 0) {
        for (const user of users) {
            await UserRepository.save(user)
        }
    }

    if (await ProductRepository.count() == 0) {
        for (const product of products) {
            await ProductRepository.save(product)
        }
    }

    if (await MemberRepository.count() == 0) {
        for (const member of members) {
            await MemberRepository.save(member)
        }
    }

    if (await VersionRepository.count() == 0) {
        for (const version of versions) {
            await VersionRepository.save(version)
        }
    }

    if (await MilestoneRepository.count() == 0) {
        for (const milestone of milestones) {
            await MilestoneRepository.save(milestone)
        }
    }

    if (await IssueRepository.count() == 0) {
        for (const issue of issues) {
            await IssueRepository.save(issue)
        }
    }

    if (await CommentRepository.count() == 0) {
        for (const comment of comments) {
            await CommentRepository.save(comment)
        }
    }
}

main()