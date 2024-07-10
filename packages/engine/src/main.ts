//@ts-expect-error: host binding
@external("env", "console.log")
export declare function consoleLog(s: string): void

export function main(): void {
    consoleLog('Hello world from AssemblyScript!')
}

export function compute(a: i32, b: i32): i32 {
    return a + b
}