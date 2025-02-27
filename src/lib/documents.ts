import { Document } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Sample documents for demonstration
const sampleDocuments: Document[] = [
  {
    id: uuidv4(),
    title: 'What is RAG?',
    content: `Retrieval-Augmented Generation (RAG) is a technique that enhances large language models by retrieving relevant information from external sources before generating a response. 
    
    RAG combines the strengths of retrieval-based and generation-based approaches to AI. It first retrieves relevant documents or information from a knowledge base, then uses this information to augment the context provided to the language model.
    
    This approach helps to ground the model's responses in factual information, reducing hallucinations and improving accuracy, especially for domain-specific or factual questions.`,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'Supabase Features',
    content: `Supabase is an open-source Firebase alternative that provides a suite of tools for building applications:
    
    1. PostgreSQL Database: A powerful, open-source relational database with real-time capabilities.
    2. Authentication: Built-in auth with support for email/password, magic links, OAuth providers, and more.
    3. Storage: Store and serve large files with security rules.
    4. Edge Functions: Run serverless functions globally.
    5. Realtime: Subscribe to database changes via websockets.
    6. Vector Embeddings: Store and query vector embeddings for AI applications.
    
    Supabase is designed to be developer-friendly with comprehensive documentation and client libraries for various platforms.`,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'React Best Practices',
    content: `Here are some React best practices for 2025:
    
    1. Use functional components with hooks instead of class components.
    2. Implement proper state management - use Context API for simple state or libraries like Redux for complex state.
    3. Memoize expensive calculations with useMemo and useCallback.
    4. Split your application into small, reusable components.
    5. Use React.lazy and Suspense for code-splitting.
    6. Implement proper error boundaries to catch and handle errors gracefully.
    7. Use TypeScript for type safety.
    8. Follow the principle of lifting state up when needed.
    9. Use proper key props when rendering lists.
    10. Optimize rendering with React.memo for pure components.`,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'JavaScript Array Methods',
    content: `JavaScript provides many useful array methods:
    
    1. map() - Creates a new array by applying a function to each element
    2. filter() - Creates a new array with elements that pass a test
    3. reduce() - Reduces an array to a single value by applying a function
    4. forEach() - Executes a function for each element (no return value)
    5. find() - Returns the first element that passes a test
    6. some() - Tests if at least one element passes a test
    7. every() - Tests if all elements pass a test
    8. sort() - Sorts the elements of an array
    9. includes() - Tests if an array includes a specific element
    10. flat() - Creates a new array with sub-array elements concatenated
    
    These methods are powerful tools for functional programming in JavaScript.`,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'Tailwind CSS Tips',
    content: `Tailwind CSS tips for efficient development:
    
    1. Use the @apply directive in CSS files to extract repeated utility patterns.
    2. Create component classes for consistent styling across your application.
    3. Use the config file to customize colors, spacing, and breakpoints.
    4. Leverage JIT (Just-In-Time) mode for faster development and smaller file sizes.
    5. Use arbitrary values when you need specific values not in your theme.
    6. Group hover states with group-hover classes for complex interactions.
    7. Use variants like dark: for dark mode support.
    8. Organize complex components with plugins.
    9. Use the official Tailwind CSS plugins for forms, typography, and more.
    10. Purge unused CSS in production for optimal performance.`,
    createdAt: new Date()
  }
];

// Function to get all documents
export function getDocuments(): Document[] {
  // In a real application, this would fetch from Supabase or another data source
  return sampleDocuments;
}

// Function to get a document by ID
export function getDocumentById(id: string): Document | undefined {
  return sampleDocuments.find(doc => doc.id === id);
}

// Function to add a new document
export function addDocument(title: string, content: string): Document {
  const newDocument: Document = {
    id: uuidv4(),
    title,
    content,
    createdAt: new Date()
  };
  
  sampleDocuments.push(newDocument);
  return newDocument;
}