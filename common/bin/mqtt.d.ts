export interface TestMQTT {
    a(data: string): Promise<void>;
    b(data: string): Promise<void>;
}
