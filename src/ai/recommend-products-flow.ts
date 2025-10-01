
'use server';
/**
 * @fileOverview Product recommendation flow.
 *
 * - recommendProducts - A function that handles product recommendations.
 * - RecommendProductsInput - The input type for the recommendProducts function.
 * - RecommendProductsOutput - The return type for the recommendProducts function.
 */

import { ai } from '@/ai/genkit';
import { getProducts } from '@/app/actions/product-actions';
import { z } from 'zod';

const RecommendProductsInputSchema = z.object({
  viewedProductNames: z
    .array(z.string())
    .describe('An array of product names the user has recently viewed.'),
});
export type RecommendProductsInput = z.infer<
  typeof RecommendProductsInputSchema
>;

const RecommendProductsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      name: z.string().describe('The name of the recommended product.'),
      reason: z.string().describe('A short reason for the recommendation.'),
    })
  ),
});
export type RecommendProductsOutput = z.infer<
  typeof RecommendProductsOutputSchema
>;

export async function recommendProducts(
  input: RecommendProductsInput
): Promise<RecommendProductsOutput> {
  return recommendProductsFlow(input);
}

const recommendProductsFlow = ai.defineFlow(
  {
    name: 'recommendProductsFlow',
    inputSchema: RecommendProductsInputSchema,
    outputSchema: RecommendProductsOutputSchema,
  },
  async ({ viewedProductNames }) => {
    const allProducts = await getProducts();
    const allProductNames = allProducts.map(p => p.name);

    const prompt = ai.definePrompt({
      name: 'recommendProductsPrompt',
      prompt: `You are a helpful e-commerce assistant for Nepal E-Mart.
A user has recently viewed the following products:
{{#each viewedProductNames}}- {{{this}}}
{{/each}}

Here is a list of all available products:
{{#each allProductNames}}- {{{this}}}
{{/each}}

Based on their viewing history and the available products, recommend 3 other products they might like. Do not recommend products they have already viewed. Provide a short, compelling reason for each recommendation.`,
      input: {
        schema: z.object({
          viewedProductNames: z.array(z.string()),
          allProductNames: z.array(z.string()),
        }),
      },
      output: {
        schema: RecommendProductsOutputSchema,
      },
    });

    const { output } = await prompt({
      viewedProductNames,
      allProductNames,
    });

    return output!;
  }
);
