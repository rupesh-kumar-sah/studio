
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product, Review } from '@/lib/types';
import { useAuth } from '@/components/auth/auth-provider';
import { addReview } from '@/app/actions/product-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EditReviewDialog } from './edit-review-dialog';

const reviewSchema = z.object({
    comment: z.string().min(10, "Review must be at least 10 characters long."),
    rating: z.coerce.number().min(1, "Please select a rating.").max(5),
});

interface AddReviewFormProps {
  productId: string;
  onReviewSubmit: () => void;
}

function AddReviewForm({ productId, onReviewSubmit }: AddReviewFormProps) {
    const { currentUser } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            comment: "",
            rating: 0,
        }
    });

    const handleAddReview = async (data: z.infer<typeof reviewSchema>) => {
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'You must be logged in to post a review.' });
            return;
        }
        const result = await addReview(productId, currentUser.name, data.rating, data.comment);
        if (result.success) {
            toast({ title: 'Review submitted successfully!' });
            reset();
            onReviewSubmit(); // Refresh the product page to show the new review
        } else {
            toast({ variant: 'destructive', title: 'Failed to submit review.' });
        }
    };
    
    const watchedRating = watch("rating", 0);

    if (!currentUser) {
        return (
            <div className="p-4 bg-secondary text-center rounded-lg text-sm text-muted-foreground">
                <p>You must be logged in to write a review.</p>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleAddReview)} className="space-y-4">
                    <div>
                        <Label>Your Rating</Label>
                        <RadioGroup
                            value={String(watchedRating)}
                            onValueChange={(val) => setValue('rating', parseInt(val), { shouldValidate: true })}
                            className="flex items-center gap-2 mt-2"
                        >
                            {[1, 2, 3, 4, 5].map(star => (
                                <div key={star}>
                                    <RadioGroupItem value={String(star)} id={`add-rating-${star}`} className="sr-only" />
                                    <Label htmlFor={`add-rating-${star}`} className="cursor-pointer">
                                        <Star className={`h-7 w-7 transition-colors ${star <= watchedRating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                         {errors.rating && <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>}
                    </div>
                     <div>
                        <Label htmlFor="comment">Your Review</Label>
                        <Textarea id="comment" {...register('comment')} className="mt-1" rows={4} placeholder="What did you like or dislike?" />
                        {errors.comment && <p className="text-sm text-destructive mt-1">{errors.comment.message}</p>}
                    </div>
                    <div className="text-right">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}


interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({ product }: ProductReviewsProps) {
    const { isOwner } = useAuth();
    const router = useRouter();
    
    return (
        <div className="space-y-8">
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
                                                <div className="flex items-center text-amber-500">
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
                            <p className="text-sm">Be the first to share your thoughts!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <AddReviewForm productId={product.id} onReviewSubmit={() => router.refresh()} />
        </div>
    );
}
