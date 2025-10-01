
'use server';

import fs from 'fs/promises';
import path from 'path';

// Path to the global CSS file
const cssFilePath = path.join(process.cwd(), 'src', 'app', 'globals.css');

/**
 * Updates the theme by overwriting the contents of globals.css.
 */
export async function updateTheme(cssContent: string): Promise<{ success: boolean; message?: string }> {
  try {
    await fs.writeFile(cssFilePath, cssContent, 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Error writing theme to globals.css:', error);
    return { success: false, message: 'Failed to write to CSS file.' };
  }
}

    
