import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Mode, ObjectEncodingOptions, OpenMode } from 'node:fs';
import { type Abortable } from 'node:events';

type WriteOptions = (ObjectEncodingOptions & {
  mode?: Mode | undefined;
  flag?: OpenMode | undefined;
  /**
   * If all data is successfully written to the file, and `flush`
   * is `true`, `filehandle.sync()` is used to flush the data.
   * @default false
   */
  flush?: boolean | undefined;
} & Abortable);

export function filePath(file: string) {
  return fileURLToPath(new URL(file, import.meta.url));
}

export function ReadFile(file: string) {
  return readFile(filePath(file));
}

export async function WriteFile(file: string, data: Buffer|string, options?: WriteOptions) {
  return writeFile(filePath(file), data, options);
}
