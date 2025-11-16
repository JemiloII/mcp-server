import { inputSchema, outputSchema } from './schema';
import { StaminaCalculator } from './stamina_calculator';

export const name = 'validate_stamina';
export const tool = {
  title: 'Validate Stamina',
  description: 'Validate that your Umamusume has enough stamina for a Champions Meeting Cup.',
  inputSchema: inputSchema,
  outputSchema: outputSchema,
};

export function callback(inputs: any) {
  const result = StaminaCalculator(inputs);

  return {
    content: [ {
      type: 'text',
      text: JSON.stringify(result)
    } ],
    structuredContent: result
  }
}
