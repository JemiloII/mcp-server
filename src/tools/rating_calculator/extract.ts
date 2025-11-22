import XLSX, { type WorkBook, type WorkSheet } from 'xlsx';
import { ReadFileSync } from './files';
import cells from './data/cells.json';

export type CacheOptions = { use: boolean, save: boolean };
export type Document = string | ArrayBuffer | Buffer<ArrayBufferLike>;
const CACHE: Map<Document, WorkBook> = new Map();

export function LoadWorkBook(
  document: Document = 'umamusume_rating_calculator.xlsx',
  cache: CacheOptions = { save: true, use: true }
): WorkBook {
  if (CACHE.has(document) && cache.use) {
    return CACHE.get(document)!;
  }

  const file = `./data/${document}`;
  const buffer = Buffer.isBuffer(document) ? document : ReadFileSync(file);
  const workbook = XLSX.read(buffer, { cellFormula: true, type: 'buffer' });
  if (cache.save) {
    CACHE.set(document, workbook);
  }

  return workbook;
}

export function ExtractVersion(document?: Document, cache?: CacheOptions): number {
  const wb: WorkBook = LoadWorkBook(document, cache);
  const ws: WorkSheet = wb.Sheets['Main'];
  return ws[cells.version].v;
}
