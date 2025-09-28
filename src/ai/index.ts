
import { config } from 'dotenv';
config();

// This file is used to export all the Genkit flows that are needed for production.
// It is used by the `build` script in `package.json`.

import '@/ai/flows/product-recommendations-flow.ts';
import '@/ai/flows/forgot-password-flow.ts';
