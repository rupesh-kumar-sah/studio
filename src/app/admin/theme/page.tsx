
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Palette, Check } from 'lucide-react';

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0, s = 0, l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}


export default function AdminThemePage() {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  
  const [primaryColor, setPrimaryColor] = useState('#22c55e');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [accentColor, setAccentColor] = useState('#f1f5f9');
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const root = document.documentElement;
    const primary = getComputedStyle(root).getPropertyValue('--primary').trim();
    const background = getComputedStyle(root).getPropertyValue('--background').trim();
    const accent = getComputedStyle(root).getPropertyValue('--accent').trim();

    if (primary) setPrimaryColor(hslToHex(...primary.split(' ').map(parseFloat)));
    if (background) setBackgroundColor(hslToHex(...background.split(' ').map(parseFloat)));
    if (accent) setAccentColor(hslToHex(...accent.split(' ').map(parseFloat)));

    const savedTheme = localStorage.getItem('storeTheme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--background', theme.background);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--muted', theme.accent);
        root.style.setProperty('--secondary', theme.accent);
        root.style.setProperty('--ring', theme.ring);
        
        setPrimaryColor(hslToHex(...theme.primary.split(' ').map(parseFloat)));
        setBackgroundColor(hslToHex(...theme.background.split(' ').map(parseFloat)));
        setAccentColor(hslToHex(...theme.accent.split(' ').map(parseFloat)));
      } catch (error) {
        console.error("Failed to parse theme from localStorage", error);
      }
    }
  }, [isMounted]);

  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
    const [h, s, l] = hexToHsl(e.target.value);
    document.documentElement.style.setProperty('--primary', `${h} ${s}% ${l}%`);
    document.documentElement.style.setProperty('--ring', `${h} ${s}% ${l}%`);
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(e.target.value);
    const [h, s, l] = hexToHsl(e.target.value);
    document.documentElement.style.setProperty('--background', `${h} ${s}% ${l}%`);
  };
  
  const handleAccentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccentColor(e.target.value);
    const [h, s, l] = hexToHsl(e.target.value);
    document.documentElement.style.setProperty('--accent', `${h} ${s}% ${l}%`);
    document.documentElement.style.setProperty('--muted', `${h} ${s}% ${l}%`);
    document.documentElement.style.setProperty('--secondary', `${h} ${s}% ${l}%`);
  };

  const handleSaveTheme = () => {
    const root = document.documentElement;
    const newTheme = {
      primary: root.style.getPropertyValue('--primary'),
      background: root.style.getPropertyValue('--background'),
      accent: root.style.getPropertyValue('--accent'),
      ring: root.style.getPropertyValue('--ring'),
    };
    
    localStorage.setItem('storeTheme', JSON.stringify(newTheme));

    toast({
      title: 'Theme Saved',
      description: 'Your new theme has been applied and saved.',
    });
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
        <Button onClick={handleSaveTheme}>
          <Check className="mr-2 h-4 w-4" />
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
                onChange={handlePrimaryChange}
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
                onChange={handleBackgroundChange}
                className="color-picker"
              />
            </div>
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="accent-color" className="text-lg">Accent Color</Label>
            <div className="flex items-center gap-4">
               <span>{accentColor}</span>
              <input 
                id="accent-color" 
                type="color" 
                value={accentColor}
                onChange={handleAccentChange}
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
