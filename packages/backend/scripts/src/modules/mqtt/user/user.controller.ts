import { Controller } from '@nestjs/common'

import { UserUpMQTT } from 'productboard-common'

@Controller()
export class UserController implements UserUpMQTT {

}