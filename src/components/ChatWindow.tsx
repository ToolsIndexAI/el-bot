import React from 'react';
import { Chat, RAGOptions } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { RAGToggle } from './RAGToggle';

interface ChatWindowProps {
  chat: Chat | null;
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  ragOptions: RAGOptions;
  onToggleRAG: () => void;
}

export function ChatWindow({ chat, onSendMessage, isLoading, ragOptions, onToggleRAG }: ChatWindowProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700">No chat selected</h3>
          <p className="text-gray-500 mt-1">Select a chat from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">{chat.title}</h2>
        <RAGToggle enabled={ragOptions.enabled} onToggle={onToggleRAG} />
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {chat.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {ragOptions.enabled && isLoading && (
          <div className="text-sm text-gray-500 italic">
            Searching knowledge base for relevant information...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-200 p-4">
        <ChatInput onSend={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}