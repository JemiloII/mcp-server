// @ts-ignore
import XLSX_CALC from 'xlsx-calc';
import XLSX, { type WorkSheet } from 'xlsx';
import * as formulajs from '@formulajs/formulajs';
import fs from 'node:fs';
import { cleanOutput, findChampionsMeetingByName, getChampionsMeeting } from '../shared/champions_meeting';
import { fileURLToPath } from 'node:url';
import type { Aptitude, Row } from './types';
import { adjusted_stats, aptitudes, mood, output, race, rushing_rate, stats, style } from './data/cells.json';

const MASTER_BUFFER = fs.readFileSync(fileURLToPath(new URL('./data/stamina_calculator.xlsx', import.meta.url)));
XLSX_CALC.import_functions({
  ...formulajs,
  ...Object.fromEntries(Object.keys(formulajs).map(k => [ k.toLowerCase(), (formulajs as any)[k] ]))
});

function AdjustedStats(ws: WorkSheet) {
  return Object.fromEntries(Object.entries(adjusted_stats).map(([ stat, cell ]) => [ stat, Math.round(ws[cell].v) ]));
}

function BestStyleAptitude(input: Row): string {
  const ORDER: Aptitude[] = [ 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G' ];
  const orderIndex = new Map(ORDER.map((v, i) => [ v, i ]));
  const entries: Array<[ keyof Row, Aptitude ]> = [
    [ 'front', input.front ?? 'A' ],
    [ 'pace', input.pace ?? 'A' ],
    [ 'late', input.late ?? 'A' ],
    [ 'end', input.end ?? 'A' ],
  ];
  const [ bestStyle ] = entries.sort(([ , a ], [ , b ]) => (orderIndex.get(a) ?? 99) - (orderIndex.get(b) ?? 99))[0];
  return bestStyle.charAt(0).toUpperCase() + bestStyle.slice(1);
}

function BulkUpdate(ws: WorkSheet, cells: Record<any, any>, input: any, fallback: any): void {
  Object.entries(cells).forEach(([ stat, cell ]: [ stat: string, cell: string ]) => ws[cell].v = input[stat] ?? fallback);
}

export function StaminaCalculator(input: any) {
  const wb = XLSX.read(MASTER_BUFFER, { type: 'buffer', cellFormula: true });
  const ws = wb.Sheets['入力_出力'];

  // Set Initial Rushing Rate
  ws[rushing_rate].v = 1;

  // Set Required Inputs
  BulkUpdate(ws, stats, input, 0);
  BulkUpdate(ws, aptitudes, input, 'A');

  // Set Optional Inputs
  ws[mood].v = input.mood ?? 'Awful';
  ws[style].v = input.style ?? BestStyleAptitude(input);

  let race_info = input.race ?? getChampionsMeeting();
  if (input.race?.name) {
    race_info = findChampionsMeetingByName(input.race.name);
  }

  if (input.race?.surface && input.race?.distance && input.race?.condition) {
    race_info.name = 'Custom Cup';
  }

  // Race Info Defaults to Virgo Cup 2025-11-16
  ws[race.surface].v = race_info?.surface ?? 'Turf';
  ws[race.distance].v = race_info?.distance ?? 1600;
  ws[race.condition].v = race_info?.condition ?? 'Firm';

  XLSX_CALC(wb);

  const message = ws[output.status].v.replace('！', '!');

  // Set Rushing Rate to 0
  ws[rushing_rate].v = 0;
  XLSX_CALC(wb);
  const not_rushed_message = ws[output.status].v.replace('！', '!');
  const not_rushed_stamina_needed = ws[output.stamina_needed].v;

  // Set Rushing Rate to 1
  ws[rushing_rate].v = 1;
  XLSX_CALC(wb);

  const result = {
    message,
    not_rushed_message,
    stamina_adjusted: Math.round(ws[adjusted_stats.stamina].v),
    stamina_needed: Math.round(ws[output.stamina_needed].v),
    not_rushed_stamina_needed,
    style: ws[style].v,
    adjusted_stats: AdjustedStats(ws),
    race: {
      name: race_info.name,
      ...Object.fromEntries(
        Object.entries(race).filter(([ key ]) => key !== 'name').map(([ key, cell ]) => [ key, ws[cell].v ])
      )
    },
  };

  if (race_info.name !== 'Custom Cup') {
    result.race = cleanOutput(race_info);
  }

  return result;
}
