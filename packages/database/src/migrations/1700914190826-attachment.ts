import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm"

export class Attachment1700914190826 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'attachment_entity',
            columns: [
                new TableColumn({ name: 'productId', type: 'text', isNullable: false }),
                new TableColumn({ name: 'attachmentId', type: 'text', isNullable: false, isPrimary: true }),
                new TableColumn({ name: 'userId', type: 'text', isNullable: false }),
                new TableColumn({ name: 'created', type: 'int', isNullable: false }),
                new TableColumn({ name: 'updated', type: 'int', isNullable: false }),
                new TableColumn({ name: 'deleted', type: 'int', isNullable: true }),
                new TableColumn({ name: 'type', type: 'string', isNullable: false })
            ],
            foreignKeys: [
                { columnNames: ['productId'], referencedTableName: 'product_entity', referencedColumnNames: ['productId'] },
                { columnNames: ['userId'], referencedTableName: 'user_entity', referencedColumnNames: ['userId'] }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('attachment_entity')
    }

}
