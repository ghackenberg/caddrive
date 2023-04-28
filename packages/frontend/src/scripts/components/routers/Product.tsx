import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import { ProductView } from '../views/Product'
import { ProductIssueView } from '../views/ProductIssue'
import { ProductIssueCommentView } from '../views/ProductIssueComment'
import { ProductIssueSettingView } from '../views/ProductIssueSetting'
import { ProductMemberView } from '../views/ProductMember'
import { ProductMemberSettingView } from '../views/ProductMemberSetting'
import { ProductMilestoneView } from '../views/ProductMilestone'
import { ProductMilestoneIssueView } from '../views/ProductMilestoneIssue'
import { ProductMilestoneSettingView } from '../views/ProductMilestoneSetting'
import { ProductSettingView } from '../views/ProductSetting'
import { ProductVersionView } from '../views/ProductVersion'
import { ProductVersionSettingView } from '../views/ProductVersionSetting'

const ProductRouter = () => {
    return (
        <Switch>
            <Route path="/products/:product/versions/:version/settings" component={ProductVersionSettingView}/>
            <Redirect path="/products/:product/versions/:version" to="/products/:product/versions/:version/settings"/>
            <Route path="/products/:product/versions" component={ProductVersionView}/>
            
            <Route path="/products/:product/issues/:issue/comments" component={ProductIssueCommentView}/>
            <Route path="/products/:product/issues/:issue/settings" component={ProductIssueSettingView}/>
            <Redirect path="/products/:product/issues/:issue" to="/products/:product/issues/:issue/comments"/>
            <Route path="/products/:product/issues" component={ProductIssueView}/>

            <Route path="/products/:product/milestones/:milestone/issues" component={ProductMilestoneIssueView}/>
            <Route path="/products/:product/milestones/:milestone/settings" component={ProductMilestoneSettingView}/>
            <Redirect path="/products/:product/milestones/:milestone" to="/products/:product/milestones/:milestone/issues"/>
            <Route path="/products/:product/milestones" component={ProductMilestoneView}/>

            <Route path="/products/:product/members/:member/settings" component={ProductMemberSettingView}/>
            <Redirect path="/products/:product/members/:member" to="/products/:product/members/:member/settings"/>
            <Route path="/products/:product/members" component={ProductMemberView}/>

            <Route path="/products/:product/settings" component={ProductSettingView}/>
            <Redirect path="/products/:product" to="/products/:product/versions"/>
            <Route path="/products" component={ProductView}/>
        </Switch>
    )
}

export default ProductRouter