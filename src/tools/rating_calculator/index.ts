import { inputSchema, outputSchema } from './schema';
import { rating_calculator } from './rating_calculator';

// export const disabled : boolean = true;

export const name = 'rating_calculator';

export const tool = {
  title: 'Rating Calculator',
  description: 'Calculate the rating of the umamusume before the end of the career run.',
  inputSchema,
  outputSchema
};

export function callback(input: any) {
  const structuredContent = rating_calculator(input);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        content: [{
          type: 'text',
          text: JSON.stringify(structuredContent)
        }],
        structuredContent,
      })
    }],
    structuredContent,
  };
}
