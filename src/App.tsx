import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Chat, Message, Document, RAGOptions } from './types';
import { ChatList } from './components/ChatList';
import { ChatWindow } from './components/ChatWindow';
import { DocumentList } from './components/DocumentList';
import { DocumentEditor } from './components/DocumentEditor';
import { supabase } from './lib/supabase';
import { getChatCompletion, findSimilarDocuments } from './lib/openai';
import { getDocuments, addDocument } from './lib/documents';
import { MessageSquareText, Database } from 'lucide-react';

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  
  // RAG related state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showDocuments, setShowDocuments] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [ragOptions, setRagOptions] = useState<RAGOptions>({
    enabled: true,
    documents: []
  });

  useEffect(() => {
    // Check if OpenAI API key is set
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    setApiKeySet(!!openaiKey && openaiKey.length > 0 && openaiKey !== 'your-openai-api-key-here');

    // Load chats from local storage initially
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats.map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt)
          }))
        })));
        
        if (parsedChats.length > 0) {
          setActiveChat(parsedChats[0].id);
        }
      } catch (error) {
        console.error('Failed to parse saved chats:', error);
      }
    }
    
    // Load documents
    setDocuments(getDocuments());
  }, []);

  useEffect(() => {
    // Save chats to local storage whenever they change
    if (chats.length > 0) {
      localStorage.setItem('chats', JSON.stringify(chats));
    }
  }, [chats]);

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === activeChat) || null;
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date()
    };
    
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    if (activeChat === chatId) {
      setActiveChat(updatedChats.length > 0 ? updatedChats[0].id : null);
    }
  };

  const handleToggleRAG = () => {
    setRagOptions(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  const handleAddDocument = () => {
    setEditingDocument(null);
    setShowDocuments(true);
  };

  const handleSelectDocument = (document: Document) => {
    setEditingDocument(document);
    setShowDocuments(true);
  };

  const handleSaveDocument = (title: string, content: string) => {
    if (editingDocument) {
      // Update existing document (in a real app, this would update in Supabase)
      const updatedDocuments = documents.map(doc => 
        doc.id === editingDocument.id 
          ? { ...doc, title, content } 
          : doc
      );
      setDocuments(updatedDocuments);
    } else {
      // Add new document
      const newDocument = addDocument(title, content);
      setDocuments([...documents, newDocument]);
    }
    
    setEditingDocument(null);
    setShowDocuments(false);
  };

  const handleCancelDocumentEdit = () => {
    setEditingDocument(null);
    setShowDocuments(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChat) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      createdAt: new Date()
    };
    
    // Update chat with user message
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        // Update title if it's the first message
        const title = chat.messages.length === 0 ? content.slice(0, 30) : chat.title;
        return {
          ...chat,
          title,
          messages: [...chat.messages, userMessage]
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setIsLoading(true);
    setApiKeyError(null);
    
    try {
      const currentChat = updatedChats.find(chat => chat.id === activeChat);
      
      if (!currentChat) {
        throw new Error('Chat not found');
      }
      
      // Format messages for OpenAI API
      const formattedMessages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...currentChat.messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];
      
      if (!apiKeySet) {
        // Simulate a response if API key is not set
        setTimeout(() => {
          const assistantMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: `This is a simulated response because no valid OpenAI API key is set. To connect to ChatGPT, please add your OpenAI API key to the .env file as VITE_OPENAI_API_KEY.`,
            createdAt: new Date()
          };
          
          const finalChats = chats.map(chat => {
            if (chat.id === activeChat) {
              return {
                ...chat,
                messages: [...chat.messages, userMessage, assistantMessage]
              };
            }
            return chat;
          });
          
          setChats(finalChats);
          setIsLoading(false);
        }, 1000);
        return;
      }
      
      // If RAG is enabled, retrieve relevant documents
      let retrievedContext = '';
      if (ragOptions.enabled) {
        const { documents: relevantDocs, error } = await findSimilarDocuments(content, documents);
        
        if (relevantDocs.length > 0) {
          retrievedContext = `Here are some relevant documents that might help answer the question:\n\n${
            relevantDocs.map(doc => `Document: ${doc.title}\nContent: ${doc.content}\n`).join('\n')
          }`;
        }
      }
      
      // Get response from OpenAI
      const { content: aiContent, error } = await getChatCompletion(formattedMessages, retrievedContext);
      
      if (error) {
        setApiKeyError(error);
      }
      
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: error || aiContent || 'Sorry, I could not generate a response.',
        createdAt: new Date()
      };
      
      const finalChats = chats.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage, assistantMessage]
          };
        }
        return chat;
      });
      
      setChats(finalChats);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        createdAt: new Date()
      };
      
      const finalChats = chats.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage, errorMessage]
          };
        }
        return chat;
      });
      
      setChats(finalChats);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List */}
      {chats.length > 0 ? (
        <ChatList
          chats={chats}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onNewChat={handleNewChat}
        />
      ) : (
        <div className="w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col">
          <div className="p-4">
            <button
              onClick={handleNewChat}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              New Chat
            </button>
          </div>
        </div>
      )}
      
      {/* Document List or Editor (conditionally shown) */}
      {showDocuments && (
        editingDocument || documents.length === 0 ? (
          <DocumentEditor 
            document={editingDocument} 
            onSave={handleSaveDocument}
            onCancel={handleCancelDocumentEdit}
          />
        ) : (
          <DocumentList 
            documents={documents}
            onSelectDocument={handleSelectDocument}
            onAddDocument={handleAddDocument}
          />
        )
      )}
      
      {/* Chat Window or Welcome Screen */}
      {chats.length > 0 ? (
        <ChatWindow
          chat={getCurrentChat()}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          ragOptions={ragOptions}
          onToggleRAG={handleToggleRAG}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center max-w-md p-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquareText className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Supabase AI Chat with RAG</h2>
            <p className="text-gray-600 mb-6">
              Start a new conversation to interact with the AI assistant. 
              {!apiKeySet && (
                <span className="block mt-2 text-amber-600">
                  Note: Add your OpenAI API key to the .env file to connect to ChatGPT.
                </span>
              )}
              {apiKeyError && (
                <span className="block mt-2 text-red-600">
                  Error: {apiKeyError}
                </span>
              )}
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleNewChat}
                className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start a New Chat
              </button>
              <button
                onClick={() => setShowDocuments(true)}
                className="py-2 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Database className="w-5 h-5" />
                <span>Manage Knowledge Base</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;