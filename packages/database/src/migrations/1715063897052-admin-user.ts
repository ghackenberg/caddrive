import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AdminUser1715063897052 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("user_entity", new TableColumn({ name: 'admin', type: 'boolean', default: 0 }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user_entity", "admin")
    }

}
