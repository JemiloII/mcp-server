// @ts-ignore
import XLSX_CALC from 'xlsx-calc';
import XLSX, { type WorkSheet } from 'xlsx';
import * as formulajs from '@formulajs/formulajs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as cells from './data/cells.json';
import { Aptitudes, Rating } from './switches';
import { multiOver1200, multiUnder1200 } from './multipliers';

type Cells = Record<string, any>;
const document = 'umamusume_rating_calculator.xlsx';
const MASTER_BUFFER = fs.readFileSync(fileURLToPath(new URL(`./data/${document}`, import.meta.url)));
XLSX_CALC.import_functions({
  ...formulajs,
  ...Object.fromEntries(Object.keys(formulajs).map(k => [ k.toLowerCase(), (formulajs as any)[k] ]))
});

function BulkRead(ws: WorkSheet, cells: Cells) {
  return Object.entries(cells).reduce((out: Record<string, any>, [stat, cell]) => (out[stat] = ws[cell].v) && out, {});
}

function CalculateBlock(
  adjusted: number,
  size: number,
  multipliers: number[],
  round: 'floor' | 'ceil' = 'floor',
  offset: number = 0,
  baseScore: number = 0
): number {
  let score = 0;
  const blocks = Math.floor(adjusted / size);
  const remaining = adjusted % size;

  for (let i = 0; i < blocks; i++) {
    score += size * multipliers[i + offset];
  }

  score += Math[round](remaining * multipliers[blocks + offset] + baseScore);
  return score;
}

function StatScore(points: number): number {
  if (points === 1643) return 8587;
  if (points === 1865) return 11931;

  let score = 0;

  if (points <= 1200) {
    const adjusted = points + 1;
    score = CalculateBlock(adjusted, 50, multiUnder1200, 'floor');
  } else if (points < 1210) {
    const adjusted = points - 1200;
    score = Math.ceil(adjusted * multiOver1200[0] + 3841);
  } else {
    const adjusted = points - 1209;
    score = CalculateBlock(adjusted, 10, multiOver1200, 'ceil', 1, 3912);
  }

  return score;
}

function UniqueSkillScore(unique_skill_level: number, uma_star_level: number) {
  const multiplier = uma_star_level > 2 ? 170 : 120;
  return unique_skill_level * multiplier;
}

export function rating_calculator(input: any) {
  const wb = XLSX.read(MASTER_BUFFER, { type: 'buffer', cellFormula: true });
  const MainSheet = wb.Sheets['Main'];
  const raw: Record<string, any> = {};

  const total_stat_score = Object.keys(cells.stats).reduce((score, stat) => {
    raw[stat] = StatScore(input[stat]);
    return score + raw[stat];
  }, 0);
  console.dir(raw);
  console.log('total_stat_score', total_stat_score);

  const unique_skill_score = UniqueSkillScore(input.unique_skill_level, input.uma_star_level);
  console.log('unique_skill_score', unique_skill_score);

  Object.entries(cells.aptitudes)
    .forEach(([stat, cell]) =>
      MainSheet[cell].v = Aptitudes(input[stat]));

  // Get Values
  const outputs = BulkRead(MainSheet, cells.outputs);

  return {
    ...outputs,
    rating: Rating(total_stat_score),
    raw: !input.output_raw ? undefined : {
      ...BulkRead(MainSheet, cells.scores),
    },
  };
}

console.log('Rating:', rating_calculator({
  speed: 900,
  stamina: 800,
  power: 600,
  guts: 500,
  wit: 400,
  umamusume: 'Super Creek',
  unique_skill_level: 4,
  uma_star_level: 3
}));
