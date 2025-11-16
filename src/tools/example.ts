import { z } from 'zod';

export const name = 'stamina_calculate';
export const tool = {
  title: 'Umamusume Stamina Calculator',
  description: 'Compute stamina from inputs.',
  inputSchema: { speed: z.number() },
  outputSchema: { result: z.number() }
};

export function callback(inputs: any) {
  try {
    const result = inputs.speed * 2;
    const output = { result };
    const response = {
      content: [ {
        type: 'text',
        text: JSON.stringify(output)
      } ],
      structuredContent: output
    };
    console.log('Response:', response);
    return response;
  } catch (e) {
    console.error('GOT MCP ERROR', e);
    throw e;
  }
}
