import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class CommentClean1700657466514 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('comment_entity', 'audioId')
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('comment_entity', new TableColumn({ name: 'audioId', type: 'text', isNullable: true }))
    }
}
