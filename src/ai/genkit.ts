'use server';

import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/google-genai';

// Using a type assertion since Genkit isn't a named export
let ai: ReturnType<typeof genkit>;

export function getAi() {
  if (!ai) {
    ai = genkit({
      plugins: [
        googleAI({
          apiVersion: 'v1beta',
        }),
      ],
      logLevel: 'debug',
      enableTracingAndMetrics: true,
    });
  }
  return ai;
}
