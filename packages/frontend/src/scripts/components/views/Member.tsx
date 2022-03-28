import  * as React from 'react'
import { useState, useEffect, Fragment } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Redirect, useHistory } from 'react-router'
// Commons
import { Product, User } from 'productboard-common'
// Managers
import { ProductManager } from '../../managers/product'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { ProductView3D } from '../widgets/ProductView3D'
import { TextInput } from '../inputs/TextInput'
import { UserManager } from '../../managers/user'
import { MemberManager } from '../../managers/member'

export const MemberView = (props: RouteComponentProps<{product: string, member: string}>) => {
    const productId = props.match.params.product
    
    const history = useHistory()

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [query, setQuery] = useState<string>('')
    const [users, setUsers] = useState<User[]>()
    const [names, setNames] = useState<React.ReactNode[]>()

    // Load entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { UserManager.findUsers(query, productId).then(setUsers) }, [props, query])
    useEffect(() => { users && setNames(users.map(user => {
        const index = user.name.toLowerCase().indexOf(query.toLowerCase())
        const before = user.name.substring(0, index)
        const between = user.name.substring(index, index + query.length)
        const after = user.name.substring(index + query.length)
        return <Fragment>{before}<mark>{between}</mark>{after}</Fragment>
    }))}, [users])

    async function select(user: User) {
        await MemberManager.addMember({ productId, userId: user.id })
        history.goBack()
    }

    return (
        <main className="view extended product">
            { product && (
                 <Fragment>
                    { product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>
                                    <h1>Settings</h1>
                                    <form>
                                        <TextInput label='Query' placeholder='Type query' value={query} change={setQuery} input={setQuery}/>
                                        {users && users.map((user, index) => (
                                            <div key={user.id}>
                                                <div/>
                                                <div>
                                                    <a onClick={() => select(user)}>
                                                        <img src={`/rest/files/${user.pictureId}.jpg`} className="big"/>
                                                        <span>{names && names[index]}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </form>
                                </div>
                                <div>
                                    <ProductView3D product={product} mouse={true} vr= {true}/>
                                </div>
                            </main>
                        </Fragment>
                    )}
                 </Fragment>
                
            )}
        </main>
    )
}