import { Controller } from '@nestjs/common'

import { MemberUpMQTT } from 'productboard-common'

@Controller()
export class MemberController implements MemberUpMQTT {

}