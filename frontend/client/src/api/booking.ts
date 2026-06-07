import { apiClient } from './client';

export type SeatStatus = 'AVAILABLE' | 'BOOKED' | 'LOCKED' | 'RESERVED';

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'NORMAL' | 'VIP' | 'SWEETBOX';
  roomId: string;
}

export interface ShowtimeSeat {
  id: string;
  showtimeId: string;
  seatId: string;
  status: SeatStatus;
  userId?: string;
  version: number;
  seat: Seat;
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
  },

  giuGhe: async (showtimeSeatId: string, version: number) => {
    const res = await apiClient.post('/dat-ve/giu-ghe', { showtimeSeatId, version });
    return res;
  },

  huyGhe: async (showtimeSeatId: string) => {
    const res = await apiClient.post('/dat-ve/huy-ghe', { showtimeSeatId });
    return res;
  },

  createBooking: async (data: { showtimeId: string, showtimeSeatIds: string[], foods: { foodId: string, quantity: number }[] }) => {
    const res = await apiClient.post('/dat-ve/booking', data);
    return res;
  }
};
