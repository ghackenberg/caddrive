import { Member, MemberData, MemberREST } from 'productboard-common'

export class MemberService implements MemberREST {
    findMembers(_productId: string): Promise<Member[]> {
        throw new Error('Method not implemented.');
    }
    addMember(_data: MemberData): Promise<Member> {
        throw new Error('Method not implemented.');
    }
    getMember(_id: string): Promise<Member> {
        throw new Error('Method not implemented.');
    }
    updateMember(_id: string, _data: MemberData): Promise<Member> {
        throw new Error('Method not implemented.');
    }
    deleteMember(_id: string): Promise<Member> {
        throw new Error('Method not implemented.');
    }

}