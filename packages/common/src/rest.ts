import { Action, ActionAddData, ActionUpdateData } from './data/action'
import { AdditionalProperty, AdditionalPropertyAddData, AdditionalPropertyUpdateData } from './data/additionalProperty'
import { Attachment, AttachmentAddData, AttachmentUpdateData } from './data/attachment'
import { Comment } from './data/comment'
import { DoneCriterion, DoneCriterionAddData, DoneCriterionUpdateData } from './data/doneCriterion'
import { DoneProperty, DonePropertyAddData, DonePropertyUpdateData } from './data/doneProperty'
import { Guard, GuardAddData, GuardUpdateData } from './data/guard'
import { Issue } from './data/issue'
import { IssueType, IssueTypeAddData, IssueTypeUpdateData } from './data/issueType'
import { IssueTypeHierarchy, IssueTypeHierarchyAddData, IssueTypeHierarchyUpdateData } from './data/issueTypeHierarchy'
import { Member, MemberAddData, MemberUpdateData } from './data/member'
import { Milestone, MilestoneAddData, MilestoneUpdateData } from './data/milestone'
import { Product, ProductAddData, ProductUpdateData } from './data/product'
import { Property, PropertyAddData, PropertyUpdateData } from './data/property'
import { PropertyType, PropertyTypeAddData, PropertyTypeUpdateData } from './data/propertyType'
import { ReadyCriterion, ReadyCriterionAddData, ReadyCriterionUpdateData } from './data/readyCriterion'
import { ReadyProperty, ReadyPropertyAddData, ReadyPropertyUpdateData } from './data/readyProperty'
import { Relation, RelationAddData, RelationUpdateData } from './data/relation'
import { State, StateAddData, StateUpdateData } from './data/state'
import { Tag, TagAddData, TagUpdateData } from './data/tag'
import { TagAssignment, TagAssignmentAddData, TagAssignmentUpdateData } from './data/tagAssignment'
import { Transition, TransitionAddData, TransitionUpdateData } from './data/transition'
import { User } from './data/user'
import { Version } from './data/version'

export interface UserREST<D, F> {
    checkUser(): Promise<User>
    findUsers(query?: string, productId?: string): Promise<User[]>
    addUser(data: D, file?: F): Promise<User>
    getUser(id: string): Promise<User>
    updateUser(id: string, data: D, file?: F): Promise<User>
    deleteUser(id: string): Promise<User>
}

export interface ProductREST {
    findProducts(): Promise<Product[]>
    addProduct(data: ProductAddData): Promise<Product>
    getProduct(id: string): Promise<Product>
    updateProduct(id: string, data: ProductUpdateData): Promise<Product>
    deleteProduct(id: string): Promise<Product>
}

export interface VersionREST<DA, DU, M, I> {
    findVersions(productId: string): Promise<Version[]>
    addVersion(data: DA, files: { model: M, image: I }): Promise<Version>
    getVersion(id: string): Promise<Version>
    updateVersion(id: string, data: DU, files?: {model: M, image: I}): Promise<Version>
    deleteVersion(id: string): Promise<Version>
}

export interface IssueREST<DA, DU, A> {
    findIssues(productId: string, milestoneId?: string, state?: 'open' | 'closed'): Promise<Issue[]>
    addIssue(data: DA, files: { audio?: A }): Promise<Issue>
    getIssue(id: string): Promise<Issue>
    updateIssue(id: string, data: DU, files?: { audio?: A }): Promise<Issue>
    deleteIssue(id: string): Promise<Issue>
}

export interface CommentREST<DA, DU, A> {
    findComments(issueId: string): Promise<Comment[]>
    addComment(data: DA, files: { audio?: A }): Promise<Comment>
    getComment(id: string): Promise<Comment>
    updateComment(id: string, data: DU, files?: { audio?: A }): Promise<Comment>
    deleteComment(id: string): Promise<Comment>
}

export interface MilestoneREST {
    findMilestones(productId: string): Promise<Milestone[]>
    addMilestone(data: MilestoneAddData): Promise<Milestone>
    getMilestone(id: string): Promise<Milestone>
    updateMilestone(id: string, data: MilestoneUpdateData): Promise<Milestone>
    deleteMilestone(id: string): Promise<Milestone>
}

export interface MemberREST {
    findMembers(productId: string, userId?: string): Promise<Member[]>
    addMember(data: MemberAddData): Promise<Member>
    getMember(id: string): Promise<Member>
    updateMember(id: string, data: MemberUpdateData): Promise<Member>
    deleteMember(id: string): Promise<Member>
}

export interface FileREST<D> {
    getFile(id: string): Promise<D>
}

export interface TagREST {
    findTags(productId: string): Promise<Tag[]>
    addTag(data: TagAddData): Promise<Tag>
    getTag(id: string): Promise<Tag>
    updateTag(id: string, data: TagUpdateData): Promise<Tag>
    deleteTag(id: string): Promise<Tag>
}

export interface TagAssignmentREST {
    findTagAssignments(issueId: string): Promise<TagAssignment[]>
    addTagAssignment(data: TagAssignmentAddData): Promise<TagAssignment>
    getTagAssignment(id: string): Promise<TagAssignment>
    updateTagAssignment(id: string, data: TagAssignmentUpdateData): Promise<TagAssignment>
    deleteTagAssignment(id: string): Promise<TagAssignment>
}

export interface AttachmentREST {
    findAttachments(issueId: string): Promise<Attachment[]>
    addAttachment(data: AttachmentAddData): Promise<Attachment>
    getAttachment(id: string): Promise<Attachment>
    updateAttachment(id: string, data: AttachmentUpdateData): Promise<Attachment>
    deleteAttachment(id: string): Promise<Attachment>
}

export interface RelationREST {
    findRelations(issueId: string): Promise<Relation[]>
    addRelation(data: RelationAddData): Promise<Relation>
    getRelation(id: string): Promise<Relation>
    updateRelation(id: string, data: RelationUpdateData): Promise<Relation>
    deleteRelation(id: string): Promise<Relation>
}

export interface AdditionalPropertyREST {
    findAdditionalProperties(issueId: string): Promise<AdditionalProperty[]>
    addAdditionalProperty(data: AdditionalPropertyAddData): Promise<AdditionalProperty>
    getAdditionalProperty(id: string): Promise<AdditionalProperty>
    updateAdditionalProperty(id: string, data: AdditionalPropertyUpdateData): Promise<AdditionalProperty>
    deleteAdditionalProperty(id: string): Promise<AdditionalProperty>
}

export interface PropertyREST {
    findProperties(issueId: string): Promise<Property[]>
    addProperty(data: PropertyAddData): Promise<Property>
    getProperty(id: string): Promise<Property>
    updateProperty(id: string, data: PropertyUpdateData): Promise<Property>
    deleteProperty(id: string): Promise<Property>
}

export interface StateREST {
    findStates(productId: string): Promise<State[]>
    addState(data: StateAddData): Promise<State>
    getState(id: string): Promise<State>
    updateState(id: string, data: StateUpdateData): Promise<State>
    deleteState(id: string): Promise<State>
}

export interface IssueTypeREST {
    findIssueTypes(productId: string): Promise<IssueType[]>
    addIssueType(data: IssueTypeAddData): Promise<IssueType>
    getIssueType(id: string): Promise<IssueType>
    updateIssueType(id: string, data: IssueTypeUpdateData): Promise<IssueType>
    deleteIssueType(id: string): Promise<IssueType>
}

export interface PropertyTypeREST {
    findPropertyTypes(productId: string): Promise<PropertyType[]>
    addPropertyType(data: PropertyTypeAddData): Promise<PropertyType>
    getPropertyType(id: string): Promise<PropertyType>
    updatePropertyType(id: string, data: PropertyTypeUpdateData): Promise<PropertyType>
    deletePropertyType(id: string): Promise<PropertyType>
}

export interface TransitionREST {
    findTransitions(stateId: string): Promise<Transition[]>
    addTransition(data: TransitionAddData): Promise<Transition>
    getTransition(id: string): Promise<Transition>
    updateTransition(id: string, data: TransitionUpdateData): Promise<Transition>
    deleteTransition(id: string): Promise<Transition>
}

export interface IssueTypeHierarchyREST {
    findIssueTypeHierarchies(productId: string): Promise<IssueTypeHierarchy[]>
    addIssueTypeHierarchy(data: IssueTypeHierarchyAddData): Promise<IssueTypeHierarchy>
    getIssueTypeHierarchy(id: string): Promise<IssueTypeHierarchy>
    updateIssueTypeHierarchy(id: string, data: IssueTypeHierarchyUpdateData): Promise<IssueTypeHierarchy>
    deleteIssueTypeHierarchy(id: string): Promise<IssueTypeHierarchy>
}

export interface ReadyCriterionREST {
    findReadyCriterions(issueTypeId: string): Promise<ReadyCriterion[]>
    addReadyCriterion(data: ReadyCriterionAddData): Promise<ReadyCriterion>
    getReadyCriterion(id: string): Promise<ReadyCriterion>
    updateReadyCriterion(id: string, data: ReadyCriterionUpdateData): Promise<ReadyCriterion>
    deleteReadyCriterion(id: string): Promise<ReadyCriterion>
}

export interface DoneCriterionREST {
    findDoneCriterions(issueTypeId: string): Promise<DoneCriterion[]>
    addDoneCriterion(data: DoneCriterionAddData): Promise<DoneCriterion>
    getDoneCriterion(id: string): Promise<DoneCriterion>
    updateDoneCriterion(id: string, data: DoneCriterionUpdateData): Promise<DoneCriterion>
    deleteDoneCriterion(id: string): Promise<DoneCriterion>
}

export interface ActionREST {
    findActions(transitionId: string): Promise<Action[]>
    addAction(data: ActionAddData): Promise<Action>
    getAction(id: string): Promise<Action>
    updateAction(id: string, data: ActionUpdateData): Promise<Action>
    deleteAction(id: string): Promise<Action>
}

export interface GuardREST {
    findGuards(transitionId: string): Promise<Guard[]>
    addGuard(data: GuardAddData): Promise<Guard>
    getGuard(id: string): Promise<Guard>
    updateGuard(id: string, data: GuardUpdateData): Promise<Guard>
    deleteGuard(id: string): Promise<Guard>
}

export interface ReadyPropertyREST {
    findReadyPropertys(issueTypeId: string): Promise<ReadyProperty[]>
    addReadyProperty(data: ReadyPropertyAddData): Promise<ReadyProperty>
    getReadyProperty(id: string): Promise<ReadyProperty>
    updateReadyProperty(id: string, data: ReadyPropertyUpdateData): Promise<ReadyProperty>
    deleteReadyProperty(id: string): Promise<ReadyProperty>
}

export interface DonePropertyREST {
    findDonePropertys(issueTypeId: string): Promise<DoneProperty[]>
    addDoneProperty(data: DonePropertyAddData): Promise<DoneProperty>
    getDoneProperty(id: string): Promise<DoneProperty>
    updateDoneProperty(id: string, data: DonePropertyUpdateData): Promise<DoneProperty>
    deleteDoneProperty(id: string): Promise<DoneProperty>
}