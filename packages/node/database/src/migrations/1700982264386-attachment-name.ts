import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AttachmentName1700982264386 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('attachment_entity', new TableColumn({ name: 'name', type: 'text', isNullable: true }))

        for (const attachment of await queryRunner.query('select * from attachment_entity')) {
            let name: string
            if (attachment.type == 'image/png') {
                name = 'image.png'
            } else if (attachment.type == 'application/pdf') {
                name = 'document.pdf'
            } else {
                throw `attachment type not supported: ${attachment.type}`
            }
            await queryRunner.query('update attachment_entity set name = ? where attachmentId = ?', [name, attachment.attachmentId])
        }

        await queryRunner.changeColumn('attachment_entity', 'name', new TableColumn({ name: 'name', type: 'text', isNullable: false }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('attachment_entity', 'name')
    }

}
