import { MigrationInterface, QueryRunner } from "typeorm"

export class TemporaryCommentEntityDrop1700982692289 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('temporary_comment_entity')
    }

    public async down(): Promise<void> {
        // empty
    }

}
