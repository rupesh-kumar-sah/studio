'use server';

/**
 * @fileOverview Recommends products based on user viewing history.
 *
 * - getProductRecommendations - A function that recommends products based on viewing history.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  viewingHistory: z.array(
    z.string().describe('The IDs of products the user has viewed.')
  ).describe('The user viewing history as an array of product IDs.'),
  boostPopularity: z.number().optional().describe('Factor to boost the popularity of frequently viewed items. Higher values will make popular products more likely to be recommended.'),
  boostRecency: z.number().optional().describe('Factor to boost recently viewed items. Higher values will make recent products more likely to be recommended.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z.array(
    z.string().describe('The IDs of recommended products.')
  ).describe('An array of product IDs recommended to the user.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an expert product recommendation system. Given a user's viewing history, recommend products they might be interested in.

Viewing History: {{#each viewingHistory}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

{{#if boostPopularity}}
Consider boosting the popularity of frequently viewed items by a factor of {{boostPopularity}}.
{{/if}}

{{#if boostRecency}}
Consider boosting recently viewed items by a factor of {{boostRecency}}.
{{/if}}

Based on this viewing history, recommend a list of product IDs.  Only return a JSON array of product IDs.
Make sure the response can be parsed as a JSON array of strings. Do not include any other text.
`, // Changed to request JSON array
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationsPrompt(input);
    return output!;
  }
);
