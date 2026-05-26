export interface OrderSummaryType {
  movieName: string;
  poster: string;
  cinemaName: string;
  room: string;
  showtime: string;
  seats: string[];
  ticketPrice: number;
  comboPrice: number; // Tiền bắp nước (nếu có)
}

export interface VoucherType {
  code: string;
  discountValue: number;
  description: string;
}