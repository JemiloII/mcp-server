import { z } from 'zod';

export const inputSchema = z.object({
  speed: z.number().min(0),
  stamina: z.number().min(0),
  power: z.number().min(0),
  guts: z.number().min(0),
  wit: z.number().min(0),
  turf: z.enum(['S','A','B','C','D','E','F','G']),
  dirt: z.enum(['S','A','B','C','D','E','F','G']),
  sprint: z.enum(['S','A','B','C','D','E','F','G']),
  mile: z.enum(['S','A','B','C','D','E','F','G']),
  medium: z.enum(['S','A','B','C','D','E','F','G']),
  long: z.enum(['S','A','B','C','D','E','F','G']),
  front: z.enum(['S','A','B','C','D','E','F','G']),
  pace: z.enum(['S','A','B','C','D','E','F','G']),
  late: z.enum(['S','A','B','C','D','E','F','G']),
  end: z.enum(['S','A','B','C','D','E','F','G']),
  mood: z.enum(['Great', 'Good', 'Normal', 'Bad', 'Awful']).default('Awful').optional(),
  style: z.enum(['Front', 'Pace', 'Late', 'End']).optional(),
  race: z.object({
    name: z.string().optional(),
    surface: z.enum(['Turf', 'Dirt']).optional(),
    distance: z.number().min(1000).max(3600).optional(),
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
