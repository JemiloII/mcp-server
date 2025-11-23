import { type CacheOptions, ExtractVersion, LoadWorkBook, SaveAllSkills } from './extract';
import { WriteFile } from './files';
import cell from './data/cells.json';

const { GOOGLE_API_KEY, SPREADSHEET_ID } = process.env;

export async function CheckAndUpdateData(): Promise<void> {
  const local_version = await ExtractVersion();
  const remote_version = await ReadCell(cell.latest);
  console.log('local version:', typeof local_version, local_version);
  console.log('remote version:', typeof remote_version, remote_version);

  if (local_version && remote_version && local_version !== remote_version) {
    console.log('Downloading Latest update...');
    await DownloadAndValidateXlsx('umamusume_rating_calculator.xlsx');
    await SaveAllSkills();
  }
}

async function DownloadAndValidateXlsx(filename: string): Promise<void> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=xlsx`;
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  try {
    const cache: CacheOptions = { save: false, use: false }
    const version = await ExtractVersion(buffer, cache);
    await WriteFile(`./data/${filename}`, Buffer.from(buffer));
    await LoadWorkBook();
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
