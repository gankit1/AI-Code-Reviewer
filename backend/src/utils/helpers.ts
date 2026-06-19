import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function calculateOverallScore(scores: {
  security: number;
  performance: number;
  maintainability: number;
  readability: number;
}): number {
  const weights = {
    security: 0.35,
    performance: 0.25,
    maintainability: 0.25,
    readability: 0.15,
  };

  const weighted =
    scores.security * weights.security +
    scores.performance * weights.performance +
    scores.maintainability * weights.maintainability +
    scores.readability * weights.readability;

  return Math.round(weighted);
}
