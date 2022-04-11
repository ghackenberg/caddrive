import { Member, User } from 'productboard-common'
import * as React from 'react'
import { Fragment } from 'react'
import * as DiagonalIcon from '/src/images/diagonal.png'

export const ProductUserPictureWidget = (props: { user: User, members: Member[], class?: string }) => {
    return (
        <Fragment>
            {props.user.deleted ? (
                <img src={DiagonalIcon} style={{backgroundImage: `url(/rest/files/${props.user.id}.jpg)`, opacity: 0.5}} className={props.class}/>
            ) : (
                <Fragment>
                    {props.members.map(member => member.userId).includes(props.user.id) ? (
                        <img src={`/rest/files/${props.user.id}.jpg`} className={props.class}/>
                    ) : (
                        <img src={DiagonalIcon} style={{backgroundImage: `url(/rest/files/${props.user.id}.jpg)`}} className={props.class}/>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}