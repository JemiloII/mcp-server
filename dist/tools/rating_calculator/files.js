import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {} from 'node:events';
export function filePath(file) {
    return fileURLToPath(new URL(file, import.meta.url));
}
export function ReadFile(file, options) {
    return readFile(filePath(file), options);
}
export async function WriteFile(file, data, options) {
    return writeFile(filePath(file), data, options);
}
