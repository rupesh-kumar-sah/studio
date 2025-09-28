
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Review } from '@/lib/types';
import { updateReview, deleteReview } from '@/app/actions/product-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Star, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const reviewSchema = z.object({
    comment: z.string().min(10, "Review must be at least 10 characters long."),
    rating: z.coerce.number().min(1).max(5),
});

interface EditReviewDialogProps {
    review: Review;
    productId: string;
}

export function EditReviewDialog({ review, productId }: EditReviewDialogProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            comment: review.comment,
            rating: review.rating,
        }
    });
    
    const handleEditSubmit = async (data: z.infer<typeof reviewSchema>) => {
        const result = await updateReview(productId, review.id, data.comment, data.rating);
        if (result.success) {
            toast({ title: 'Review updated successfully' });
            setIsDialogOpen(false);
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Failed to update review' });
        }
    };
    
    const handleDelete = async () => {
        const result = await deleteReview(productId, review.id);
        if (result.success) {
            toast({ title: 'Review deleted successfully' });
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Failed to delete review' });
        }
    };

    const watchedRating = watch("rating", review.rating);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <div className="flex gap-1">
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => reset({ comment: review.comment, rating: review.rating })}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Review</span>
                    </Button>
                </DialogTrigger>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                             <span className="sr-only">Delete Review</span>
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
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            
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
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
