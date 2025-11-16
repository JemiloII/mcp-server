import { z } from 'zod';

export const inputSchema = z.object({
  speed: z.number().min(0),
  stamina: z.number().min(0),
  power: z.number().min(0),
  guts: z.number().min(0),
  wit: z.number().min(0),
  turf: z.enum(['S','A','B','C','D','E','F','G']).default('A'),
  dirt: z.enum(['S','A','B','C','D','E','F','G']).default('A'),
  sprint: z.enum(['S','A','B','C','D','E','F','G']).default('A'),
  mile: z.enum(['S','A','B','C','D','E','F','G']).default('A'),
  medium: z.enum(['S','A','B','C','D','E','F','G']).default('A'),
  long: z.enum(['S','A','B','C','D','E','F','G']).default('A'),
  front: z.enum(['S','A','B','C','D','E','F','G']).default('A'),
  pace: z.enum(['S','A','B','C','D','E','F','G']).default('A'),
  late: z.enum(['S','A','B','C','D','E','F','G']).default('A'),
  end: z.enum(['S','A','B','C','D','E','F','G']).default('A'),
  mood: z.enum(['Great', 'Good', 'Normal', 'Bad', 'Awful']).default('Awful').optional(),
  style: z.enum(['Front', 'Pace', 'Late', 'End']).optional().describe('User-specified running style (Front/Pace/Late/End). Do not infer or fill automatically - only use if user explicitly provides this value.'),
  race: z.object({
    name: z.string().optional().describe('Only fill in this field if a Champions Meeting name is given.'),
    surface: z.enum(['Turf', 'Dirt']).optional().describe('Do not fill this field in if a Champions Meeting name is given.'),
    distance: z.number().min(1000).max(3600).optional().describe('Do not fill this field in if a Champions Meeting name is given.'),
    condition: z.enum(['Firm', 'Good', 'Soft', 'Heavy']).optional().describe('Do not fill this field in if a Champions Meeting name is given.')
  }).optional().describe('Do not fill in race fields unless the user requests for it.')
});

export const outputSchema = z.object({
  message: z.string(),
  not_rushed_message: z.string(),
  stamina_adjusted: z.number(),
  stamina_needed: z.number(),
  style: z.string(),
  adjusted_stats: z.object({
    speed: z.number(),
    stamina: z.number(),
    power: z.number(),
    guts: z.number(),
    wit: z.number()
  }),
  race: z.object({
    name: z.string(),
    surface: z.string(),
    distance: z.number(),
    condition: z.string(),
    category: z.string()
  }).passthrough()
});
