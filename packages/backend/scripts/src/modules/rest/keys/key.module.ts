import { Module } from "@nestjs/common"

import { KeyController } from "./key.controller"
import { KeyService } from "./key.service"

@Module({
    controllers: [KeyController],
    providers: [KeyService]
})
export class KeyModule {}