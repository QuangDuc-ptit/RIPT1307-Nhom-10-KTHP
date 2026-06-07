import { apiClient } from './client';

export interface Movie {
  id: string | number;
  title: string;
  category: 'dang-chieu' | 'sap-chieu';
  genre: string;
  duration: string;
  rating: number;
  age: string;
  poster: string;
  coverImage: string;
  tagline: string;
  description: string;
  cast: any[];
  reviews: any;
  related: any[];
  date?: string;
}

const mapBackendToClientMovie = (m: any): Movie => {
  const isNowShowing = m.releaseDate ? new Date(m.releaseDate) <= new Date() : true;
  return {
    id: m.id,
    title: m.title || 'Đang cập nhật',
    category: isNowShowing ? 'dang-chieu' : 'sap-chieu',
    genre: m.genres && m.genres.length > 0 ? m.genres.map((g: any) => g.name).join(', ') : 'Đang cập nhật',
    duration: m.duration ? `${m.duration} phút` : '120 phút',
    rating: 8.5, // Default for now
    age: 'T16', // Default for now
    poster: m.poster || '/movies/default-poster.jpg',
    coverImage: m.backdrop || m.poster || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2000&auto=format&fit=crop',
    tagline: m.title || '',
    description: m.overview || 'Đang cập nhật',
    cast: [],
    reviews: { average: 8.5, totalVotes: '1k', breakdown: [] },
    related: [],
    date: m.releaseDate ? new Date(m.releaseDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : undefined,
  };
};

export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const res = await apiClient.get('/phim?pageSize=50');
    if (res.data?.items) {
      return res.data.items.map(mapBackendToClientMovie);
    }
    return [];
  } catch (error) {
    console.error("Lỗi khi tải danh sách phim", error);
    return [];
  }
};

export const getNowShowingMovies = async (): Promise<Movie[]> => {
  const all = await fetchMovies();
  return all.filter(movie => movie.category === 'dang-chieu');
};

export const getComingSoonMovies = async (): Promise<Movie[]> => {
  const all = await fetchMovies();
  return all.filter(movie => movie.category === 'sap-chieu');
};

export const getMovieById = async (id: string | number): Promise<Movie | null> => {
  try {
    const res = await apiClient.get(`/phim/${id}`);
    if (res.data) {
      return mapBackendToClientMovie(res.data);
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi tải chi tiết phim", error);
    return null;
  }
};