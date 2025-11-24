import { CronJob } from 'cron';
import { inputSchema, outputSchema } from './schema';
import { rating_calculator } from './rating_calculator';
import { CheckAndUpdateData } from './update';

export const name = 'rating_calculator';

export const tool = {
  title: 'Rating Calculator',
  description: 'Calculate the rating of the umamusume before the end of the career run. Be critical about each stat collected from the image. If a value is incorrect, the rating will be wrong. Validate each stat you collect one at a time. Always list the processed skills so the user can verify that the result is correct.',
  inputSchema,
  outputSchema
};

export async function callback(input: any) {
  const structuredContent = await rating_calculator(input);
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

// Check for update on start
await CheckAndUpdateData();

// Auto Update
(new CronJob('0 0 * * *', async () => {
  console.log('Checking for updates to Rating Calculator data...');
  await CheckAndUpdateData();
})).start();
