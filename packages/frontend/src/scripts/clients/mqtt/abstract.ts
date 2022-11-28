export abstract class AbstractClient<T> {
    protected handlers: T[] = []
    register(handler: T) {
        if (!this.handlers.includes(handler)) {
            this.handlers.push(handler)
        }
        return () => {
            this.handlers.splice(this.handlers.indexOf(handler), 1)
        }
    }
}