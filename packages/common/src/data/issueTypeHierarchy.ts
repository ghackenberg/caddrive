import { ApiProperty } from '@nestjs/swagger'

export class IssueTypeHierarchyUpdateData {
    @ApiProperty()
    parentIssueId: string
    @ApiProperty()
    childIssueId: string
}

export class IssueTypeHierarchyAddData extends IssueTypeHierarchyUpdateData {
    
}

export class IssueTypeHierarchy extends IssueTypeHierarchyAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}