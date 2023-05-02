import { Request } from "express"

import { User } from "productboard-common"

export type AuthorizedRequest = Request & { user: User }