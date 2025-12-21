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
                <Route path="/settings" element={<ProductSettingView/>}/>

                <Route path="/members/:memberId/settings" element={<ProductMemberSettingView/>}/>
                <Route path="/members/:memberId" element={<Navigate replace to="/products/:productId/members/:memberId/settings"/>}/>
                <Route path="/members" element={<ProductMemberView/>}/>

                <Route path="/milestones/:milestoneId/issues/:issueId/comments" element={<ProductMilestoneIssueCommentView/>}/>
                <Route path="/milestones/:milestoneId/issues/:issueId/settings" element={<ProductMilestoneIssueSettingView/>}/>
                <Route path="/milestones/:milestoneId/issues" element={<ProductMilestoneIssueView/>}/>
                <Route path="/milestones/:milestoneId/settings" element={<ProductMilestoneSettingView/>}/>
                <Route path="/milestones/:milestoneId" element={<Navigate replace to="/products/:productId/milestones/:milestoneId/issues"/>}/>
                <Route path="/milestones" element={<ProductMilestoneView/>}/>
                
                <Route path="/issues/:issueId/comments" element={<ProductIssueCommentView/>}/>
                <Route path="/issues/:issueId/settings" element={<ProductIssueSettingView/>}/>
                <Route path="/issues/:issueId" element={<Navigate replace to="/products/:productId/issues/:issueId/comments"/>}/>
                <Route path="/issues" element={<ProductIssueView/>}/>

                <Route path="/versions/:versionId/editor" element={<ProductVersionEditorView/>}/>
                <Route path="/versions/:versionId/settings" element={<ProductVersionSettingView/>}/>
                <Route path="/versions/:versionId" element={<Navigate replace to="/products/:productId/versions/:versionId/settings"/>}/>
                <Route path="/versions" element={<ProductVersionView/>}/>
                <Route path="/" element={<Navigate replace to="/products/:productId/versions"/>}/>
            </Routes>
        </>
    )
}

export default ProductRouter