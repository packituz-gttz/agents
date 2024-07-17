// src/utils/logging.ts
import fs from 'fs';
import util from 'util';

export function setupLogging(logFileName: string): void {
    const logFile = fs.createWriteStream(logFileName, { flags: 'a' });

    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalStdoutWrite = process.stdout.write;
    const originalStderrWrite = process.stderr.write;

    console.log = function(...args) {
        logFile.write(util.format.apply(null, args) + '\n');
        originalConsoleLog.apply(console, args);
    };

    console.error = function(...args) {
        logFile.write(util.format.apply(null, args) + '\n');
        originalConsoleError.apply(console, args);
    };

    process.stdout.write = function(chunk: string | Uint8Array, encoding?: BufferEncoding, callback?: (error: Error | null | undefined) => void): boolean {
        logFile.write(chunk, encoding as BufferEncoding);
        return originalStdoutWrite.apply(process.stdout, [chunk, encoding, callback]);
    } as any;

    process.stderr.write = function(chunk: string | Uint8Array, encoding?: BufferEncoding, callback?: (error: Error | null | undefined) => void): boolean {
        logFile.write(chunk, encoding as BufferEncoding);
        return originalStderrWrite.apply(process.stderr, [chunk, encoding, callback]);
    } as any;
}
