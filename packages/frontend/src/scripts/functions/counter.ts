import { Comment, Issue } from 'productboard-common' 
import { Part } from './markdown'



export function countParts(issues: Issue[], comments: {[id: string]: Comment[]}, issueParts: { [id: string]: Part[] }, commentParts: { [id: string]: Part[] }) {
    const partsCountNew: {[id: string]: number} = {}
    for(const issue of issues || []) {
        if(issue.id in issueParts || {} && issueParts[issue.id]) {
            partsCountNew[issue.id] = issueParts[issue.id].length
            if (issue.id in comments || {} && comments[issue.id]) {
                for ( const comment of comments[issue.id] || []) {
                    if(comment.id in commentParts || {} && commentParts[comment.id]) {
                        partsCountNew[issue.id] += commentParts[comment.id].length
                    }
                }
            }  
        }
    }
    return partsCountNew
}
