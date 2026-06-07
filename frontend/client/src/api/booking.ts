import { apiClient } from './client';

export interface ShowtimeSeat {
  id: string;
  showtimeId: string;
  seatId: string;
  status: 'AVAILABLE' | 'BOOKED' | 'LOCKED';
  userId?: string;
  seat: {
    id: string;
    row: string;
    number: number;
    type: 'NORMAL' | 'VIP' | 'SWEETBOX';
    roomId: string;
  };
}

export interface Room {
  id: string;
  name: string;
  cinemaId: string;
  cinema: {
    id: string;
    name: string;
    address: string;
  };
}

export interface Showtime {
  id: string;
  movieId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  room: Room;
  seats?: ShowtimeSeat[];
}

export const bookingApi = {
  getShowtimesByMovie: async (movieId: string): Promise<Showtime[]> => {
    const res = await apiClient.get(`/suat-chieu?movieId=${movieId}`);
    return (res as any).data;
  },

  getShowtimeDetail: async (showtimeId: string): Promise<Showtime> => {
    const res = await apiClient.get(`/suat-chieu/${showtimeId}`);
    return (res as any).data;
  }
};
