export class AbstractManager<T extends { id: string, created: number, updated: number, deleted: number }> {

    public clear() {
        this.promiseItemIndex = {}
        this.resolveItemIndex = {}

        this.promiseFindIndex = {}
        this.resolveFindIndex = {}
    }

    // ITEM

    private promiseItemIndex:  {[id: string]: Promise<T>} = {}
    private resolveItemIndex:  {[id: string]: T} = {}
    private callbackItemIndex: {[id: string]: ((item: T) => void)[]} = {}

    private async promiseItem(id: string, promise: Promise<T>) {
        if (!(id in this.callbackItemIndex)) {
            this.callbackItemIndex[id] = []
        }
        this.promiseItemIndex[id] = promise
        const item = await promise
        this.resolveItem(item)
        return item
    }
    private resolveItem(item: T) {
        if (!(item.id in this.callbackItemIndex)) {
            this.callbackItemIndex[item.id] = []
        }
        this.resolveItemIndex[item.id] = item
        return item
    }
    
    private hasItemPromise(id: string) {
        return id in this.promiseItemIndex
    }
    private hasItem(id: string) {
        return id in this.resolveItemIndex
    }

    protected getItem(id: string)  {
        return this.resolveItemIndex[id]
    }

    protected async add(promise: Promise<T>) {
        const item = this.resolveItem(await promise)
        for (const key of Object.keys(this.resolveFindIndex)) {
            if (this.includeFindIndex[key](item)) {
                this.resolveFindIndex[key][item.id] = true
            } else {
                delete this.resolveFindIndex[key][item.id]
            }
            for (const callback of this.callbackFindIndex[key]) {
                callback(this.getFind(key))
            }
        }
        return item
    }

    protected get(id: string, get: () => Promise<T>, callback: (item: T, error?: string) => void) {
        if (this.hasItem(id)) {
            callback(this.getItem(id))
            this.callbackItemIndex[id].push(callback)
        } else if (this.hasItemPromise(id)) {
            this.callbackItemIndex[id].push(callback)
        } else {
            this.callbackItemIndex[id] = [callback]
            const impl = () => {
                this.promiseItem(id, get()).then(item => {
                    for (const callback of this.callbackItemIndex[id]) {
                        callback(item)
                    }
                    if (this.callbackItemIndex[id].length > 0) {
                        setTimeout(impl, 1000 * 60)
                    }
                })
            }
            impl()
        }
        return () => {
            this.callbackItemIndex[id].splice(this.callbackItemIndex[id].indexOf(callback), 1)
        }
    }

    protected async update(id: string, promise: Promise<T>) {
        const item = await this.promiseItem(id, promise)
        for (const callback of this.callbackItemIndex[id]) {
            callback(item)
        }
        for (const key of Object.keys(this.resolveFindIndex)) {
            if (this.includeFindIndex[key](item)) {
                this.resolveFindIndex[key][item.id] = true
            } else {
                delete this.resolveFindIndex[key][item.id]
            }
            for (const callback of this.callbackFindIndex[key]) {
                callback(this.getFind(key))
            }
        }
        return item
    }

    protected async delete(id: string, promise: Promise<T>) {
        const item = await this.promiseItem(id, promise)
        for (const callback of this.callbackItemIndex[id]) {
            callback(undefined)
        }
        for (const key of Object.keys(this.resolveFindIndex)) {
            delete this.resolveFindIndex[key][item.id]
            for (const callback of this.callbackFindIndex[key]) {
                callback(this.getFind(key))
            }
        }
        return promise
    }

    // FIND

    private promiseFindIndex:  {[key: string]: Promise<T[]>} = {}
    private includeFindIndex:  {[key: string]: (item: T) => boolean} = {}
    private resolveFindIndex:  {[key: string]: {[id: string]: boolean}} = {}
    private callbackFindIndex: {[key: string]: ((item: T[]) => void)[]} = {}

    private async promiseFind(key: string, promise: Promise<T[]>, include: (item: T) => boolean) {
        if (!(key in this.callbackFindIndex)) {
            this.callbackFindIndex[key] = []
        }
        this.promiseFindIndex[key] = promise
        this.includeFindIndex[key] = include
        const find = await promise
        return this.resolveFind(key, find)
    }
    private resolveFind(key: string, find: T[]) {
        this.resolveFindIndex[key] = {}
        for (const item of find) {
            this.resolveItem(item)
            this.resolveFindIndex[key][item.id] = true
        }
        return find
    }

    private hasFindPromise(key: string) {
        return key in this.promiseFindIndex
    }
    private hasFind(key: string) {
        return key in this.resolveFindIndex
    }

    protected getFind(key: string) {
        if (key in this.resolveFindIndex) {
            return Object.keys(this.resolveFindIndex[key]).map(id => this.getItem(id)).filter(t => t && t.deleted === null)
        } else {
            return undefined
        }
    }

    protected find(key: string, find: () => Promise<T[]>, include: (item: T) => boolean, callback: (items: T[], error?: string) => void) {
        if (this.hasFind(key)) {
            callback(this.getFind(key))
            this.callbackFindIndex[key].push(callback)
        } else if (this.hasFindPromise(key)) {
            this.callbackFindIndex[key].push(callback)
        } else {
            this.callbackFindIndex[key] = [callback]
            const impl = () => {
                this.promiseFind(key, find(), include).then(items => {
                    for (const callback of this.callbackFindIndex[key]) {
                        callback(items)
                    }
                    if (this.callbackFindIndex[key].length > 0) {
                        setTimeout(impl, 1000 * 60)
                    }
                })
            }
            impl()
        }
        return () => {
            this.callbackFindIndex[key].splice(this.callbackFindIndex[key].indexOf(callback), 1)
        }
    }
    
}