import * as React from 'react'

import LoadIcon from '/src/images/load.png'

//import { IssueManager } from '../../managers/issue'

import { useIssues } from '../../hooks/list'

//import { Issue } from 'productboard-common'

//import { IssueClient } from '../../clients/rest/issue'

export const TestWidget = (props: { productId: string, tagId: string[] }) => {

    // HOOKS

    //const [issues, setIssues] = React.useState<Issue[]>()
    
    //React.useEffect(() => {IssueManager.findIssues(props.productId, undefined, undefined, props.tagId, setIssues)}, [props])

    //React.useEffect(() => {IssueClient.findIssues(props.productId, undefined, undefined, props.tagId).then(setIssues)}, [props])

    const issues = useIssues(props.productId, undefined, undefined, props.tagId)

    // RETURN

    return (
        <>
            {issues ? issues.map((issue) => <div> {issue.name}</div>) : <img src={LoadIcon} className='icon medium pad animation spin' />}
        </>
    )
}
