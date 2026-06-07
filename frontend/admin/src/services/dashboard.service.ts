import { apiClient } from '../api/client';

export interface DashboardStats {
  totalRevenue: number;
  ticketsSold: number;
  newUsers: number;
  occupancyRate: number;
  revenueTrend: { name: string; revenue: number }[];
  topMovies: { title: string; tickets: number; percentage: number }[];
  recentBookings: {
    key: string;
    user: string;
    movie: string;
    theater: string;
    amount: number;
    status: string;
  }[];
  activeHoldSeats: number;
}

export const dashboardService = {
  async getStats(days: number = 7): Promise<DashboardStats> {
    const res = await apiClient.get(`/admin/dashboard/stats?days=${days}`);
    return res.data;
  },
};
