import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm"

export class Attachment1700914190826 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'attachment_entity',
            columns: [
                new TableColumn({ name: 'productId', type: 'text', isNullable: false }),
                new TableColumn({ name: 'issueId', type: 'text', isNullable: false }),
                new TableColumn({ name: 'commentId', type: 'text', isNullable: false }),
                new TableColumn({ name: 'attachmentId', type: 'text', isNullable: false, isPrimary: true }),
                new TableColumn({ name: 'created', type: 'int', isNullable: false }),
                new TableColumn({ name: 'updated', type: 'int', isNullable: false }),
                new TableColumn({ name: 'deleted', type: 'int', isNullable: true }),
                new TableColumn({ name: 'name', type: 'string', isNullable: false }),
                new TableColumn({ name: 'type', type: 'string', isNullable: false })
            ],
            foreignKeys: [
                { columnNames: ['productId'], referencedTableName: 'product_entity', referencedColumnNames: ['productId'] },
                { columnNames: ['issueId'], referencedTableName: 'issue_entity', referencedColumnNames: ['issueId'] },
                { columnNames: ['commentId'], referencedTableName: 'comment_entity', referencedColumnNames: ['commentId'] }
            ],
            uniques: [
                { columnNames: ['attachmentId', 'name'] }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('attachment_entity')
    }

}
