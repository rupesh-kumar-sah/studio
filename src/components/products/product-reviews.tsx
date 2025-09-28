
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product, Review } from '@/lib/types';
import { useAuth } from '@/components/auth/auth-provider';
import { updateReview, deleteReview } from '@/app/actions/product-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EditReviewDialog } from './edit-review-dialog';

const reviewSchema = z.object({
    comment: z.string().min(10, "Review must be at least 10 characters long."),
    rating: z.coerce.number().min(1).max(5),
});

interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({ product }: ProductReviewsProps) {
    const { isOwner } = useAuth();
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>See what others are saying about this product.</CardDescription>
            </CardHeader>
            <CardContent>
                {product.detailedReviews && product.detailedReviews.length > 0 ? (
                    <div className="space-y-6">
                        {product.detailedReviews.map((review, index) => (
                            <div key={review.id}>
                                <div className="flex gap-4">
                                    <Avatar>
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${review.author.replace(' ', '+')}&background=random`} alt={review.author} />
                                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{review.author}</p>
                                                <p className="text-xs text-muted-foreground">{format(new Date(review.date), "PPP")}</p>
                                            </div>
                                            <div className="flex items-center text-primary">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'fill-muted stroke-muted-foreground'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="mt-2 text-muted-foreground">{review.comment}</p>
                                    </div>
                                    {isOwner && (
                                       <EditReviewDialog review={review} productId={product.id} />
                                    )}
                                </div>
                                {index < product.detailedReviews.length - 1 && <Separator className="mt-6" />}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <MessageSquare className="h-12 w-12 mx-auto" />
                        <p className="mt-4">No reviews yet for this product.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
