
'use client';

import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Trash2, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CustomerMessage } from '@/components/shared/contact-dialog';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const loadMessages = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedMessages = JSON.parse(localStorage.getItem('customerMessages') || '[]') as CustomerMessage[];
      setMessages(storedMessages);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!isMounted) return;
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'customerMessages') {
        loadMessages();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isMounted, loadMessages]); 

  const markAsRead = (messageId: string) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('customerMessages', JSON.stringify(updatedMessages));
  };
  
  const deleteMessage = (messageId: string) => {
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    setMessages(updatedMessages);
    localStorage.setItem('customerMessages', JSON.stringify(updatedMessages));
  }

  if (!isMounted) {
    return <div className="p-4 sm:p-6 text-center">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground" />
            <CardTitle className="mt-4">Inbox is Empty</CardTitle>
            <CardDescription>You have no new messages from customers.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Customer Messages</h1>
        <p className="text-muted-foreground">Messages submitted through the contact form.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Accordion type="multiple" className="w-full">
            {messages.map(message => (
              <AccordionItem key={message.id} value={message.id}>
                <AccordionTrigger 
                  className={cn("p-4 hover:no-underline", !message.isRead && "bg-primary/10")}
                  onClick={() => !message.isRead && markAsRead(message.id)}
                >
                  <div className="flex items-center gap-4 w-full pr-4">
                    <Avatar>
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${message.from.name.replace(' ', '+')}&background=random`} />
                        <AvatarFallback>{message.from.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                        <p className={cn("font-semibold", !message.isRead && "text-primary")}>{message.from.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs md:max-w-md">{message.subject}</p>
                    </div>
                    <p className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                        {format(new Date(message.date), "PPP p")}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>From:</strong> {message.from.name} &lt;{message.from.email}&gt;<br/>
                    <strong>Subject:</strong> {message.subject}
                  </p>
                  <p className="whitespace-pre-wrap">{message.message}</p>
                  <div className="mt-6 text-right">
                      <Button variant="destructive" size="sm" onClick={() => deleteMessage(message.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
