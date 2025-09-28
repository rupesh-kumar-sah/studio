
'use server';

/**
 * @fileOverview A flow for handling the "forgot password" process.
 *
 * - generatePasswordResetCode - Generates a 6-digit reset code and email content.
 * - ForgotPasswordInput - The input type for the flow.
 * - ForgotPasswordOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ForgotPasswordInputSchema = z.object({
  email: z.string().email().describe('The email address of the user requesting a password reset.'),
});
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordInputSchema>;

const ForgotPasswordOutputSchema = z.object({
  resetCode: z.string().length(6).describe('A 6-digit password reset code.'),
  emailSubject: z.string().describe('The subject line for the password reset email.'),
  emailBody: z.string().describe('The HTML body content for the password reset email.'),
});
export type ForgotPasswordOutput = z.infer<typeof ForgotPasswordOutputSchema>;

// Helper function to generate a random 6-digit code
function createRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function generatePasswordResetCode(input: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
  return forgotPasswordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forgotPasswordPrompt',
  input: {
    schema: z.object({
      email: z.string(),
      resetCode: z.string(),
    }),
  },
  output: {
    schema: z.object({
      emailSubject: z.string(),
      emailBody: z.string(),
    }),
  },
  prompt: `You are a helpful assistant for an e-commerce store called "Nepal eMart".
A user with the email "{{email}}" has requested a password reset.

Their temporary, one-time password reset code is: {{resetCode}}

Generate a user-friendly and professional email to send to them.
The email body should be in HTML format.
The subject line should be clear, like "Your Nepal eMart Password Reset Code".
The email body should state that they requested a password reset, clearly present the reset code, mention that the code is temporary, and instruct them to go back to the site to enter the code.
Do not include any placeholder links, just text.
`,
});

const forgotPasswordFlow = ai.defineFlow(
  {
    name: 'forgotPasswordFlow',
    inputSchema: ForgotPasswordInputSchema,
    outputSchema: ForgotPasswordOutputSchema,
  },
  async (input) => {
    const resetCode = createRandomCode();

    const { output } = await prompt({
      email: input.email,
      resetCode: resetCode,
    });

    if (!output) {
      // Fallback in case the AI fails
      return {
        resetCode,
        emailSubject: 'Your Password Reset Code',
        emailBody: `<p>Your password reset code is: <strong>${resetCode}</strong></p>`,
      };
    }

    return {
      resetCode,
      ...output,
    };
  }
);
