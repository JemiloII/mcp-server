import { type CacheOptions, ExtractVersion, LoadWorkBook } from './extract';
import { WriteFileSync } from './files';
import cell from './data/cells.json';

const { GOOGLE_API_KEY, SPREADSHEET_ID } = process.env;

export async function CheckAndDownloadSheet(): Promise<void> {
  const local_version = ExtractVersion();
  const remote_version = await ReadCell(cell.latest);

  if (local_version !== remote_version) {
    await DownloadAndValidateXlsx('umamusume_rating_calculator.xlsx');
  }
}

async function DownloadAndValidateXlsx(filename: string): Promise<void> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=xlsx`;
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  try {
    const cache: CacheOptions = { save: false, use: false }
    const version = ExtractVersion(buffer, cache);
    WriteFileSync(`./data/${filename}`, Buffer.from(buffer));
    LoadWorkBook();
    console.log(`Sheet updated to version ${version}`);
  } catch (error) {
    console.error('Downloaded file validation failed:', error);
  }
}

async function ReadCell(cell: string): Promise<any> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${cell}?key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json() as any;
  return data.values?.[0]?.[0];
}

await CheckAndDownloadSheet();
