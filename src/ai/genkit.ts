'use server';

import genkit from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/google-genai';

let ai: any = null;

export function getAi() {
  if (ai) {
    return ai;
  }

  ai = (genkit as any)({
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
