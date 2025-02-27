import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Create OpenAI client instance
export const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
});

export async function getChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>,
  retrievedContext?: string
) {
  try {
    // Validate API key
    if (!apiKey || apiKey === 'your-openai-api-key-here') {
      return {
        content: null,
        error: 'OpenAI API key is not set or is invalid. Please add a valid API key to your .env file.'
      };
    }
    
    // If we have retrieved context, add it to the system message
    let systemMessage = messages.find(msg => msg.role === 'system');
    const otherMessages = messages.filter(msg => msg.role !== 'system');
    
    if (retrievedContext) {
      const contextPrompt = `You are a helpful assistant. Use the following retrieved information to answer the user's question:
      
${retrievedContext}

If the retrieved information doesn't contain the answer, just say you don't know and answer based on your general knowledge.`;
      
      if (systemMessage) {
        systemMessage.content = contextPrompt;
      } else {
        systemMessage = { role: 'system', content: contextPrompt };
      }
    }
    
    const finalMessages = systemMessage 
      ? [systemMessage, ...otherMessages] 
      : otherMessages;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: finalMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return {
      content: response.choices[0].message.content,
      error: null
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return {
      content: null,
      error: 'Failed to get response from AI. Please check your API key and try again.'
    };
  }
}

// Function to create embeddings for documents
export async function createEmbedding(text: string) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    
    return {
      embedding: response.data[0].embedding,
      error: null
    };
  } catch (error) {
    console.error('Error creating embedding:', error);
    return {
      embedding: null,
      error: 'Failed to create embedding. Please check your API key and try again.'
    };
  }
}

// Function to find similar documents based on query
export async function findSimilarDocuments(query: string, documents: Array<{ content: string, title: string, id: string }>) {
  // Create embedding for the query
  const { embedding: queryEmbedding, error } = await createEmbedding(query);
  
  if (error || !queryEmbedding) {
    return {
      documents: [],
      error
    };
  }
  
  // For each document, create an embedding and calculate similarity
  const documentsWithScores = await Promise.all(
    documents.map(async (doc) => {
      const { embedding: docEmbedding } = await createEmbedding(doc.content);
      
      if (!docEmbedding) return { ...doc, score: 0 };
      
      // Calculate cosine similarity
      const similarity = calculateCosineSimilarity(queryEmbedding, docEmbedding);
      
      return {
        ...doc,
        score: similarity
      };
    })
  );
  
  // Sort by similarity score and return top results
  const sortedDocuments = documentsWithScores
    .sort((a, b) => b.score - a.score)
    .filter(doc => doc.score > 0.7) // Only return documents with high similarity
    .slice(0, 3); // Return top 3 results
  
  return {
    documents: sortedDocuments,
    error: null
  };
}

// Helper function to calculate cosine similarity between two vectors
function calculateCosineSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  return dotProduct / (magnitudeA * magnitudeB);
}