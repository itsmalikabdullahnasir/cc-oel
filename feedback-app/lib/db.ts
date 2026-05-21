import { supabase } from './supabase';
import type { Feedback } from '@/types';

type DbRow = {
  id: string;
  content: string;
  category: string;
  is_reviewed: boolean;
  created_at: string;
};

function toFeedback(row: DbRow): Feedback {
  return {
    id: row.id,
    content: row.content,
    category: row.category,
    isReviewed: row.is_reviewed,
    createdAt: row.created_at,
  };
}

export async function getAllFeedback(): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toFeedback);
}

export async function addFeedback(feedback: Feedback): Promise<Feedback> {
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      id: feedback.id,
      content: feedback.content,
      category: feedback.category,
      is_reviewed: feedback.isReviewed,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return toFeedback(data);
}

export async function updateFeedback(
  id: string,
  updates: Partial<Feedback>
): Promise<Feedback | null> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.isReviewed !== undefined) dbUpdates.is_reviewed = updates.isReviewed;
  if (updates.content !== undefined) dbUpdates.content = updates.content;
  if (updates.category !== undefined) dbUpdates.category = updates.category;

  const { data, error } = await supabase
    .from('feedback')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return toFeedback(data);
}

export async function deleteFeedback(id: string): Promise<boolean> {
  const { error } = await supabase.from('feedback').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}
