import { apiClient } from './client';

export interface Cinema {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Seat {
  id: string;
  roomId: string;
  row: string;
  number: number;
  type: 'NORMAL' | 'VIP' | 'SWEETBOX';
}

export interface Room {
  id: string;
  name: string;
  cinemaId: string;
  cinema?: Cinema;
  seats?: Seat[];
  createdAt: string;
  updatedAt: string;
}

export const theatersApi = {
  getCinemas: () => apiClient.get<Cinema[]>('/rap-chieu').then(r => r.data),
  createCinema: (data: { name: string; address: string }) => apiClient.post<Cinema>('/rap-chieu', data).then(r => r.data),
  getRooms: (cinemaId: string) => apiClient.get<Room[]>(`/phong-chieu?cinemaId=${cinemaId}`).then(r => r.data),
  createRoom: (data: { name: string; cinemaId: string }) => apiClient.post<Room>('/phong-chieu', data).then(r => r.data),
  getRoomDetail: (id: string) => apiClient.get<Room>(`/phong-chieu/${id}`).then(r => r.data),
  generateSeats: (roomId: string, data: { rowCount: number; seatsPerRow: number; vipRows?: string[]; sweetboxRows?: string[] }) => 
    apiClient.post<{ success: boolean, count: number }>(`/phong-chieu/${roomId}/sinh-ghe`, data).then(r => r.data),
};
