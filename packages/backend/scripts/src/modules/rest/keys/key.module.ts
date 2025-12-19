import { Module } from "@nestjs/common"
import { KeyController } from "./key.controller.js"
import { KeyService } from "./key.service.js"

@Module({
    controllers: [KeyController],
    providers: [KeyService]
})
export class KeyModule {}