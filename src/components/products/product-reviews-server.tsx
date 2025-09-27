
import { format } from 'date-fns';
import type { Review } from '@/lib/types';
import { getProductById } from '@/lib/products-db';
import { getIsOwner } from '@/lib/auth-db';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { EditReviewDialog } from './edit-review-dialog';


interface ProductReviewsProps {
  productId: string;
}

export async function ProductReviewsServer({ productId }: ProductReviewsProps) {
    const product = await getProductById(productId);
    const isOwner = await getIsOwner();
    
    if (!product) {
        return null;
    }

    const { detailedReviews } = product;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>See what others are saying about this product.</CardDescription>
            </CardHeader>
            <CardContent>
                {detailedReviews && detailedReviews.length > 0 ? (
                    <div className="space-y-6">
                        {detailedReviews.map((review) => (
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
                                       <EditReviewDialog review={review} productId={productId} />
                                    )}
                                </div>
                                {detailedReviews.indexOf(review) < detailedReviews.length - 1 && <Separator className="mt-6" />}
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

