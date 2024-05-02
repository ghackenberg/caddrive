import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class IssueNumber1700659083590 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('issue_entity', new TableColumn({ name: 'number', type: 'int', default: 0, isNullable: false }))

        const issueCounts: {[productId: string]: number} = {}

        const issues = await queryRunner.query('select * from issue_entity order by created asc')

        for (const issue of issues) {
            const productId = issue.productId
            const issueId = issue.issueId
            if (!(productId in issueCounts)) {
                issueCounts[productId] = 0
            }
            issueCounts[productId]++
            await queryRunner.query('update issue_entity set number = ? where issueId = ?', [issueCounts[productId], issueId])
        }

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('issue_entity', 'number')
    }

}
