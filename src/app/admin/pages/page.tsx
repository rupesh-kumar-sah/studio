
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
import { Loader2, FileText, Check, PlusCircle, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function AdminPagesPage() {
    const [pages, setPages] = useState<PageContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const storedPages = localStorage.getItem('pageContents');
        if (storedPages) {
            setPages(JSON.parse(storedPages));
        } else {
            setPages(allPagesData.pages);
            localStorage.setItem('pageContents', JSON.stringify(allPagesData.pages));
        }
        setLoading(false);
    }, []);

    const handleFieldChange = (slug: string, field: keyof PageContent, value: any) => {
        setPages(currentPages =>
            currentPages.map(page => 
                page.slug === slug ? { ...page, [field]: value } : page
            )
        );
    };

    const handleFaqChange = (slug: string, index: number, field: 'question' | 'answer', value: string) => {
        setPages(currentPages =>
            currentPages.map(page => {
                if (page.slug === slug) {
                    const newFaqs = [...page.content.faqs];
                    newFaqs[index] = { ...newFaqs[index], [field]: value };
                    return { ...page, content: { ...page.content, faqs: newFaqs } };
                }
                return page;
            })
        );
    };

    const addFaq = (slug: string) => {
        setPages(currentPages =>
            currentPages.map(page => {
                if (page.slug === slug) {
                    const newFaqs = [...page.content.faqs, { question: 'New Question', answer: 'New Answer' }];
                    return { ...page, content: { ...page.content, faqs: newFaqs } };
                }
                return page;
            })
        );
    };
    
    const removeFaq = (slug: string, index: number) => {
        setPages(currentPages =>
            currentPages.map(page => {
                if (page.slug === slug) {
                    const newFaqs = page.content.faqs.filter((_: any, i: number) => i !== index);
                    return { ...page, content: { ...page.content, faqs: newFaqs } };
                }
                return page;
            })
        );
    };
    
    const handleJsonContentChange = (slug: string, value: string) => {
         setPages(currentPages =>
            currentPages.map(page => {
                if (page.slug === slug) {
                    try {
                        return { ...page, content: JSON.parse(value) };
                    } catch (e) {
                        toast({ variant: 'destructive', title: 'Invalid JSON', description: 'The content could not be saved due to invalid JSON format.' });
                        return page; // Return original page if JSON is invalid
                    }
                }
                return page;
            })
        );
    }


    const handleSave = async (slug: string) => {
        setIsSaving(true);
        const pageToSave = pages.find(p => p.slug === slug);
        if (pageToSave) {
            const result = await updatePageContent(slug, pageToSave);

            if (result.success) {
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
                                        onChange={(e) => handleFieldChange(page.slug, 'title', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`description-${page.slug}`}>Page Subtitle/Description</Label>
                                    <Textarea
                                        id={`description-${page.slug}`}
                                        value={page.description}
                                        onChange={(e) => handleFieldChange(page.slug, 'description', e.target.value)}
                                    />
                                </div>
                                
                                {page.slug === 'faq' ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-lg">FAQ Items</h3>
                                            <Button variant="outline" size="sm" onClick={() => addFaq(page.slug)}>
                                                <PlusCircle className="mr-2 h-4 w-4"/>
                                                Add FAQ
                                            </Button>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            {page.content.faqs.map((faq: {question: string, answer: string}, index: number) => (
                                                <AccordionItem key={index} value={`item-${index}`}>
                                                    <AccordionTrigger>
                                                        <span className="truncate pr-4">{faq.question}</span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`faq-q-${index}`}>Question</Label>
                                                            <Input 
                                                                id={`faq-q-${index}`} 
                                                                value={faq.question} 
                                                                onChange={e => handleFaqChange(page.slug, index, 'question', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`faq-a-${index}`}>Answer</Label>
                                                            <Textarea 
                                                                id={`faq-a-${index}`} 
                                                                value={faq.answer} 
                                                                onChange={e => handleFaqChange(page.slug, index, 'answer', e.target.value)}
                                                            />
                                                        </div>
                                                        <Button variant="destructive" size="sm" onClick={() => removeFaq(page.slug, index)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Remove
                                                        </Button>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor={`content-${page.slug}`}>Page Content (JSON)</Label>
                                         <Textarea
                                            id={`content-${page.slug}`}
                                            defaultValue={JSON.stringify(page.content, null, 2)}
                                            onChange={(e) => handleJsonContentChange(page.slug, e.target.value)}
                                            rows={20}
                                            className="font-mono text-xs"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Warning: Editing this directly can break the page if the JSON is not valid.
                                        </p>
                                    </div>
                                )}

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
