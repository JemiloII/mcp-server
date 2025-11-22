import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export function filePath(file: string) {
  return fileURLToPath(new URL(file, import.meta.url));
}

export function ReadFile(file: string) {
  return readFile(filePath(file));
}

export async function WriteFile(file: string, data: Buffer) {
  return writeFile(filePath(file), data);
}
