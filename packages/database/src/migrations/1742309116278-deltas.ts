import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Deltas1742309116278 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('version_entity', new TableColumn({ name: 'deltaType', type: 'text', isNullable: true }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('version_entity', 'deltaType')
    }

}
