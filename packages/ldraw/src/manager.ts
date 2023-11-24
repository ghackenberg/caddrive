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
            this.models[url] = this.parser.parseText(text)
        }
        return this.models[url]
    }

}