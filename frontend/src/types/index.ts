// types dùng chung cho cả admin và client

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  avatar?: string | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string | null;
  published: boolean;
  authorId: string;
  author?: Pick<User, 'id' | 'name' | 'avatar'>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorPayload {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string; // ví dụ: "createdAt:desc"
}

// Type riêng cho movie detail (từ client)
export interface MovieDetailData {
  title: string;
  coverImage: string;
  tagline: string;
  metaInfo: string;
  rating: number;
  description: string;
}