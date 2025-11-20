import { z } from 'zod';

export const inputSchema = z.object({
  speed: z.number().min(0),
  stamina: z.number().min(0),
  power: z.number().min(0),
  guts: z.number().min(0),
  wit: z.number().min(0),
  turf: z.enum([ 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]).default('A'),
  dirt: z.enum([ 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]).default('A'),
  sprint: z.enum([ 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]).default('A'),
  mile: z.enum([ 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]).default('A'),
  medium: z.enum([ 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]).default('A'),
  long: z.enum([ 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]).default('A'),
  front: z.enum([ 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]).default('A'),
  pace: z.enum([ 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]).default('A'),
  late: z.enum([ 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]).default('A'),
  end: z.enum([ 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]).default('A'),
  umamusume: z.string(),
  uma_star_level: z.number().min(1).max(5),
  unique_skill_level: z.number().min(1).max(6),
  skills: z.array(z.string()),
  output_raw: z.boolean().default(false).optional(),
});

export const outputSchema = z.object({
  rating: z.enum([ 'SS+', 'SS', 'S+', 'S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E+', 'E', 'F+', 'F', 'G+', 'G' ]),
  total_score: z.number(),
  next_rank: z.number(),
  raw: z.object({}).passthrough().optional()
});
