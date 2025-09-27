
'use client';

import { useState, useEffect } from 'react';
import type { PageContent } from '@/lib/types';
import allPagesData from '@/lib/page-content.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updatePageContent } from '@/app/actions/page-actions';
import { Loader2, FileText, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPagesPage() {
    const [pages, setPages] = useState<PageContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // Simulate fetching from a database or CMS
        const storedPages = localStorage.getItem('pageContents');
        if (storedPages) {
            setPages(JSON.parse(storedPages));
        } else {
            setPages(allPagesData.pages);
            localStorage.setItem('pageContents', JSON.stringify(allPagesData.pages));
        }
        setLoading(false);
    }, []);

    const handleContentChange = (slug: string, field: keyof PageContent | 'content', value: any) => {
        setPages(currentPages =>
            currentPages.map(page => {
                if (page.slug === slug) {
                    if (field === 'content') {
                        return { ...page, content: JSON.parse(value) };
                    }
                    return { ...page, [field]: value };
                }
                return page;
            })
        );
    };

    const handleSave = async (slug: string) => {
        setIsSaving(true);
        const pageToSave = pages.find(p => p.slug === slug);
        if (pageToSave) {
            // This is a mock server action for the prototype
            const result = await updatePageContent(slug, pageToSave);

            if (result.success) {
                // In the prototype, we rely on localStorage for persistence
                localStorage.setItem('pageContents', JSON.stringify(pages));
                window.dispatchEvent(new CustomEvent('page-content-updated'));
                toast({
                    title: "Page Updated",
                    description: `The content for "${pageToSave.title}" has been saved.`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: "Save Failed",
                    description: "Could not save page content.",
                });
            }
        }
        setIsSaving(false);
    };
    
    if (loading) {
        return (
             <div className="p-4 sm:p-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Loading page editors...</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Manage Page Content</h1>
                <p className="text-muted-foreground">Edit the content of your store's informational pages.</p>
            </div>

            <Tabs defaultValue={pages[0]?.slug || ''} className="w-full">
                <TabsList>
                    {pages.map(page => (
                        <TabsTrigger key={page.slug} value={page.slug}>{page.title}</TabsTrigger>
                    ))}
                </TabsList>
                {pages.map(page => (
                    <TabsContent key={page.slug} value={page.slug}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <FileText />
                                  Editing: {page.title}
                                </CardTitle>
                                <CardDescription>
                                    Changes made here will be reflected on the public-facing page.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor={`title-${page.slug}`}>Page Title</Label>
                                    <Input
                                        id={`title-${page.slug}`}
                                        value={page.title}
                                        onChange={(e) => handleContentChange(page.slug, 'title', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`description-${page.slug}`}>Page Subtitle/Description</Label>
                                    <Textarea
                                        id={`description-${page.slug}`}
                                        value={page.description}
                                        onChange={(e) => handleContentChange(page.slug, 'description', e.target.value)}
                                    />
                               - </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`content-${page.slug}`}>Page Content (JSON)</Label>
                                     <Textarea
                                        id={`content-${page.slug}`}
                                        value={JSON.stringify(page.content, null, 2)}
                                        onChange={(e) => handleContentChange(page.slug, 'content', e.target.value)}
                                        rows={20}
                                        className="font-mono text-xs"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Warning: Editing this directly can break the page if the JSON is not valid.
                                    </p>
                                </div>
                                <div>
                                    <Button onClick={() => handleSave(page.slug)} disabled={isSaving}>
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
