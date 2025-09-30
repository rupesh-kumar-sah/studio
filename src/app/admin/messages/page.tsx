
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Conversation, ChatMessage, User } from '@/lib/types';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function AdminMessagesPage() {
    const { owner } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const loadConversations = useCallback(() => {
        const allConvos: Conversation[] = JSON.parse(localStorage.getItem('conversations') || '[]');
        allConvos.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
        setConversations(allConvos);

        if (selectedConvo) {
            const updatedSelected = allConvos.find(c => c.id === selectedConvo.id);
            setSelectedConvo(updatedSelected || null);
        } else if (allConvos.length > 0) {
            setSelectedConvo(allConvos[0]);
        }
    }, [selectedConvo]);

    useEffect(() => {
        loadConversations();
        const handleStorage = () => loadConversations();
        window.addEventListener('storage', handleStorage);
        window.addEventListener('conversations-updated', handleStorage);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('conversations-updated', handleStorage);
        };
    }, [loadConversations]);

    useEffect(() => {
        if (selectedConvo && scrollAreaRef.current) {
             setTimeout(() => {
                const scrollElement = scrollAreaRef.current?.querySelector('div');
                if (scrollElement) {
                    scrollElement.scrollTop = scrollElement.scrollHeight;
                }
            }, 100);
        }
    }, [selectedConvo]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConvo) return;

        const message: ChatMessage = {
            id: `msg-${Date.now()}`,
            text: newMessage,
            sender: 'owner',
            timestamp: new Date().toISOString(),
            isRead: false,
        };

        const updatedConversation = {
            ...selectedConvo,
            messages: [...selectedConvo.messages, message],
            lastMessageAt: new Date().toISOString(),
        };

        const updatedConversations = conversations.map(c => c.id === selectedConvo.id ? updatedConversation : c);
        
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
        window.dispatchEvent(new CustomEvent('conversations-updated'));
        setNewMessage('');
    };

    if (conversations.length === 0) {
        return (
            <div className="p-4 sm:p-6 text-center">
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-8 text-center">
                        <Inbox className="h-16 w-16 mx-auto text-muted-foreground" />
                        <h2 className="mt-4 text-2xl font-semibold">No Messages Yet</h2>
                        <p className="mt-2 text-muted-foreground">When customers send messages, their conversations will appear here.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="h-screen flex flex-col p-4">
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight">Customer Conversations</h1>
                <p className="text-muted-foreground">Reply to customer messages in real-time.</p>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden">
                <Card className="md:col-span-1 lg:col-span-1 flex flex-col">
                    <ScrollArea className="flex-1">
                        {conversations.map(convo => {
                            const lastMessage = convo.messages[convo.messages.length - 1];
                            const unreadCount = convo.messages.filter(m => m.sender === 'customer' && !m.isRead).length;
                            return (
                                <button
                                    key={convo.id}
                                    onClick={() => setSelectedConvo(convo)}
                                    className={cn(
                                        "w-full text-left p-3 border-b flex items-center gap-3 hover:bg-secondary transition-colors",
                                        selectedConvo?.id === convo.id && "bg-secondary"
                                    )}
                                >
                                    <Avatar>
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${convo.customer.name.replace(' ', '+')}&background=random`} />
                                        <AvatarFallback>{convo.customer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold truncate">{convo.customer.name}</p>
                                            {unreadCount > 0 && <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{lastMessage?.text || 'No messages yet'}</p>
                                    </div>
                                </button>
                            )
                        })}
                    </ScrollArea>
                </Card>
                <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
                    {selectedConvo ? (
                        <Card className="flex-1 flex flex-col">
                            <div className="p-3 border-b flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${selectedConvo.customer.name.replace(' ', '+')}&background=random`} />
                                    <AvatarFallback>{selectedConvo.customer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{selectedConvo.customer.name}</p>
                                    <p className="text-sm text-muted-foreground">{selectedConvo.customer.email}</p>
                                </div>
                            </div>
                            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                                <div className="space-y-4">
                                    {selectedConvo.messages.map(msg => (
                                        <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'owner' ? 'justify-end' : 'justify-start')}>
                                            {msg.sender === 'customer' && <Avatar className="h-6 w-6"><AvatarFallback>{selectedConvo.customer.name.charAt(0)}</AvatarFallback></Avatar>}
                                            <div className={cn(
                                                "max-w-[70%] rounded-lg px-3 py-2",
                                                msg.sender === 'owner' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                            )}>
                                                <p className="text-sm">{msg.text}</p>
                                            </div>
                                             {msg.sender === 'owner' && <Avatar className="h-6 w-6"><AvatarFallback>{owner?.name?.charAt(0)}</AvatarFallback></Avatar>}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <div className="p-2 border-t">
                                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex w-full items-center gap-2">
                                    <Input
                                        placeholder={`Reply to ${selectedConvo.customer.name}...`}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <Button type="submit" size="icon">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    ) : (
                         <Card className="flex-1 flex items-center justify-center">
                            <p className="text-muted-foreground">Select a conversation to start chatting.</p>
                         </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
