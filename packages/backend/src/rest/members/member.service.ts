import { Member, MemberAddData, MemberUpdateData, MemberREST } from 'productboard-common'
import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import { InjectRepository } from '@nestjs/typeorm'
import { MemberEntity } from './member.entity'
import { Repository } from 'typeorm'
import { ProductEntity } from '../products/product.entity'
import { UserEntity } from '../users/user.entity'



@Injectable()
export class MemberService implements MemberREST {
    private static readonly members: Member[] = [
        { id: 'demo-1', userId: 'demo-1', productId: "demo-1", deleted: false},
        { id: 'demo-2', userId: 'demo-2', productId: "demo-2", deleted: false},
        { id: 'demo-3', userId: 'demo-4', productId: "demo-1", deleted: false},
        { id: 'demo-4', userId: 'demo-4', productId: "demo-2", deleted: false},
        { id: 'demo-5', userId: 'demo-2', productId: "demo-1", deleted: false},
        { id: 'demo-6', userId: 'demo-3', productId: "demo-1", deleted: false},
    ]
    
    public constructor(
        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository <MemberEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository <ProductEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository <UserEntity>,
    ) {
        this.memberRepository.count().then(async count => {
            if (count == 0) {
                for (const _member of MemberService.members) {
                    //await this.memberRepository.save(member)
                }
            }
        })
    }

    async findMembers(productId: string, userId?: string): Promise<Member[]> {
        const result: Member[] = []
        const where = userId ? { deleted: false, productId, userId } : { deleted: false, productId }
        for (const member of await this.memberRepository.find({ where })) {
            result.push({ id: member.id, deleted: member.deleted, productId: member.productId, userId: member.userId })
        }
        return result
    }

    async addMember(data: MemberAddData): Promise<Member> {
        const product = await this.productRepository.findOne(data.productId)
        if (!product) {
            throw new NotFoundException()
        }
        const user = await this.userRepository.findOne(data.userId)
        if (!user) {
            throw new NotFoundException()
        }
        const member = await this.memberRepository.save({ id: shortid(), deleted: false, product, user })
        return { id: member.id, deleted: member.deleted, productId: product.id, userId: user.id }
    }

    async getMember(id: string): Promise<Member> {
       const member = await this.memberRepository.findOne(id)
        if (member) {
            return { id: member.id, deleted: member.deleted, productId: member.productId, userId: member.userId }
        }
        throw new NotFoundException()
    }

    async updateMember(id: string, _data: MemberUpdateData): Promise<Member> {
        const member = await this.memberRepository.findOne(id)   
        if (member) {  
            await this.memberRepository.save(member)
            return { id: member.id, deleted: member.deleted, productId: member.productId, userId: member.userId }
        }
        throw new NotFoundException()
    }
    
    async deleteMember(id: string): Promise<Member> {
        const member = await this.memberRepository.findOne(id)   
        if (member) { 
            member.deleted = true 
            await this.memberRepository.save(member)
            return { id: member.id, deleted: member.deleted, productId: member.productId, userId: member.userId }
        }
        throw new NotFoundException()
    }
}