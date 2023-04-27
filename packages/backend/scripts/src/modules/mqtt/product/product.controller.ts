import { Controller } from '@nestjs/common'

import { ProductUpMQTT } from 'productboard-common'

@Controller()
export class ProductController implements ProductUpMQTT {

}