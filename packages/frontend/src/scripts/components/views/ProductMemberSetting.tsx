import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Redirect } from 'react-router'
// Commons
import { MemberRole, Product, User } from 'productboard-common'
// Managers
import { ProductManager } from '../../managers/product'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { ProductView3D } from '../widgets/ProductView3D'
import { TextInput } from '../inputs/TextInput'
import { UserManager } from '../../managers/user'
import { MemberManager } from '../../managers/member'
import { Column, Table } from '../widgets/Table'

export const ProductMemberSettingView = (props: RouteComponentProps<{product: string, member: string}>) => {
    
    //const history = useHistory()
    const roles: MemberRole[] = ['manager', 'engineer', 'customer']

    // PARAMS

    const productId = props.match.params.product

    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>()
    const [users, setUsers] = useState<User[]>()
    // - Computations
    const [names, setNames] = useState<React.ReactNode[]>()
    // - Values
    const [role, setRole] = useState<MemberRole>('customer')
    // - Interactions
    const [query, setQuery] = useState<string>('')

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { UserManager.findUsers(query, productId).then(setUsers) }, [props, query])
    // - Computations
    useEffect(() => {
        if (users) {
            setNames(users.map(user => {
                const index = user.name.toLowerCase().indexOf(query.toLowerCase())
                const before = user.name.substring(0, index)
                const between = user.name.substring(index, index + query.length)
                const after = user.name.substring(index + query.length)
                return <Fragment>{before}<mark>{between}</mark>{after}</Fragment>
            }))
        }
    }, [users])

    // FUNCTIONS

    async function selectUser(user: User) {
        if (confirm('Do you really want to add this member?')) {
            await MemberManager.addMember({ productId, userId: user.id, role: role })
            //history.goBack()               
        }
    }

    async function submitMember(event: FormEvent) {
        event.preventDefault()
        console.log(role)
    }

    // CONSTANTS

    const columns: Column<User>[] = [
        { label: 'Picture', class: 'center', content: user => (
            <a onClick={() => selectUser(user)}>
                <img src={`/rest/files/${user.id}.jpg`} className='big'/>
            </a>
        )},
        { label: 'Name', class: 'fill', content: (user, index) => (
            <a onClick={() => selectUser(user)}>
                {names ? names[index] : '?'}
            </a>
        )}
    ]

    // RETURN

    return (
        <main className="view extended member">
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
                                    <form onSubmit={submitMember}>
                                        <TextInput label='Query' placeholder='Type query' value={query} change={setQuery} input={setQuery}/>
                                        <div>
                                            <div>
                                                Users:
                                            </div>
                                            <div>
                                                { users && <Table items={users} columns={columns}/> }
                                            </div>
                                        </div>

                                        <div>
                                            <div>
                                                Role:
                                            </div>
                                            <div>
                                                <select value={role} onChange={(event) => setRole(event.currentTarget.value as MemberRole)}> 
                                                    {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                                                    
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <div/>
                                                <div>
                                                    <input type='submit' value='Save'/>
                                                </div>
                                            </div>

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