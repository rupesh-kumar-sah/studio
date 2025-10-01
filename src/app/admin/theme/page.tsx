
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Palette, Check, Loader2 } from 'lucide-react';
import convert from 'color-convert';
import { updateTheme } from '@/app/actions/theme-actions';

export default function AdminThemePage() {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [primaryColor, setPrimaryColor] = useState('#22c55e');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [accentColor, setAccentColor] = useState('#f1f5f9');
  
  // States for HSL values to be saved
  const [primaryHsl, setPrimaryHsl] = useState('142.1 76.2% 36.3%');
  const [backgroundHsl, setBackgroundHsl] = useState('0 0% 100%');
  const [accentHsl, setAccentHsl] = useState('210 40% 96.1%');
  
  useEffect(() => {
    setIsMounted(true);
    const root = document.documentElement;

    const getHslAndSetHex = (varName: string, setHex: (hex: string) => void, setHsl: (hsl: string) => void) => {
        const hslString = getComputedStyle(root).getPropertyValue(varName).trim();
        if (hslString) {
            const [h, s, l] = hslString.split(' ').map(val => parseFloat(val.replace('%', '')));
            if(!isNaN(h) && !isNaN(s) && !isNaN(l)) {
              setHsl(hslString);
              setHex(`#${convert.hsl.hex([h, s, l])}`);
            }
        }
    };
    
    getHslAndSetHex('--primary', setPrimaryColor, setPrimaryHsl);
    getHslAndSetHex('--background', setBackgroundColor, setBackgroundHsl);
    getHslAndSetHex('--accent', setAccentColor, setAccentHsl);

  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>, setColor: (hex: string) => void, setHsl: (hsl: string) => void, cssVar: string) => {
    const hex = e.target.value;
    setColor(hex);
    const [h, s, l] = convert.hex.hsl(hex);
    const hslString = `${h} ${s}% ${l}%`;
    setHsl(hslString);
    document.documentElement.style.setProperty(cssVar, hslString);
    
    if (cssVar === '--primary') {
        document.documentElement.style.setProperty('--ring', hslString);
    }
    if (cssVar === '--accent') {
        document.documentElement.style.setProperty('--muted', hslString);
        document.documentElement.style.setProperty('--secondary', hslString);
    }
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    const cssContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: ${backgroundHsl};
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: ${primaryHsl};
    --primary-foreground: 355.7 100% 97.3%;
    --secondary: ${accentHsl};
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: ${accentHsl};
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: ${accentHsl};
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: ${primaryHsl};
    --chart-1: 142.1, 76.2%, 36.3%;
    --chart-2: 160, 60%, 45%;
    --chart-3: 30, 80%, 55%;
    --chart-4: 280, 70%, 60%;
    --chart-5: 340, 85%, 65%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: ${primaryHsl};
    --primary-foreground: 355.7 100% 97.3%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215.4 16.3% 56.9%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: ${primaryHsl};
    --chart-1: 142.1, 76.2%, 36.3%;
    --chart-2: 160, 60%, 45%;
    --chart-3: 30, 80%, 55%;
    --chart-4: 280, 70%, 60%;
    --chart-5: 340, 85%, 65%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    scroll-padding-top: 4rem; /* 64px, height of the sticky header */
  }
}

@layer components {
  .color-picker {
    display: inline-block;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid hsl(var(--border));
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 0;
    background-color: transparent;
  }
  .color-picker::-webkit-color-swatch {
    border-radius: 50%;
    border: none;
  }
  .color-picker::-moz-color-swatch {
    border-radius: 50%;
    border: none;
  }
}
    `;

    const result = await updateTheme(cssContent);
    if (result.success) {
      toast({
        title: 'Theme Saved',
        description: 'Your new theme has been applied and saved.',
      });
    } else {
       toast({
        variant: 'destructive',
        title: 'Failed to Save Theme',
        description: 'There was an error saving your theme.',
      });
    }
    setIsSaving(false);
  };
  
  if (!isMounted) {
    return (
        <div className="p-4 sm:p-6 text-center">
            <p>Loading theme editor...</p>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theme Customizer</h1>
          <p className="text-muted-foreground">Change the look and feel of your storefront.</p>
        </div>
        <Button onClick={handleSaveTheme} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
          Save Theme
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-6 w-6" />
            Color Settings
          </CardTitle>
          <CardDescription>
            Choose the main colors for your website. Changes are applied live.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center justify-between">
            <Label htmlFor="primary-color" className="text-lg">Primary Color</Label>
            <div className="flex items-center gap-4">
              <span>{primaryColor}</span>
              <input 
                id="primary-color" 
                type="color" 
                value={primaryColor}
                onChange={(e) => handleColorChange(e, setPrimaryColor, setPrimaryHsl, '--primary')}
                className="color-picker"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="background-color" className="text-lg">Background Color</Label>
            <div className="flex items-center gap-4">
              <span>{backgroundColor}</span>
              <input 
                id="background-color" 
                type="color" 
                value={backgroundColor}
                onChange={(e) => handleColorChange(e, setBackgroundColor, setBackgroundHsl, '--background')}
                className="color-picker"
              />
            </div>
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="accent-color" className="text-lg">Accent Color</Label>
            <div className="flex items-center gap-4">
               <span>{accentColor}</span>
              <input _id="accent-color" 
                type="color" 
                value={accentColor}
                onChange={(e) => handleColorChange(e, setAccentColor, setAccentHsl, '--accent')}
                className="color-picker"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Live Preview</h2>
        <Card className="w-full">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Buttons</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button>Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="outline">Outline</Button>
                        </div>
                    </div>
                    <div className="space-y-4">
                         <h3 className="font-semibold text-lg">Card Example</h3>
                         <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Preview Card</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>This is a sample card to show the theme.</p>
                            </CardContent>
                         </Card>
                    </div>
                    <div className="space-y-4">
                         <h3 className="font-semibold text-lg">Accent Colors</h3>
                         <div className="p-4 bg-accent rounded-md">
                            <p className="text-accent-foreground">This uses the accent color.</p>
                         </div>
                          <div className="p-4 bg-muted rounded-md">
                            <p className="text-muted-foreground">This uses the muted color.</p>
                         </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}

    
