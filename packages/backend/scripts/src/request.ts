import { Request } from "express"

import { UserRead } from "productboard-common"

export type AuthorizedRequest = Request & { user: UserRead }