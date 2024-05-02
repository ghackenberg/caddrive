import { Model } from "./model"
import { Parser } from "./parser"

export interface Loader {
    load(url: string): Promise<string>
}

export class Manager {
    
    private readonly models: {[url: string]: Model} = {}

    private readonly parser = new Parser()

    constructor(private loader: Loader) {}

    async get(url: string) {
        if (!(url in this.models)) {
            const text = await this.loader.load(url)
            const model = this.parser.parse(text, url)
            // TODO this.parser.extend(model, 'color defs')
            this.models[url] = model
        }
        return this.models[url]
    }

}