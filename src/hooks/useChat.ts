import { useState, useEffect } from 'react'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: number
}

export function useChat(streamId: string) {
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'User', // Replace with actual user name
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, newMessage])
    // Here you would implement the actual message sending logic to your backend
  }

  useEffect(() => {
    // Here you would implement the WebSocket connection or other real-time communication
    // For now, we'll just add a dummy message
    const initialMessage: Message = {
      id: '0',
      text: 'Welcome to the chat!',
      sender: 'System',
      timestamp: Date.now(),
    }
    setMessages([initialMessage])
  }, [streamId])

  return { messages, sendMessage }
}