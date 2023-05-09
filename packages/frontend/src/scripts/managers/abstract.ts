export class AbstractManager<T extends { id: string, created: number, updated: number, deleted: number }> {

    public clear() {
        this.promiseItemIndex = {}
        this.resolveItemIndex = {}

        this.promiseFindIndex = {}
        this.resolveFindIndex = {}
    }

    private promiseItemIndex: {[id: string]: Promise<T>} = {}
    private resolveItemIndex: {[id: string]: T} = {}

    protected async promiseItem(id: string, p: Promise<T>) {
        if (this.hasPromiseItem(id)) {
            return this.getPromiseItem(id)
        } else {
            this.promiseItemIndex[id] = p
            const t = await p
            delete this.promiseItemIndex[id]
            return this.resolveItem(t)
        }
    }
    protected resolveItem(t: T) {
        if (this.hasResolveItem(t.id)) {
            const newTime = this.getTime(t)
            const oldTime = this.getTime(this.resolveItemIndex[t.id])
            if (newTime > oldTime) {
                this.resolveItemIndex[t.id] = t
                return t
            } else {
                return this.resolveItemIndex[t.id]
            }
        } else {
            this.resolveItemIndex[t.id] = t
            return t
        }
    }

    protected async getPromiseItem(id: string) {
        return this.promiseItemIndex[id]
    }
    protected getResolveItem(id: string)  {
        return this.resolveItemIndex[id]
    }
    
    protected hasPromiseItem(id: string) {
        return id in this.promiseItemIndex
    }
    protected hasResolveItem(id: string) {
        return id in this.resolveItemIndex
    }

    private promiseFindIndex: {[key: string]: Promise<T[]>} = {}
    private resolveFindIndex: {[key: string]: {[id: string]: boolean}} = {}

    protected async promiseFind(key: string, p: Promise<T[]>) {
        if (this.hasPromiseFind(key)) {
            return this.promiseFindIndex[key]
        } else {
            this.promiseFindIndex[key] = p
            const t = await p
            delete this.promiseFindIndex[key]
            this.resolveFind(key, t)
            return t
        }
    }
    protected resolveFind(key: string, t: T[]) {
        this.resolveFindIndex[key] = {}
        for (const item of t) {
            this.resolveFindIndex[key][item.id] = true
        }
        return t
    }

    protected addResolveFind(key: string, t: T) {
        if (this.hasResolveFind(key)) {
            this.resolveFindIndex[key][t.id] = true
        }
    }
    protected removeResolveFind(key: string, t: T) {
        if (this.hasResolveFind(key)) {
            delete this.resolveFindIndex[key][t.id]
        }
    }

    protected getPromiseFind(key: string) {
        return this.promiseFindIndex[key]
    }
    protected getResolveFind(key: string) {
        if (key in this.resolveFindIndex) {
            return Object.keys(this.resolveFindIndex[key]).map(id => this.getResolveItem(id)).filter(t => t.deleted === null)
        } else {
            return undefined
        }
    }

    protected hasPromiseFind(key: string) {
        return key in this.promiseFindIndex
    }
    protected hasResolveFind(key: string) {
        return key in this.resolveFindIndex
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