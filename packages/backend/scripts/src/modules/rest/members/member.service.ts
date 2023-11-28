import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import { getTestMessageUrl } from 'nodemailer'
import shortid from 'shortid'
import { IsNull } from 'typeorm'

import { Member, MemberAddData, MemberUpdateData, MemberREST, Product } from 'productboard-common'
import { Database, convertMember } from 'productboard-database'

import { emitProductMessage } from '../../../functions/emit'
import { TRANSPORTER } from '../../../functions/mail'
import { AuthorizedRequest } from '../../../request'

@Injectable()
export class MemberService implements MemberREST {
    constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    async findMembers(productId: string): Promise<Member[]> {
        const where = { productId, deleted: IsNull() }
        const result: Member[] = []
        for (const member of await Database.get().memberRepository.findBy(where))
            result.push(convertMember(member))
        return result
    }

    async addMember(productId: string, data: MemberAddData): Promise<Member> {
        // Create member
        const memberId = shortid()
        const created = Date.now()
        const updated = created
        const member = await Database.get().memberRepository.save({ productId, memberId, created, updated, ...data })
        // Update product
        const product = await Database.get().productRepository.findOneBy({ productId })
        product.updated = member.updated
        await Database.get().productRepository.save(product)
        // Emit changes
        emitProductMessage(productId, { type: 'patch', products: [product], members: [member] })
        // Notify changes
        this.notifyAddMember(product, member)
        // Return member
        return convertMember(member)
    }

    async notifyAddMember(product: Product, member: Member) {
        const user = await Database.get().userRepository.findOneBy({ userId: member.userId, deleted: IsNull() })
        const transporter = await TRANSPORTER
        const info = await transporter.sendMail({
            from: 'CADdrive <mail@caddrive.com>',
            to: user.email,
            subject: 'Member notification',
            templateName: 'member',
            templateData: {
                user: this.request.user,
                date: new Date(member.created).toDateString(),
                product,
                member,
                link: `https://caddrive.com/products/${product.productId}`
            }
        })
        console.log(getTestMessageUrl(info))
    }

    async getMember(productId: string, memberId: string): Promise<Member> {
       const member = await Database.get().memberRepository.findOneByOrFail({ productId, memberId })
        return convertMember(member)
    }

    async updateMember(productId: string, memberId: string, data: MemberUpdateData): Promise<Member> {
        // Update member
        const member = await Database.get().memberRepository.findOneByOrFail({ productId, memberId })
        member.updated = Date.now()
        member.role = data.role
        await Database.get().memberRepository.save(member)
        // Update product
        const product = await Database.get().productRepository.findOneBy({ productId })
        product.updated = member.updated
        await Database.get().productRepository.save(product)
        // Emit changes
        emitProductMessage(productId, { type: 'patch', products: [product], members: [member] })
        // Return member
        return convertMember(member)
    }
    
    async deleteMember(productId: string, memberId: string): Promise<Member> {
        // Update member
        const member = await Database.get().memberRepository.findOneByOrFail({ productId, memberId })
        member.deleted = Date.now()
        member.updated = member.deleted
        await Database.get().memberRepository.save(member)
        // Update product
        const product = await Database.get().productRepository.findOneBy({ productId })
        product.updated = member.updated
        await Database.get().productRepository.save(product)
        // Emit changes
        emitProductMessage(productId, { type: 'patch', products: [product], members: [member] })
        // Return member
        return convertMember(member)
    }
}