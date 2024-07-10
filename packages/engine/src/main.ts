//@ts-expect-error: host binding
@external("env", "console.log")
export declare function consoleLog(s: string): void

export function main(): void {
    consoleLog('Hello world from AssemblyScript!')
}