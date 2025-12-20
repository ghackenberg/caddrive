import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { collection, doc, DocumentReference, getFirestore, onSnapshot } from 'firebase/firestore'
import { AccountSchema } from '../schemas/account.js'
import { ProductSchema } from '../schemas/product.js'
import { ProfileSchema } from '../schemas/profile.js'

const firebaseConfig = {
    apiKey: "AIzaSyCcUgOUnNBFR4wvPo_fq7WxgkxPF3XZLEU",
    authDomain: "caddrive-6ce43.firebaseapp.com",
    projectId: "caddrive-6ce43",
    storageBucket: "caddrive-6ce43.firebasestorage.app",
    messagingSenderId: "81815253640",
    appId: "1:81815253640:web:5155bc289871296cd7e53d"
}

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const firestore = getFirestore(app)

export const accounts = collection(firestore, 'accounts')
export const profiles = collection(firestore, 'profiles')
export const products = collection(firestore, 'products')

export interface Document<T> {
    id: string
    data: T
}

function onDocument<T>(document: DocumentReference, callback: (data: Document<T>) => void) {
    return onSnapshot(document, snapshot => {
        callback({
            id: snapshot.id,
            data: snapshot.data() as T
        })
    })
}

export function onAccount(userId: string, callback: (data: Document<AccountSchema>) => void) {
    return onDocument(doc(accounts, userId), callback)
}
export function onProfile(userId: string, callback: (data: Document<ProfileSchema>) => void) {
    return onDocument(doc(profiles, userId), callback)
}
export function onProduct(productId: string, callback: (data: Document<ProductSchema>) => void) {
    return onDocument(doc(products, productId), callback)
}