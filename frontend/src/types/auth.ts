export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  githubUsername?: string;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  plan: 'free' | 'pro' | 'enterprise';
  aiTokensUsed: number;
  aiTokensLimit: number;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}
