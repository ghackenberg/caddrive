import { Member, MemberAddData, MemberUpdateData, MemberREST } from 'productboard-common'
import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import { InjectRepository } from '@nestjs/typeorm'
import { MemberEntity } from './member.entity'
import { Repository } from 'typeorm'



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
        private readonly memberRepository: Repository <MemberEntity>
    ) {
        this.memberRepository.count().then(async count => {
            if (count == 0) {
                for (const member of MemberService.members) {
                    await this.memberRepository.save(member)
                }
            }
        })
    }

    async findMembers(productId: string, userId?: string): Promise<Member[]> {
        const result: Member[] = []
        const options = userId ? { deleted: false, productId: productId } : { deleted: false, productId: productId }
        for (const member of await this.memberRepository.find(options)) {
            result.push(member)
        }
        return result
    }

    async addMember(data: MemberAddData): Promise<Member> {
        // TODO check if user exists
        // TODO check if product exists
        const member = { id: shortid(), deleted: false, ...data }
        return this.memberRepository.save(member)
    }

    async getMember(id: string): Promise<Member> {
       const member = await this.memberRepository.findOne(id)
        if (member) {
            return member
        }
        throw new NotFoundException()
    }

    async updateMember(id: string, _data: MemberUpdateData): Promise<Member> {
        const member = await this.memberRepository.findOne(id)   
        if (member) {  
            return this.memberRepository.save(member)
        }
        throw new NotFoundException()
    }
    
    async deleteMember(id: string): Promise<Member> {
        const member = await this.memberRepository.findOne(id)   
        if (member) { 
            member.deleted = true 
            return this.memberRepository.save(member)
        }
        throw new NotFoundException()
    }
}