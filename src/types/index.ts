export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface RAGOptions {
  enabled: boolean;
  documents: Document[];
}