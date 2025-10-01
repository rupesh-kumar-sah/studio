
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const scrollViewportRef = useRef<HTMLDivElement>(null);

    const loadConversations = useCallback(() => {
        const allConvos: Conversation[] = JSON.parse(localStorage.getItem('conversations') || '[]');
        allConvos.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
        setConversations(allConvos);

        // If a conversation is selected, mark its messages as read
        if (selectedConversationId) {
            const convoIndex = allConvos.findIndex(c => c.id === selectedConversationId);
            if (convoIndex > -1) {
                let changed = false;
                allConvos[convoIndex].messages.forEach(m => {
                    if (m.sender === 'customer' && !m.isRead) {
                        m.isRead = true;
                        changed = true;
                    }
                });
                if (changed) {
                    localStorage.setItem('conversations', JSON.stringify(allConvos));
                }
            }
        }

    }, [selectedConversationId]);

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
        if (!selectedConversationId && conversations.length > 0) {
            setSelectedConversationId(conversations[0].id);
        }
    }, [conversations, selectedConversationId]);

    const selectedConvo = useMemo(() => {
        return conversations.find(c => c.id === selectedConversationId) || null;
    }, [conversations, selectedConversationId]);
    
    useEffect(() => {
        if (selectedConvo && scrollViewportRef.current) {
            setTimeout(() => {
                if (scrollViewportRef.current) {
                    scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
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
            isRead: true, // Messages sent by owner are read by default
        };

        const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]') as Conversation[];
        const convoIndex = allConversations.findIndex(c => c.id === selectedConvo.id);
        
        if (convoIndex > -1) {
            allConversations[convoIndex].messages.push(message);
            allConversations[convoIndex].lastMessageAt = new Date().toISOString();
        }
        
        localStorage.setItem('conversations', JSON.stringify(allConversations));
        window.dispatchEvent(new CustomEvent('conversations-updated'));
        setNewMessage('');
    };

    const handleConversationSelect = (convoId: string) => {
        setSelectedConversationId(convoId);
        // Mark messages as read immediately on selection
        const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]') as Conversation[];
        const convoIndex = allConversations.findIndex(c => c.id === convoId);
        if (convoIndex > -1) {
            allConversations[convoIndex].messages.forEach(m => m.isRead = true);
            localStorage.setItem('conversations', JSON.stringify(allConversations));
            // Trigger an update to reflect the read status change immediately
            window.dispatchEvent(new CustomEvent('conversations-updated'));
        }
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
        <div className="h-[calc(100vh-4rem)] md:h-screen flex flex-col p-4">
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight">Customer Conversations</h1>
                <p className="text-muted-foreground">Reply to customer messages in real-time.</p>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-4 overflow-hidden">
                <Card className="md:col-span-1 flex flex-col">
                    <ScrollArea className="flex-1">
                        {conversations.map(convo => {
                            const lastMessage = convo.messages[convo.messages.length - 1];
                            const unreadCount = convo.messages.filter(m => m.sender === 'customer' && !m.isRead).length;
                            return (
                                <button
                                    key={convo.id}
                                    onClick={() => handleConversationSelect(convo.id)}
                                    className={cn(
                                        "w-full text-left p-3 border-b flex items-center gap-3 hover:bg-secondary transition-colors",
                                        selectedConversationId === convo.id && "bg-secondary"
                                    )}
                                >
                                    <Avatar>
                                        <AvatarImage src={convo.customer.avatar || `https://ui-avatars.com/api/?name=${convo.customer.name.replace(' ', '+')}&background=random`} />
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
                <div className="flex flex-col h-full">
                    {selectedConvo ? (
                        <Card className="flex-1 flex flex-col">
                            <div className="p-3 border-b flex items-center gap-3">
                                <Avatar>
                                     <AvatarImage src={selectedConvo.customer.avatar || `https://ui-avatars.com/api/?name=${selectedConvo.customer.name.replace(' ', '+')}&background=random`} />
                                    <AvatarFallback>{selectedConvo.customer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{selectedConvo.customer.name}</p>
                                    <p className="text-sm text-muted-foreground">{selectedConvo.customer.email}</p>
                                </div>
                            </div>
                            <ScrollArea className="flex-1 p-4" viewportRef={scrollViewportRef}>
                                <div className="space-y-4">
                                    {selectedConvo.messages.map(msg => (
                                        <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'owner' ? 'justify-end' : 'justify-start')}>
                                            {msg.sender === 'customer' && <Avatar className="h-6 w-6"><AvatarImage src={selectedConvo.customer.avatar} /><AvatarFallback>{selectedConvo.customer.name.charAt(0)}</AvatarFallback></Avatar>}
                                            <div className={cn(
                                                "max-w-[70%] rounded-lg px-3 py-2",
                                                msg.sender === 'owner' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                            )}>
                                                <p className="text-sm">{msg.text}</p>
                                            </div>
                                             {msg.sender === 'owner' && <Avatar className="h-6 w-6"><AvatarImage src={owner?.avatar} /><AvatarFallback>{owner?.name?.charAt(0)}</AvatarFallback></Avatar>}
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
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
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

    

    
