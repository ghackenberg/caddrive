export class AbstractManager<T extends { id: string, created: number, updated: number, deleted: number }> {

    private index: {[id: string]: T} = {}

    protected store(t: T) {
        if (this.has(t.id)) {
            const newTime = this.getTime(t)
            const oldTime = this.getTime(this.index[t.id])
            if (newTime > oldTime) {
                this.index[t.id] = t
                return t
            } else {
                return this.index[t.id]
            }
        } else {
            this.index[t.id] = t
            return t
        }
    }
    protected load(id: string)  {
        return this.index[id]
    }
    protected has(id: string) {
        return id in this.index
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