
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Edit } from 'lucide-react';

const DEFAULT_QR_CODE = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Esewa_QR.png/440px-Esewa_QR.png";

export function EsewaQrCode() {
    const { isOwner } = useAuth();
    const { toast } = useToast();
    const [qrCodeUrl, setQrCodeUrl] = useState(DEFAULT_QR_CODE);
    const [isMounted, setIsMounted] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newQrCodeFile, setNewQrCodeFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const storedQr = localStorage.getItem('esewaQrCode');
        if (storedQr) {
            setQrCodeUrl(storedQr);
        }
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewQrCodeFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveQrCode = () => {
        if (previewUrl) {
            localStorage.setItem('esewaQrCode', previewUrl);
            setQrCodeUrl(previewUrl);
            toast({
                title: 'QR Code Updated',
                description: 'The eSewa QR code has been successfully updated.',
            });
            setIsEditDialogOpen(false);
            setNewQrCodeFile(null);
            setPreviewUrl(null);
        }
    };

    if (!isMounted) {
        return (
             <div className="p-4 bg-secondary rounded-lg text-sm text-center animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto mb-2"></div>
                <div className="flex justify-center mb-2">
                    <div className="h-[200px] w-[200px] bg-gray-300 rounded-md"></div>
                </div>
                 <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto mb-2"></div>
                 <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
             </div>
        );
    }
    
    return (
        <div className="p-4 bg-secondary rounded-lg text-sm text-center relative">
            {isOwner && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="absolute top-2 right-2 h-7 w-7">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit QR Code</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update QR Code</DialogTitle>
                            <DialogDescription>
                                Upload a new QR code image for eSewa payments.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="qr-upload">New QR Image</Label>
                                <Input id="qr-upload" type="file" accept="image/*" onChange={handleFileChange} />
                            </div>
                            {previewUrl && (
                                <div>
                                    <p className="text-sm font-medium mb-2">New QR Code Preview:</p>
                                    <Image src={previewUrl} alt="New QR Code Preview" width={200} height={200} className="rounded-md border p-1 mx-auto" />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSaveQrCode} disabled={!newQrCodeFile}>Save and Update</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
            <h3 className="font-semibold text-base mb-2">Pay with eSewa</h3>
            <p className="mb-2">Scan this QR to pay</p>
            <div className="flex justify-center mb-2">
                <Image src={qrCodeUrl} alt="eSewa QR Code" width={200} height={200} className="rounded-md border p-1" unoptimized />
            </div>
            <p>Account Name: <strong>Rupesh Kumar Sah</strong></p>
            <Separator className="my-4" />
            <p className="mt-2 text-muted-foreground">After completing the payment, please enter the Transaction ID (Payment Code) below to confirm.</p>
        </div>
    )
}
