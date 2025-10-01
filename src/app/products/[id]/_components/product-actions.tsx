
'use client';

import { useAuth } from "@/components/auth/auth-provider";
import { EditProductSheet } from "@/components/products/edit-product-sheet";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { Edit } from "lucide-react";

export function ProductActions({ product }: { product: Product }) {
    const { isOwner } = useAuth();

    if (!isOwner) {
        return null;
    }

    return (
        <EditProductSheet product={product}>
            <Button variant="outline" size="icon">
                <Edit className="h-5 w-5" />
                <span className="sr-only">Edit Product</span>
            </Button>
        </EditProductSheet>
    );
}
