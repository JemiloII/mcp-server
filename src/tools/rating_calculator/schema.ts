import { z, ZodEnum } from 'zod';
import skills from './data/skills.json';

const special = '=-!,☆∴∞;#/♪(ﾟ∀ﾟ)♡○◎×';
const characters = new Set();
Object.entries(skills).forEach(([name, skill]: [name: string, skill: any]) => {
  if (skill.rarity === 'unique') {
    characters.add(skill.umamusume.replace(/\s\(.*\)/, ''));
  }
});

const describeAptitude = (aptitude: string) =>
  `Rank for ${aptitude} Aptitude. Be critical about the rank letter and make sure it is correct!`;

const Ranks: readonly [ string, ...string[] ] = [ 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G' ];

export const inputSchema = z.object({
  speed: z.number().min(0),
  stamina: z.number().min(0),
  power: z.number().min(0),
  guts: z.number().min(0),
  wit: z.number().min(0),
  turf: z.enum(Ranks).default('A').describe(describeAptitude('Turf')),
  dirt: z.enum(Ranks).default('A').describe(describeAptitude('Dirt')),
  sprint: z.enum(Ranks).default('A').describe(describeAptitude('Sprint')),
  mile: z.enum(Ranks).default('A').describe(describeAptitude('Mile')),
  medium: z.enum(Ranks).default('A').describe(describeAptitude('Medium')),
  long: z.enum(Ranks).default('A').describe(describeAptitude('Long')),
  front: z.enum(Ranks).default('A').describe(describeAptitude('Front')),
  pace: z.enum(Ranks).default('A').describe(describeAptitude('Pace')),
  late: z.enum(Ranks).default('A').describe(describeAptitude('Late')),
  end: z.enum(Ranks).default('A').describe(describeAptitude('End')),
  umamusume: z.enum(Array.from(characters) as unknown as readonly [ string, ...string[] ]).describe('Name of the Umamusume. Epithet is not a name, characters within brackets [] are not a name.'),
  uma_star_level: z.number().min(1).max(5).describe('This is the total number of yellow overlapping stars under the umamusume icon. Ask the user if you get confused.'),
  unique_skill_level: z.number().min(1).max(6).describe('This is the Lvl # that you see on the first skill in the list.'),
  skills: z.array(z.string()).describe(`Array of skill names and requires at least 1 skill. Make sure to include special characters when you see them. Special Characters: "${special}". Do not include skill level in the skill list name. The follow is an example and not a pattern: ["Victoria por plancha ☆", "Right-Handed ◎", "OMG! (ﾟ∀ﾟ) The Final Sprint! ☆", "Breath of Fresh Air"]`),
  output_raw: z.boolean().default(false).optional(),
});

export const outputSchema = z.object({
  rating: z.enum([ 'SS+', 'SS', 'S+', 'S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E+', 'E', 'F+', 'F', 'G+', 'G' ]).describe('Always show. This is the Rating Letter.'),
  total_score: z.number().describe('Always show. This is the rating score.'),
  next_rank: z.number(),
  raw: z.object({}).passthrough().optional().describe('Contains values that contributed to the total_score.')
});
