import { Navigate, Route, Routes } from 'react-router'
import { ProductHeader } from '../snippets/ProductHeader.js'
import { ProductIssueView } from '../views/ProductIssue.js'
import { ProductIssueCommentView } from '../views/ProductIssueComment.js'
import { ProductIssueSettingView } from '../views/ProductIssueSetting.js'
import { ProductMemberView } from '../views/ProductMember.js'
import { ProductMemberSettingView } from '../views/ProductMemberSetting.js'
import { ProductMilestoneView } from '../views/ProductMilestone.js'
import { ProductMilestoneIssueView } from '../views/ProductMilestoneIssue.js'
import { ProductMilestoneIssueCommentView } from '../views/ProductMilestoneIssueComment.js'
import { ProductMilestoneIssueSettingView } from '../views/ProductMilestoneIssueSetting.js'
import { ProductMilestoneSettingView } from '../views/ProductMilestoneSetting.js'
import { ProductSettingView } from '../views/ProductSetting.js'
import { ProductVersionView } from '../views/ProductVersion.js'
import { ProductVersionEditorView } from '../views/ProductVersionEditor.js'
import { ProductVersionSettingView } from '../views/ProductVersionSetting.js'

const ProductRouter = () => {
    // TODO Include version 3D visualization and milestone chart visualization here. Switch based on context.
    return (
        <>
            <ProductHeader/>
            <Routes>
                <Route path="/products/:productId/settings" element={<ProductSettingView/>}/>

                <Route path="/products/:productId/members/:memberId/settings" element={<ProductMemberSettingView/>}/>
                <Route path="/products/:productId/members/:memberId" element={<Navigate replace to="/products/:productId/members/:memberId/settings"/>}/>
                <Route path="/products/:productId/members" element={<ProductMemberView/>}/>

                <Route path="/products/:productId/milestones/:milestoneId/issues/:issueId/comments" element={<ProductMilestoneIssueCommentView/>}/>
                <Route path="/products/:productId/milestones/:milestoneId/issues/:issueId/settings" element={<ProductMilestoneIssueSettingView/>}/>
                <Route path="/products/:productId/milestones/:milestoneId/issues" element={<ProductMilestoneIssueView/>}/>
                <Route path="/products/:productId/milestones/:milestoneId/settings" element={<ProductMilestoneSettingView/>}/>
                <Route path="/products/:productId/milestones/:milestoneId" element={<Navigate replace to="/products/:productId/milestones/:milestoneId/issues"/>}/>
                <Route path="/products/:productId/milestones" element={<ProductMilestoneView/>}/>
                
                <Route path="/products/:productId/issues/:issueId/comments" element={<ProductIssueCommentView/>}/>
                <Route path="/products/:productId/issues/:issueId/settings" element={<ProductIssueSettingView/>}/>
                <Route path="/products/:productId/issues/:issueId" element={<Navigate replace to="/products/:productId/issues/:issueId/comments"/>}/>
                <Route path="/products/:productId/issues" element={<ProductIssueView/>}/>

                <Route path="/products/:productId/versions/:versionId/editor" element={<ProductVersionEditorView/>}/>
                <Route path="/products/:productId/versions/:versionId/settings" element={<ProductVersionSettingView/>}/>
                <Route path="/products/:productId/versions/:versionId" element={<Navigate replace to="/products/:productId/versions/:versionId/settings"/>}/>
                <Route path="/products/:productId/versions" element={<ProductVersionView/>}/>
                <Route path="/products/:productId" element={<Navigate replace to="/products/:productId/versions"/>}/>
            </Routes>
        </>
    )
}

export default ProductRouter