'use server';

import genkit from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/google-genai';

let ai: ReturnType<typeof genkit> | null = null;

export function getAi() {
  if (ai) {
    return ai;
  }

  ai = genkit({
    plugins: [
      googleAI({
        apiVersion: 'v1beta',
      }),
    ],
    logLevel: 'debug',
    enableTracingAndMetrics: true,
  });

  return ai;
}
