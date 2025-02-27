import React, { useState } from 'react';
import { Document } from '../types';

interface DocumentEditorProps {
  document: Document | null;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

export function DocumentEditor({ document, onSave, onCancel }: DocumentEditorProps) {
  const [title, setTitle] = useState(document?.title || '');
  const [content, setContent] = useState(document?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSave(title, content);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">
          {document ? 'Edit Document' : 'Add New Document'}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Document title"
            required
          />
        </div>
        <div className="flex-1 mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Document content"
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}