import { supabase } from './supabase';
import { Chat, Message } from '../types';

// Chat functions
export async function getChats() {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .order('created_at', { ascending: false });
    
  return { data, error };
}

export async function createChat(title: string) {
  const { data, error } = await supabase
    .from('chats')
    .insert([{ title }])
    .select()
    .single();
    
  return { data, error };
}

export async function updateChat(id: string, title: string) {
  const { data, error } = await supabase
    .from('chats')
    .update({ title })
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
}

export async function deleteChat(id: string) {
  // First delete all messages in the chat
  await supabase
    .from('messages')
    .delete()
    .eq('chat_id', id);
    
  // Then delete the chat
  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', id);
    
  return { error };
}

// Message functions
export async function getMessages(chatId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });
    
  return { data, error };
}

export async function createMessage(chatId: string, role: 'user' | 'assistant', content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ chat_id: chatId, role, content }])
    .select()
    .single();
    
  return { data, error };
}