import { z } from 'zod';
import { cleanOutput, findChampionsMeetingByName, getChampionsMeetingByScope } from './shared/champions_meeting';

export const name = 'champions_meeting';

export const tool = {
  title: 'Champions Meeting',
  description: 'Get information on the current, previous, or next Champion Meeting. Support searching by name.',
  inputSchema: z.object({
    name: z.string().optional(),
    scope: z.enum(['previous', 'current', 'next']).default('current').optional(),
  }),
  outputSchema: z.object({
    name: z.string(),
    venue: z.string(),
    surface: z.enum(['Turf', 'Dirt']),
    distance: z.number(),
    category: z.enum(['Sprint', 'Mile', 'Medium', 'Long']),
    direction: z.enum(['Left', 'Right']),
    condition: z.enum(['Firm', 'Good', 'Soft', 'Heavy']),
    season: z.enum(['Fall', 'Winter', 'Spring', 'Summer']),
    weather: z.enum(['Sunny', 'Cloudy', 'Rain', 'Snow']),
  }).passthrough()
};

export function callback(input: any) {
  const { name, scope = 'current' } = input;
  const result = name
    ? findChampionsMeetingByName(name, { upcomingOnly: scope === 'next' })
    : getChampionsMeetingByScope(scope);

  const structuredContent = cleanOutput(result);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(structuredContent)
    }],
    structuredContent,
  }
}
