
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
    const { currentUser, owner, isOwner, isMounted } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const scrollViewportRef = useRef<HTMLDivElement>(null);

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
            } else {
                 // Mark messages as read when loading conversation if chat is open
                 if (isOpen) {
                    let changed = false;
                    userConvo.messages.forEach(m => {
                        if (m.sender === 'owner' && !m.isRead) {
                            m.isRead = true;
                            changed = true;
                        }
                    });
                    if (changed) {
                        const allConvos: Conversation[] = JSON.parse(localStorage.getItem('conversations') || '[]');
                        const convoIndex = allConvos.findIndex(c => c.id === currentUser.id);
                        if (convoIndex > -1) {
                            allConvos[convoIndex] = userConvo;
                            localStorage.setItem('conversations', JSON.stringify(allConvos));
                        }
                    }
                }
            }
            setConversation(userConvo);
        }
    }, [currentUser, isOwner, isOpen]);

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
        
        const handlePrefillMessage = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail.message) {
                setNewMessage(current => current ? `${current}\n${detail.message}`: detail.message);
                setIsOpen(true);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('conversations-updated', loadConversation);
        window.addEventListener('prefill-chat-message', handlePrefillMessage);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('conversations-updated', loadConversation);
            window.removeEventListener('prefill-chat-message', handlePrefillMessage);
        };
    }, [loadConversation]);

    useEffect(() => {
        if (isOpen && scrollViewportRef.current) {
            setTimeout(() => {
                if(scrollViewportRef.current) {
                    scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
                }
            }, 100);
        }
    }, [isOpen, conversation]);
    
    // Effect to handle marking messages as read when chat is opened
    useEffect(() => {
        if (isOpen && currentUser && conversation) {
            const hasUnread = conversation.messages.some(m => m.sender === 'owner' && !m.isRead);
            if (hasUnread) {
                const updatedMessages = conversation.messages.map(m => ({ ...m, isRead: true }));
                const updatedConversation = { ...conversation, messages: updatedMessages };

                const allConversations: Conversation[] = JSON.parse(localStorage.getItem('conversations') || '[]');
                const convoIndex = allConversations.findIndex(c => c.id === currentUser.id);

                if (convoIndex > -1) {
                    allConversations[convoIndex] = updatedConversation;
                    localStorage.setItem('conversations', JSON.stringify(allConversations));
                    setConversation(updatedConversation);
                }
            }
        }
    }, [isOpen, conversation, currentUser]);


    const handleSendMessage = () => {
        if (!newMessage.trim() || !currentUser || !conversation) return;

        const message: ChatMessage = {
            id: `msg-${Date.now()}`,
            text: newMessage,
            sender: 'customer',
            timestamp: new Date().toISOString(),
            isRead: false,
        };

        const allConversations: Conversation[] = JSON.parse(localStorage.getItem('conversations') || '[]');
        const convoIndex = allConversations.findIndex(c => c.id === currentUser.id);
        
        let updatedConversation: Conversation;

        if (convoIndex > -1) {
            updatedConversation = {
                ...allConversations[convoIndex],
                messages: [...allConversations[convoIndex].messages, message],
                lastMessageAt: new Date().toISOString(),
            };
            allConversations[convoIndex] = updatedConversation;
        } else {
            updatedConversation = {
                ...conversation,
                messages: [...conversation.messages, message],
                lastMessageAt: new Date().toISOString(),
            };
            allConversations.push(updatedConversation);
        }

        localStorage.setItem('conversations', JSON.stringify(allConversations));
        window.dispatchEvent(new CustomEvent('conversations-updated'));
        setNewMessage('');
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
                                <AvatarImage src={owner?.avatar} />
                                <AvatarFallback>NE</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-base font-semibold">Nepal eMart Support</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <ScrollArea className="flex-1 p-3" viewportRef={scrollViewportRef}>
                        <div className="space-y-4">
                            {conversation?.messages.map(msg => (
                                <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'customer' ? 'justify-end' : 'justify-start')}>
                                     {msg.sender === 'owner' && <Avatar className="h-6 w-6"><AvatarImage src={owner?.avatar} /><AvatarFallback>S</AvatarFallback></Avatar>}
                                    <div className={cn(
                                        "max-w-[75%] rounded-lg px-3 py-2",
                                        msg.sender === 'customer' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                    )}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    {msg.sender === 'customer' && <Avatar className="h-6 w-6"><AvatarImage src={currentUser?.avatar} /><AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback></Avatar>}
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
                                onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                            />
                            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
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

    