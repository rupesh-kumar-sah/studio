
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const messageSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters long.'),
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export type CustomerMessage = {
    id: string;
    date: string;
    from: {
        name: string;
        email: string;
    };
    subject: string;
    message: string;
    isRead: boolean;
};

interface ContactDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ContactDialog({ isOpen, onOpenChange }: ContactDialogProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = (data: MessageFormValues) => {
    if (!currentUser) return;
    setIsSubmitting(true);
    
    // Simulate sending message
    setTimeout(() => {
        const newMessage: CustomerMessage = {
            id: `msg-${Date.now()}`,
            date: new Date().toISOString(),
            from: {
                name: currentUser.name,
                email: currentUser.email,
            },
            subject: data.subject,
            message: data.message,
            isRead: false,
        };

        const existingMessages = JSON.parse(localStorage.getItem('customerMessages') || '[]');
        localStorage.setItem('customerMessages', JSON.stringify([newMessage, ...existingMessages]));

        window.dispatchEvent(new CustomEvent('new-message-alert'));

        toast({
            title: 'Message Sent!',
            description: "We've received your message and will get back to you soon.",
        });

        setIsSubmitting(false);
        reset();
        onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>Send a message directly to our team.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" {...register('subject')} />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" {...register('message')} rows={6} />
            {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Message
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
