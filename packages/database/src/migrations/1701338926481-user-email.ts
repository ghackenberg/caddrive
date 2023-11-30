import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class UserEmail1701338926481 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('user_entity', new TableColumn({ name: 'emailNotification', type: 'boolean', default: 1 }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user_entity', 'emailNotification')
    }

}
