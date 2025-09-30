
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import type { Conversation, ChatMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, X, ChevronsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function ChatWidget() {
    const { currentUser, isOwner, isMounted } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const loadConversation = useCallback(() => {
        if (currentUser && !isOwner) {
            const allConversations: Conversation[] = JSON.parse(localStorage.getItem('conversations') || '[]');
            let userConvo = allConversations.find(c => c.customer.id === currentUser.id);

            if (!userConvo) {
                userConvo = {
                    id: currentUser.id,
                    customer: currentUser,
                    messages: [],
                    lastMessageAt: new Date().toISOString(),
                };
            }
            setConversation(userConvo);
        }
    }, [currentUser, isOwner]);

    useEffect(() => {
        if (isMounted) {
            loadConversation();
        }
    }, [isMounted, loadConversation]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'conversations') {
                loadConversation();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [loadConversation]);

    useEffect(() => {
        if (isOpen && scrollAreaRef.current) {
            setTimeout(() => {
                const scrollElement = scrollAreaRef.current?.querySelector('div');
                if (scrollElement) {
                    scrollElement.scrollTop = scrollElement.scrollHeight;
                }
            }, 100);
        }
    }, [isOpen, conversation]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !currentUser || !conversation) return;

        const message: ChatMessage = {
            id: `msg-${Date.now()}`,
            text: newMessage,
            sender: 'customer',
            timestamp: new Date().toISOString(),
            isRead: false,
        };

        const updatedConversation = {
            ...conversation,
            messages: [...conversation.messages, message],
            lastMessageAt: new Date().toISOString(),
        };

        const allConversations: Conversation[] = JSON.parse(localStorage.getItem('conversations') || '[]');
        const existingIndex = allConversations.findIndex(c => c.id === currentUser.id);

        if (existingIndex > -1) {
            allConversations[existingIndex] = updatedConversation;
        } else {
            allConversations.push(updatedConversation);
        }

        localStorage.setItem('conversations', JSON.stringify(allConversations));
        window.dispatchEvent(new CustomEvent('conversations-updated'));
        setConversation(updatedConversation);
        setNewMessage('');
        window.dispatchEvent(new CustomEvent('new-message-alert'));
    };
    
    if (!isMounted || !currentUser || isOwner) {
        return null;
    }

    const unreadMessages = conversation?.messages.filter(m => m.sender === 'owner' && !m.isRead).length || 0;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <Card className="w-80 h-96 flex flex-col shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
                        <div className="flex items-center gap-2">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback>NE</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-base font-semibold">Nepal eMart Support</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
                        <div className="space-y-4">
                            {conversation?.messages.map(msg => (
                                <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'customer' ? 'justify-end' : 'justify-start')}>
                                    <div className={cn(
                                        "max-w-[75%] rounded-lg px-3 py-2",
                                        msg.sender === 'customer' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                    )}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <CardFooter className="p-2 border-t">
                        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex w-full items-center gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <Button type="submit" size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            ) : (
                <Button size="icon" className="h-14 w-14 rounded-full shadow-lg relative" onClick={() => setIsOpen(true)}>
                    <MessageSquare className="h-7 w-7" />
                    {unreadMessages > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                            {unreadMessages}
                        </span>
                    )}
                </Button>
            )}
        </div>
    );
}
