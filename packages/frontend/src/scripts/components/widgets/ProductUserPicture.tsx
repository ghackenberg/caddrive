import * as React from 'react'
import { Fragment } from 'react'

import { Member, User } from 'productboard-common'

import * as DiagonalIcon from '/src/images/diagonal.png'
import * as RemovedUserIcon from '/src/images/removedUser.png'
import * as UserIcon from '/src/images/user.png'

export const ProductUserPictureWidget = (props: { user: User, members: Member[], class?: string }) => {
    return (
        <Fragment>
            {props.user.deleted ? (
                <img src={RemovedUserIcon}  className={props.class}/>
            ) : (
                <Fragment>
                    {props.members.map(member => member.userId).includes(props.user.id) ? (
                        <img src={props.user.pictureId ? `/rest/files/${props.user.pictureId}.jpg`: UserIcon } style= {{backgroundColor: 'lightgray'}} className={props.class}/>
                    ) : (
                        <img src={DiagonalIcon} style={{backgroundImage: `url(${props.user.pictureId ? `/rest/files/${props.user.pictureId}.jpg`: UserIcon})`, backgroundColor: 'lightgray'}} className={props.class}/>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}