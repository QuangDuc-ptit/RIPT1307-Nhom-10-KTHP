import { prisma } from '@/config/db';
import { BookingStatus } from '@prisma/client';

export const dashboardService = {
  async getStats(days: number = 7) {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const revenueAggr = await prisma.booking.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: BookingStatus.SUCCESS,
      },
    });
    const totalRevenue = revenueAggr._sum.totalAmount || 0;

    const ticketsSold = await prisma.bookingSeat.count({
      where: {
        booking: {
          status: BookingStatus.SUCCESS,
        },
      },
    });

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    const bookedSeatsCount = await prisma.showtimeSeat.count({
      where: {
        status: 'BOOKED',
      },
    });
    const allSeatsCount = await prisma.showtimeSeat.count();
    const occupancyRate = allSeatsCount > 0 ? Math.round((bookedSeatsCount / allSeatsCount) * 100) : 0;

    const bookingsByDay = await prisma.booking.findMany({
      where: {
        status: BookingStatus.SUCCESS,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    const revenueTrendMap = new Map<string, number>();
    
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
      revenueTrendMap.set(dateStr, 0);
    }

    bookingsByDay.forEach(booking => {
      const d = new Date(booking.createdAt);
      const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
      if (revenueTrendMap.has(dateStr)) {
        revenueTrendMap.set(dateStr, (revenueTrendMap.get(dateStr) || 0) + booking.totalAmount);
      }
    });

    const revenueTrend = Array.from(revenueTrendMap.entries()).map(([name, revenue]) => ({
      name,
      revenue,
    }));

    const topMoviesRaw = await prisma.bookingSeat.findMany({
      where: {
        booking: {
          status: BookingStatus.SUCCESS,
          createdAt: {
            gte: startOfMonth,
          },
        },
      },
      include: {
        showtimeSeat: {
          include: {
            showtime: {
              include: {
                movie: true,
              },
            },
          },
        },
      },
    });

    const movieTicketCountMap = new Map<string, { title: string, count: number }>();
    topMoviesRaw.forEach(seat => {
      const movie = seat.showtimeSeat.showtime.movie;
      if (!movieTicketCountMap.has(movie.id)) {
        movieTicketCountMap.set(movie.id, { title: movie.title, count: 0 });
      }
      movieTicketCountMap.get(movie.id)!.count++;
    });

    const sortedMovies = Array.from(movieTicketCountMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const totalTicketsThisMonth = topMoviesRaw.length;
    const topMovies = sortedMovies.map(m => ({
      title: m.title,
      tickets: m.count,
      percentage: totalTicketsThisMonth > 0 ? Math.round((m.count / totalTicketsThisMonth) * 100) : 0,
    }));

    while (topMovies.length < 4) {
      topMovies.push({ title: '--', tickets: 0, percentage: 0 });
    }

    const recentBookingsRaw = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        showtime: {
          include: {
            movie: true,
            room: true,
          },
        },
      },
    });

    const recentBookings = recentBookingsRaw.map(b => ({
      key: b.id,
      user: b.user.name || b.user.email,
      movie: b.showtime.movie.title,
      theater: b.showtime.room.name,
      amount: b.totalAmount,
      status: b.status === BookingStatus.SUCCESS ? 'Completed' : 'Pending',
    }));

    const activeHoldSeats = await prisma.showtimeSeat.count({
      where: { status: 'RESERVED' },
    });

    return {
      totalRevenue,
      ticketsSold,
      newUsers,
      occupancyRate,
      revenueTrend,
      topMovies,
      recentBookings,
      activeHoldSeats,
    };
  },
};
