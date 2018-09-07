export interface IFormat {
    message?: string;
    type?: string;
    argv?: any[];
}
export declare type FormatFunc = (format: IFormat) => string;
export declare type LoggerFunc = (message: string, ...argv: any[]) => void;
export interface ILogger {
    invariant: (check: boolean, message?: string) => void;
    format: FormatFunc;
    log: LoggerFunc;
    warn: LoggerFunc;
    debug: LoggerFunc;
    error: LoggerFunc;
}
export default function createLogger(namespace?: string): ILogger;
