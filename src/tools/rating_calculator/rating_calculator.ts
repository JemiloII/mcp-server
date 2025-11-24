import { Aptitudes, Rating, type RatingResult } from './switches';
import { multiOver1200, multiLess1200, stats } from './constants';
import { ReadFile } from './files';

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
    score = CalculateBlock(adjusted, 50, multiLess1200, 'floor');
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

export async function rating_calculator(input: any) {
  const raw: Record<string, any> = { skills: {} };
  const total_stat_score = stats.reduce((score, stat) => {
    raw[stat] = StatScore(input[stat]);
    return score + raw[stat];
  }, 0);
  console.dir(raw);
  console.log('total_stat_score', total_stat_score);

  const unique_skill_score = UniqueSkillScore(input.unique_skill_level, input.uma_star_level);
  raw.unique_skill = unique_skill_score;
  console.log('unique_skill_score', unique_skill_score);


  let total_skill_score = 0;
  // @ts-ignore
  const skills = JSON.parse(await ReadFile('./data/skills.json', { encoding: 'utf8' }));
  if (input.skills?.length > 0) {
    for (const skill of input.skills) {
      try {
        if (skills[skill].rarity === 'unique' && skills[skill].umamusume === input.umamusume) {
          continue;
        }

        if (skills[skill].aptitude) {
          const aptitude_group = Aptitudes(input[skills[skill].aptitude.toLowerCase()]);
          total_skill_score += skills[skill][aptitude_group];
          raw.skills[skill] = skills[skill][aptitude_group];
        } else {
          total_skill_score += skills[skill].base;
          raw.skills[skill] = skills[skill].base;
        }
      } catch (error) {
        throw `Invalid Skill Name: [${skill}] Is it missing symbols? [=-!,☆∴∞;#♪(ﾟ∀ﾟ)♡○◎×/]`;
      }
    }
  }

  const total_score = total_stat_score + unique_skill_score + total_skill_score;
  const { rating, next_rank }: RatingResult = Rating(total_score);

  return {
    total_score,
    rating,
    next_rank,
    raw: input.output_raw ? raw : undefined,
  };
}

// const test = {
//   'umamusume': 'El Condor Pasa',
//   'uma_star_level': 3,
//   'speed': 1200,
//   'stamina': 697,
//   'power': 799,
//   'guts': 349,
//   'wit': 436,
//   'unique_skill_level': 4,
//   'turf': 'A',
//   'dirt': 'B',
//   'sprint': 'F',
//   'mile': 'A',
//   'medium': 'A',
//   'long': 'A',
//   'front': 'D',
//   'pace': 'A',
//   'late': 'A',
//   'end': 'G',
//   'skills': [
//     'Victoria por plancha ☆',
//     'Right-Handed ◎',
//     'Fall Runner ◎',
//     'Beeline Burst',
//     'Breath of Fresh Air',
//     'Pace Chaser Straightaways ◎',
//     'Pace Chaser Corners ◎',
//   ],
//   output_raw: true
// }
//
// const rating = await rating_calculator(test);
// console.log('Rating:', rating);
