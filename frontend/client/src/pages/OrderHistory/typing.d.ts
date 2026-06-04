export interface OrderType {
  orderId: string;
  movieTitle: string;
  poster: string;
  cinemaName: string;
  room: string;
  showtime: string;
  seats: string[];
  totalPrice: number;
  status: 'completed' | 'cancelled';
  purchaseDate: string;
}