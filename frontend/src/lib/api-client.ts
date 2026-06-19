import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

const API_BASE_URL = 'http://localhost:5001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Typed API methods
export const api = {
  // Auth
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      apiClient.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
      apiClient.post('/auth/login', data),
    getGitHubUrl: () => apiClient.get('/auth/github'),
    getMe: () => apiClient.get('/auth/me'),
  },

  // Repositories
  repositories: {
    list: (params?: { page?: number; limit?: number; search?: string }) =>
      apiClient.get('/repositories', { params }),
    listGitHub: () => apiClient.get('/repositories/github'),
    import: (data: Record<string, unknown>) =>
      apiClient.post('/repositories/import', data),
    get: (id: string) => apiClient.get(`/repositories/${id}`),
    delete: (id: string) => apiClient.delete(`/repositories/${id}`),
    sync: (id: string) => apiClient.post(`/repositories/${id}/sync`),
    getPulls: (id: string, params?: { page?: number; limit?: number }) =>
      apiClient.get(`/repositories/${id}/pulls`, { params }),
  },

  // Reviews
  reviews: {
    list: (params?: { page?: number; limit?: number; status?: string; repositoryId?: string }) =>
      apiClient.get('/reviews', { params }),
    get: (id: string) => apiClient.get(`/reviews/${id}`),
    trigger: (pullRequestId: string) =>
      apiClient.post(`/reviews/pull/${pullRequestId}/analyze`),
  },

  // AI features
  ai: {
    explain: (data: { code: string; filename: string }) =>
      apiClient.post('/reviews/ai/explain', data),
    refactor: (data: { code: string; filename: string }) =>
      apiClient.post('/reviews/ai/refactor', data),
    generateTests: (data: { code: string; filename: string }) =>
      apiClient.post('/reviews/ai/generate-tests', data),
  },

  // Analytics
  analytics: {
    overview: () => apiClient.get('/analytics/overview'),
    trends: (days?: number) => apiClient.get('/analytics/trends', { params: { days } }),
    repoHealth: () => apiClient.get('/analytics/repositories'),
    issueDistribution: () => apiClient.get('/analytics/issues'),
  },
};
