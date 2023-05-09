export class AbstractManager<T extends { id: string, created: number, updated: number, deleted: number }> {

    public clear() {
        this.promiseItemIndex = {}
        this.resolveItemIndex = {}

        this.promiseFindIndex = {}
        this.resolveFindIndex = {}
    }

    // ITEM

    private promiseItemIndex: {[id: string]: Promise<T>} = {}
    private resolveItemIndex: {[id: string]: T} = {}

    protected async promiseItem(id: string, promise: Promise<T>) {
        this.promiseItemIndex[id] = promise
        const item = await promise
        this.resolveItem(item)
    }

    protected resolveItem(item: T) {
        if (this.hasItem(item.id)) {
            if (item.deleted === null) {
                const newTime = this.getTime(item)
                const oldTime = this.getTime(this.resolveItemIndex[item.id])
                if (newTime > oldTime) {
                    this.resolveItemIndex[item.id] = item
                }
            } else {
                delete this.resolveItemIndex[item.id]
            }
        } else {
            if (item.deleted === null) {
                this.resolveItemIndex[item.id] = item
            }
        }
    }

    protected async getItemPromise(id: string) {
        return this.promiseItemIndex[id]
    }
    protected getItem(id: string)  {
        return this.resolveItemIndex[id]
    }
    
    protected hasItemPromise(id: string) {
        return id in this.promiseItemIndex
    }
    protected hasItem(id: string) {
        return id in this.resolveItemIndex
    }

    protected async add(promise: Promise<T>) {
        const item = await promise
        this.resolveItem(item)
        return item
    }
    protected async get(id: string, get: () => Promise<T>) {
        if (this.hasItem(id)) {
            return this.getItem(id)
        } else if (this.hasItemPromise(id)) {
            return this.getItemPromise(id)
        } else {
            const promise = get()
            this.promiseItem(id, promise)
            return promise
        }
    }
    protected async update(id: string, promise: Promise<T>) {
        this.promiseItem(id, promise)
        return promise
    }
    protected async delete(id: string, promise: Promise<T>) {
        this.promiseItem(id, promise)
        return promise
    }

    // FIND

    private promiseFindIndex: {[key: string]: Promise<T[]>} = {}
    private includeFindIndex: {[key: string]: (item: T) => boolean} = {}
    private resolveFindIndex: {[key: string]: {[id: string]: boolean}} = {}

    protected async promiseFind(key: string, promise: Promise<T[]>, include: (item: T) => boolean) {
        this.promiseFindIndex[key] = promise
        this.includeFindIndex[key] = include
        const find = await promise
        this.resolveFind(key, find)
    }
    protected resolveFind(key: string, find: T[]) {
        this.resolveFindIndex[key] = {}
        for (const item of find) {
            this.resolveItem(item)
            this.resolveFindIndex[key][item.id] = true
        }
    }

    protected getFindPromise(key: string) {
        return this.promiseFindIndex[key]
    }
    protected getFind(key: string) {
        if (key in this.resolveFindIndex) {
            return Object.keys(this.resolveFindIndex[key]).map(id => this.getItem(id)).filter(t => t && t.deleted === null)
        } else {
            return undefined
        }
    }

    protected hasFindPromise(key: string) {
        return key in this.promiseFindIndex
    }
    protected hasFind(key: string) {
        return key in this.resolveFindIndex
    }

    protected async find(key: string, find: () => Promise<T[]>, include: (item: T) => boolean) {
        if (this.hasFind(key)) {
            return this.getFind(key)
        } else if (this.hasFindPromise(key)) {
            return this.getFindPromise(key)
        } else {
            const promise = find()
            this.promiseFind(key, promise, include)
            return promise
        }
    }

    private getTime(t: T) {
        if (t.deleted) {
            return t.deleted
        } else if (t.updated) {
            return t.updated
        } else {
            return t.created
        }
    }
    
}