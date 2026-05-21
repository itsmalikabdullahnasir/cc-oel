import fs from 'fs';
import path from 'path';
import type { Feedback } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'feedback.json');

function makeSeedData(): Feedback[] {
  const now = Date.now();
  const ago = (ms: number) => new Date(now - ms).toISOString();
  return [
    { id: 'seed-1', content: 'The new dashboard design is absolutely stunning! The dark mode is exactly what I needed. Really love the attention to detail throughout the entire interface.', category: 'compliment', isReviewed: true, createdAt: ago(1000 * 60 * 25) },
    { id: 'seed-2', content: 'When exporting data as CSV the download sometimes fails silently without any error message. Reproducible on Chrome 120 and Firefox 121.', category: 'bug', isReviewed: false, createdAt: ago(1000 * 60 * 90) },
    { id: 'seed-3', content: 'Would love to see a native mobile app! The web version is great but a dedicated iOS/Android experience would make this perfect for on-the-go use.', category: 'feature', isReviewed: true, createdAt: ago(1000 * 60 * 60 * 26) },
    { id: 'seed-4', content: 'The search functionality could be improved. It would be really helpful if it searched through all metadata fields, not just the content body.', category: 'suggestion', isReviewed: false, createdAt: ago(1000 * 60 * 60 * 30) },
    { id: 'seed-5', content: 'Page load times feel a bit slow sometimes, especially on the analytics section. Could we get some optimization here?', category: 'complaint', isReviewed: true, createdAt: ago(1000 * 60 * 60 * 50) },
    { id: 'seed-6', content: 'Can you add a light mode option? Some users in our team prefer lighter interfaces for accessibility reasons.', category: 'feature', isReviewed: false, createdAt: ago(1000 * 60 * 60 * 54) },
    { id: 'seed-7', content: 'The analytics section is incredibly useful for our team. The visualizations are clear and the data exports work great. Keep up the excellent work!', category: 'compliment', isReviewed: true, createdAt: ago(1000 * 60 * 60 * 72) },
    { id: 'seed-8', content: 'Email notifications seem to be broken — not receiving alerts even with notifications enabled in account settings.', category: 'bug', isReviewed: false, createdAt: ago(1000 * 60 * 60 * 78) },
    { id: 'seed-9', content: 'Adding keyboard shortcuts for common actions would be amazing. Power users would really benefit from Cmd+K style navigation.', category: 'suggestion', isReviewed: true, createdAt: ago(1000 * 60 * 60 * 96) },
    { id: 'seed-10', content: 'The API documentation is thorough and well-structured. Integration was straightforward and everything worked as described.', category: 'general', isReviewed: true, createdAt: ago(1000 * 60 * 60 * 120) },
    { id: 'seed-11', content: 'Bulk operations would be a game changer. Selecting multiple feedback items and acting on them all at once would save so much time.', category: 'feature', isReviewed: false, createdAt: ago(1000 * 60 * 60 * 125) },
    { id: 'seed-12', content: 'Pricing information is hard to find. A clearer breakdown of what is included in each plan would help with the purchase decision.', category: 'complaint', isReviewed: true, createdAt: ago(1000 * 60 * 60 * 144) },
  ];
}

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(makeSeedData(), null, 2), 'utf-8');
  }
}

export function getAllFeedback(): Feedback[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export function addFeedback(feedback: Feedback): Feedback {
  const items = getAllFeedback();
  items.unshift(feedback);
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
  return feedback;
}

export function updateFeedback(id: string, updates: Partial<Feedback>): Feedback | null {
  const items = getAllFeedback();
  const idx = items.findIndex(f => f.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates };
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
  return items[idx];
}

export function deleteFeedback(id: string): boolean {
  const items = getAllFeedback();
  const filtered = items.filter(f => f.id !== id);
  if (filtered.length === items.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
