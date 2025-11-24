import XLSX, { type WorkBook, type WorkSheet } from 'xlsx';
import { ReadFile, WriteFile } from './files';
import cells from './data/cells.json';
import recovery from './data/recovery.json';

export type CacheOptions = { use: boolean, save: boolean };
export type Document = string | ArrayBuffer | Buffer<ArrayBufferLike>;
const CACHE: Map<Document, WorkBook> = new Map();

type ReadSkills = [Record<string, string>] | [Record<string, string>, number];
type SkillSheets = Record<string, ReadSkills | []>;

function ReadSkills(
  ws: WorkSheet,
  columns: Record<string, string> = {},
  start_row: number = 2,
  key_column: string = 'A',
): Record<string, Record<string, string|number>> {
  const result: Record<string, Record<string, string|number>> = {};
  columns = { base: 'B', ...columns };
  let row = start_row;
  while (true) {
    const cell = ws[`${key_column}${row}`];
    const { s: skill_style, v: key } = cell || {};
    if (!key) {
      break;
    }

    result[key] = {
      rarity: 'common'
    };

    switch (ws.name) {
      case 'Blue':
        result[key]['category'] = 'recovery';
        break;
      case 'Inherited Unique Skill':
        result[key]['rarity'] = 'unique';
        break;
      case 'Purple':
        result[key]['category'] = 'detrimental';
        break;
      case 'Red':
        result[key]['category'] = 'debuff';
        break;
      default:
        result[key]['category'] = 'standard';
    }

    if (ws.name === 'gold' && skill_style?.bgColor) {
      result[key]['rarity'] = 'rare';
      switch (skill_style.bgColor?.rgb) {
        case 'F4CCCC':
          result[key]['category'] = 'debuff';
          break;
        case 'C9DAF8':
          result[key]['category'] = 'recovery';
          break;
        case 'FFF2CC':
        default:
          result[key]['category'] = 'standard';
      }
    }

    for (const [name, column] of Object.entries(columns)) {
      const cell = ws[`${column}${row}`];
      const { s, v: value } = cell || {};
      if (name !== 'base' && s?.bgColor && s.bgColor.rgb !== 'CFFFA8') {
        continue;
      }

      result[key][name] = value;
    }

    row++;
  }

  return result;
}

export async function LoadWorkBook(
  document: Document = 'umamusume_rating_calculator.xlsx',
  cache: CacheOptions = { save: true, use: true }
): Promise<WorkBook> {
  if (CACHE.has(document) && cache.use) {
    return CACHE.get(document)!;
  }

  const file = `./data/${document}`;
  const buffer = Buffer.isBuffer(document) || document instanceof ArrayBuffer ? document : await ReadFile(file);
  const workbook = XLSX.read(buffer, { cellFormula: true, cellStyles: true, type: 'buffer' });
  if (cache.save) {
    CACHE.set(document, workbook);
  }

  return workbook;
}

export async function LoadWorkSheet(sheet: string, document?: Document, cache?: CacheOptions): Promise<WorkSheet> {
  const wb: WorkBook = await LoadWorkBook(document, cache);
  return wb.Sheets[sheet];
}

export async function ExtractVersion(document?: Document, cache?: CacheOptions): Promise<number> {
  const ws: WorkSheet = await LoadWorkSheet('Main', document, cache);
  return ws[cells.version].v;
}

export async function SkillList(skill_sheets: SkillSheets = {}) {
  const skill_list = {};
  for (const sheet in skill_sheets) {
    console.log('Loading:', sheet);
    const [columns, start_row] = skill_sheets[sheet];
    const ws: WorkSheet = await LoadWorkSheet(sheet);
    ws.name = sheet;
    const skills = ReadSkills(ws, columns, start_row);
    Object.assign(skill_list, skills);
  }

  return skill_list;
}

export async function SaveAllSkills() {
  const skill_sheets: SkillSheets = {
    "Blue": [{ 'S-A': 'C', 'B-C': 'D', 'D-E-F': 'E', 'G': 'F', aptitude: 'G' }],
    "Gold": [{ 'S-A': 'C', 'B-C': 'D', 'D-E-F': 'E', 'G': 'F', aptitude: 'G' }],
    "Green": [{ 'S-A': 'C', 'B-C': 'D', 'D-E-F': 'E', 'G': 'F', aptitude: 'G' }],
    "Purple": [],
    "Red": [{ 'S-A': 'C', 'B-C': 'D', 'D-E-F': 'E', 'G': 'F', aptitude: 'G' }, 3],
    "Yellow": [{ 'S-A': 'C', 'B-C': 'D', 'D-E-F': 'E', 'G': 'F', aptitude: 'G' }]
  };
  const skill_list = await SkillList(skill_sheets);

  const inherited_skill_sheet: SkillSheets = {
    "Inherited Unique Skill": [{ umamusume: 'C' }]
  };
  const inherited_skill_list = await SkillList(inherited_skill_sheet);
  Object.entries(inherited_skill_list)
    .forEach(([skill, value]: [skill: string, value: any]) => {
      if (value.rarity === 'unique' && (recovery as Record<string, any>)[skill]?.["rarity"]! === 'unique') {
        inherited_skill_list[skill].category = 'recovery';
      }
    });

  Object.assign(skill_list, inherited_skill_list);

  await WriteFile(`./data/skills.json`, JSON.stringify(skill_list, null, 2), { encoding: 'utf8' });
}
