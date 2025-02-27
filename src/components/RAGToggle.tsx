import React from 'react';
import { Database } from 'lucide-react';

interface RAGToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function RAGToggle({ enabled, onToggle }: RAGToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm ${
          enabled
            ? 'bg-green-100 text-green-800 hover:bg-green-200'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
        title={enabled ? 'RAG is enabled' : 'RAG is disabled'}
      >
        <Database className="w-4 h-4" />
        <span>RAG: {enabled ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
}