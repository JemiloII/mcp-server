import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { readFileSync } from 'node:fs';

export function ReadFileSync(file: string) {
  return readFileSync(fileURLToPath(new URL(file, import.meta.url)));
}

export function WriteFileSync(file: string, data: Buffer) {
  return writeFileSync(fileURLToPath(new URL(file, import.meta.url)), data);
}
