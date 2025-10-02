'use server';

import genkit from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/google-genai';

// This is the global AI object.
// We use a getter function to initialize it only once.
let ai: ReturnType<typeof genkit> | null = null;

export function getAi() {
  if (ai) {
    return ai;
  }

  // Initialize Genkit with the Google AI plugin.
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
