import { z } from 'zod';

const gradeEnum = z.enum(['S','A','B','C','D','E','F','G']);

export const inputSchema = z.object({
  speed: z.number(),
  stamina: z.number(),
  power: z.number(),
  guts: z.number(),
  wit: z.number(),
  turf: gradeEnum,
  dirt: gradeEnum,
  sprint: gradeEnum,
  mile: gradeEnum,
  medium: gradeEnum,
  long: gradeEnum,
  front: gradeEnum,
  pace: gradeEnum,
  late: gradeEnum,
  end: gradeEnum,
  mood: z.enum(['Great', 'Good', 'Normal', 'Bad', 'Awful']).default('Awful').optional(),
  style: z.enum(['Front', 'Pace', 'Late', 'End']).optional(),
  race: z.object({
    name: z.string().optional(),
    surface: z.enum(['Turf', 'Dirt']).optional(),
    distance: z.number().optional(),
    condition: z.enum(['Firm', 'Good', 'Soft', 'Heavy']).optional()
  }).optional()
});

export const outputSchema = z.object({
  message: z.string(),
  not_rushed_message: z.union([z.string(), z.number()]),
  stamina_adjusted: z.number(),
  stamina_needed: z.number(),
  style: z.string(),
  adjusted_stats: z.object({
    speed: z.number(),
    stamina: z.number(),
    power: z.number(),
    guts: z.number(),
    wisdom: z.number()
  }),
  race: z.object({
    name: z.string(),
    surface: z.string(),
    distance: z.number(),
    condition: z.string(),
    category: z.string()
  })
});
