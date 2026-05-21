export interface Feedback {
  id: string;
  content: string;
  category: string;
  isReviewed: boolean;
  createdAt: string;
}

export const CATEGORIES = [
  { id: 'bug', label: 'Bug Report', icon: '🐛', color: 'rose' },
  { id: 'feature', label: 'Feature Request', icon: '✨', color: 'blue' },
  { id: 'general', label: 'General', icon: '💬', color: 'zinc' },
  { id: 'complaint', label: 'Complaint', icon: '😤', color: 'orange' },
  { id: 'compliment', label: 'Compliment', icon: '🌟', color: 'yellow' },
  { id: 'suggestion', label: 'Suggestion', icon: '💡', color: 'violet' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
