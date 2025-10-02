'use server';

import { Genkit, genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/google-genai';

let ai: Genkit;

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
