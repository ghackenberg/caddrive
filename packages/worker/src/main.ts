import { Parser } from 'productboard-ldraw'

const parser = new Parser()

onmessage = event => {
    postMessage(parser.parse(event.data.text, event.data.url))
}