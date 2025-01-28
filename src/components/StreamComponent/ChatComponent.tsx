"use client";

import type { RoomMetadata } from "@/lib/controller";
import api from '@/app/libs/axios';
import {
  type ReceivedChatMessage,
  useChat,
  useLocalParticipant,
  useRoomInfo,
} from "@livekit/components-react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMemo, useState, useEffect } from "react";

interface ChatMessageProps {
  message: ReceivedChatMessage;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  username: string;
  isAdmin: boolean;
}

function ChatMessage({ message }: ChatMessageProps) {
  const { localParticipant } = useLocalParticipant();
  const isLocalParticipant = localParticipant.identity === message.from?.identity;
  const [userData, setUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (message.from?.identity) {
          console.log('🎯 Fetching user data for:', {
            identity: message.from.identity,
            name: message.from.name,
            metadata: message.from.metadata
          });

          const { data } = await api.get(`/api/users/${message.from.identity}`);
          console.log('📦 User data received:', data);
          setUserData(data);
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [message.from?.identity]);

  const displayName = userData?.username || message.from?.name || "Usuario Anónimo";
  console.log('👤 Display name used:', {
    userData: userData,
    fromName: message.from?.name,
    finalName: displayName,
    username: userData?.username
  });

  return (
    <div className={cn(
      "flex w-full gap-2 items-start",
      isLocalParticipant ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={userData?.image || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {displayName[0]?.toUpperCase() ?? "?"}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        "flex flex-col gap-1 max-w-[75%]",
        isLocalParticipant ? "items-end" : "items-start"
      )}>
        <span className="text-xs text-zinc-400">
          {displayName}
        </span>
        <div className={cn(
          "rounded-lg px-3 py-2 text-sm",
          isLocalParticipant 
            ? "bg-primary text-primary-foreground" 
            : "bg-zinc-800 text-zinc-100"
        )}>
          {message.message}
        </div>
      </div>
    </div>
  );
}

export function ChatComponent() {
  const [draft, setDraft] = useState("");
  const { chatMessages, send } = useChat();
  const { metadata } = useRoomInfo();
  const { localParticipant } = useLocalParticipant();
  
  const messages = useMemo(() => {
    const timestamps = chatMessages.map((msg) => msg.timestamp);
    return chatMessages.filter(
      (msg, i) => !timestamps.includes(msg.timestamp, i + 1)
    );
  }, [chatMessages]);

  const handleSend = async () => {
    if (draft.trim().length && send) {
      await send(draft);
      setDraft("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex h-full flex-col bg-zinc-950 border-zinc-800">
      <CardHeader className="border-b border-zinc-800 p-4">
        <h3 className="text-center font-semibold text-zinc-100">
          Chat en vivo
        </h3>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.timestamp} message={msg} />
        ))}
      </CardContent>

      <div className="border-t border-zinc-800 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Escribe un mensaje..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500"
          />
          <Button
            size="icon"
            disabled={!draft.trim()}
            onClick={handleSend}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar mensaje</span>
          </Button>
        </div>
      </div>
    </Card>
  );
} 