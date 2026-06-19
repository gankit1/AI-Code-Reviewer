export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
