import React from 'react';
import { Chat } from '../types';
import { MessageSquare, Trash2 } from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatList({ chats, activeChat, onSelectChat, onDeleteChat, onNewChat }: ChatListProps) {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <ul className="space-y-1 p-2">
          {chats.map((chat) => (
            <li key={chat.id}>
              <div
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
                  activeChat === chat.id ? 'bg-gray-200' : ''
                }`}
              >
                <div
                  className="flex items-center gap-2 flex-1 truncate"
                  onClick={() => onSelectChat(chat.id)}
                >
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{chat.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}