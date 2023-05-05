import * as React from 'react'
import { useParams } from 'react-router'

import { ProductAPI } from '../clients/mqtt/product'
import { UserAPI } from '../clients/mqtt/user'
import { ProductManager } from '../managers/product'
import { UserManager } from '../managers/user'

// USER

export function useRouteUser() {
    const { userId } = useParams<{ userId: string }>()

    const initialUser = userId && userId != 'new' ? UserManager.getUserFromCache(userId) : undefined

    const [user, setUser] = React.useState(initialUser)

    React.useEffect(() => {
        let exec = true
        userId && userId != 'new' && UserManager.getUser(userId).then(user => exec && setUser(user))
        return () => { exec = false }
    }, [userId])

    React.useEffect(() => {
        return UserAPI.register({
            create(user) {
                user.id == userId && setUser(user)
            },
            delete(user) {
                user.id == userId && setUser(user)
            },
            update(user) {
                user.id == userId && setUser(user)
            }
        })
    })

    return { userId, user }
}

// PRODUCT

export function useRouteProduct() {
    const { productId } = useParams<{ productId: string }>()
    
    const initialProduct = productId && productId != 'new' ? ProductManager.getProductFromCache(productId) : undefined
    
    const [product, setProduct] = React.useState(initialProduct)
    
    React.useEffect(() => {
        let exec = true
        productId && productId != 'new' && ProductManager.getProduct(productId).then(product => exec && setProduct(product))
        return () => { exec = false }
    }, [productId])

    React.useEffect(() => {
        return ProductAPI.register({
            create(product) {
                product.id == productId && setProduct(product)
            },
            update(product) {
                product.id == productId && setProduct(product)
            },
            delete(product) {
                product.id == productId && setProduct(product)
            }
        })
    })
    
    return { productId, product }
}