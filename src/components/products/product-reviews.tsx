
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product, Review } from '@/lib/types';
import { useAuth } from '@/components/auth/auth-provider';
import { useProducts } from './product-provider';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const reviewSchema = z.object({
    comment: z.string().min(10, "Review must be at least 10 characters long."),
    rating: z.coerce.number().min(1).max(5),
});

interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({ product }: ProductReviewsProps) {
    const { isOwner } = useAuth();
    const { updateReview, deleteReview } = useProducts();
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
    });

    const handleEditClick = (review: Review) => {
        setEditingReview(review);
        reset({ comment: review.comment, rating: review.rating });
    };

    const handleEditSubmit = (data: z.infer<typeof reviewSchema>) => {
        if (editingReview) {
            updateReview(product.id, editingReview.id, data.comment, data.rating);
            setEditingReview(null);
        }
    };
    
    const handleDelete = (reviewId: string) => {
        deleteReview(product.id, reviewId);
    };

    const watchedRating = watch("rating", editingReview?.rating || 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>See what others are saying about this product.</CardDescription>
            </CardHeader>
            <CardContent>
                {product.detailedReviews && product.detailedReviews.length > 0 ? (
                    <div className="space-y-6">
                        {product.detailedReviews.map((review) => (
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
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(review)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete this review.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(review.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    )}
                                </div>
                                <Separator className="mt-6" />
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

            <Dialog open={!!editingReview} onOpenChange={(isOpen) => !isOpen && setEditingReview(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Review</DialogTitle>
                        <DialogDescription>Make changes to the review below.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea id="comment" {...register('comment')} className="mt-1" />
                            {errors.comment && <p className="text-sm text-destructive mt-1">{errors.comment.message}</p>}
                        </div>
                        <div>
                            <Label>Rating</Label>
                            <RadioGroup
                                value={String(watchedRating)}
                                onValueChange={(val) => setValue('rating', parseInt(val))}
                                className="flex items-center gap-2 mt-2"
                            >
                                {[1, 2, 3, 4, 5].map(star => (
                                    <div key={star}>
                                        <RadioGroupItem value={String(star)} id={`rating-${star}`} className="sr-only" />
                                        <Label htmlFor={`rating-${star}`} className="cursor-pointer">
                                            <Star className={`h-6 w-6 transition-colors ${star <= watchedRating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingReview(null)}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

