import React from 'react';
import { Document } from '../types';
import { FileText, Plus } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  onSelectDocument: (document: Document) => void;
  onAddDocument: () => void;
}

export function DocumentList({ documents, onSelectDocument, onAddDocument }: DocumentListProps) {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Knowledge Base</h2>
        <p className="text-sm text-gray-500">Documents for RAG</p>
      </div>
      <div className="p-4">
        <button
          onClick={onAddDocument}
          className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Document</span>
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <ul className="space-y-1 p-2">
          {documents.map((doc) => (
            <li key={doc.id}>
              <div
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() => onSelectDocument(doc)}
              >
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="truncate">{doc.title}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}