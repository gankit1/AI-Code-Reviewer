export const APP_NAME = 'CodeLens AI';
export const APP_DESCRIPTION = 'AI-Powered Code Review Platform';

export const SEVERITY_CONFIG = {
  critical: { label: 'Critical', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-500' },
  high: { label: 'High', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', dot: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-500' },
  low: { label: 'Low', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-500' },
  info: { label: 'Info', color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', dot: 'bg-gray-500' },
} as const;

export const CATEGORY_CONFIG = {
  bug: { label: 'Bug', icon: '🐛' },
  security: { label: 'Security', icon: '🔒' },
  performance: { label: 'Performance', icon: '⚡' },
  'best-practice': { label: 'Best Practice', icon: '✨' },
  style: { label: 'Style', icon: '🎨' },
  typescript: { label: 'TypeScript', icon: '📘' },
} as const;

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Unknown: '#6b7280',
};

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Repositories', href: '/repositories', icon: 'GitFork' },
  { label: 'Pull Requests', href: '/pull-requests', icon: 'GitPullRequest' },
  { label: 'Reviews', href: '/reviews', icon: 'FileSearch' },
  { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
] as const;
