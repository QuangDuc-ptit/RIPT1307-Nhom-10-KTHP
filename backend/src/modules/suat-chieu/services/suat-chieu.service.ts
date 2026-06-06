import { prisma } from '@/config/db';
import { conflict, notFound } from '@/utils/errors';

const SHOWTIME_BUFFER_MINUTES = 15;

const includeConfig = {
  movie: {
    include: {
      translations: true,
      genres: { include: { genre: true } },
    },
  },
  room: {
    include: {
      cinema: true,
      seats: true,
    },
  },
} as const;

const toIso = (value: Date | null | undefined) => (value ? value.toISOString() : null);

const formatShowtime = (showtime: any) => ({
  id: showtime.id,
  movieId: showtime.movieId,
  roomId: showtime.roomId,
  startTime: showtime.startTime.toISOString(),
  endTime: calculateEndTime(showtime.startTime, showtime.movie?.duration).toISOString(),
  createdAt: showtime.createdAt.toISOString(),
  updatedAt: showtime.updatedAt.toISOString(),
  movie: showtime.movie
    ? {
        id: showtime.movie.id,
        title: showtime.movie.title,
        poster: showtime.movie.poster,
        backdrop: showtime.movie.backdrop,
        overview: showtime.movie.overview,
        duration: showtime.movie.duration,
        releaseDate: toIso(showtime.movie.releaseDate),
        status: showtime.movie.status,
        isActive: showtime.movie.isActive,
        translations: showtime.movie.translations,
        genres: showtime.movie.genres.map((item: any) => ({
          id: item.genre.id,
          name: item.genre.name,
          slug: item.genre.slug,
        })),
      }
    : null,
  room: showtime.room
    ? {
        id: showtime.room.id,
        name: showtime.room.name,
        cinemaId: showtime.room.cinemaId,
        cinema: showtime.room.cinema,
        seats: showtime.room.seats,
      }
    : null,
});

function calculateEndTime(startTime: Date, duration?: number | null) {
  const minutes = (duration ?? 0) + SHOWTIME_BUFFER_MINUTES;
  return new Date(startTime.getTime() + minutes * 60 * 1000);
}

async function ensureMovieAndRoom(movieId: string, roomId: string) {
  const [movie, room] = await Promise.all([
    prisma.movie.findUnique({ where: { id: movieId } }),
    prisma.room.findUnique({ where: { id: roomId }, include: { seats: true } }),
  ]);

  if (!movie) throw notFound('Không tìm thấy phim');
  if (!room) throw notFound('Không tìm thấy phòng chiếu');

  return { movie, room };
}

async function ensureNoOverlap(params: {
  roomId: string;
  movieDuration?: number | null;
  startTime: Date;
  excludeId?: string;
}) {
  const { roomId, movieDuration, startTime, excludeId } = params;
  const candidateEndTime = calculateEndTime(startTime, movieDuration);

  const existingShowtimes = await prisma.showtime.findMany({
    where: {
      roomId,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    include: {
      movie: {
        select: {
          title: true,
          duration: true,
        },
      },
    },
    orderBy: { startTime: 'asc' },
  });

  const overlapped = existingShowtimes.find((item) => {
    const existingEndTime = calculateEndTime(item.startTime, item.movie?.duration);
    return startTime < existingEndTime && candidateEndTime > item.startTime;
  });

  if (overlapped) {
    const existingEndTime = calculateEndTime(overlapped.startTime, overlapped.movie?.duration);
    throw conflict(
      `Phòng chiếu đã có lịch từ ${overlapped.startTime.toISOString()} đến ${existingEndTime.toISOString()} cho phim ${overlapped.movie?.title ?? 'khác'}`,
    );
  }
}

export const suatChieuService = {
  async list(filters: { movieId?: string; roomId?: string; cinemaId?: string }) {
    const items = await prisma.showtime.findMany({
      where: {
        ...(filters.movieId ? { movieId: filters.movieId } : {}),
        ...(filters.roomId ? { roomId: filters.roomId } : {}),
        ...(filters.cinemaId ? { room: { cinemaId: filters.cinemaId } } : {}),
      },
      include: includeConfig,
      orderBy: { startTime: 'asc' },
    });

    return items.map(formatShowtime);
  },

  async detail(id: string) {
    const showtime = await prisma.showtime.findUnique({
      where: { id },
      include: {
        ...includeConfig,
        seats: {
          include: {
            seat: true,
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: [{ seat: { row: 'asc' } }, { seat: { number: 'asc' } }],
        },
      },
    });

    if (!showtime) throw notFound('Không tìm thấy suất chiếu');

    return {
      ...formatShowtime(showtime),
      seats: showtime.seats,
    };
  },

  async create(data: { movieId: string; roomId: string; startTime: string }) {
    const startTime = new Date(data.startTime);
    const { movie, room } = await ensureMovieAndRoom(data.movieId, data.roomId);

    await ensureNoOverlap({
      roomId: data.roomId,
      movieDuration: movie.duration,
      startTime,
    });

    const showtime = await prisma.$transaction(async (tx) => {
      const created = await tx.showtime.create({
        data: {
          movieId: data.movieId,
          roomId: data.roomId,
          startTime,
        },
      });

      if (room.seats.length > 0) {
        await tx.showtimeSeat.createMany({
          data: room.seats.map((seat) => ({
            showtimeId: created.id,
            seatId: seat.id,
          })),
        });
      }

      return tx.showtime.findUnique({
        where: { id: created.id },
        include: includeConfig,
      });
    });

    if (!showtime) throw notFound('Không tìm thấy suất chiếu');
    return formatShowtime(showtime);
  },

  async update(id: string, data: { movieId?: string; roomId?: string; startTime?: string }) {
    const existing = await prisma.showtime.findUnique({ where: { id } });
    if (!existing) throw notFound('Không tìm thấy suất chiếu');

    const nextMovieId = data.movieId ?? existing.movieId;
    const nextRoomId = data.roomId ?? existing.roomId;
    const nextStartTime = data.startTime ? new Date(data.startTime) : existing.startTime;

    const { movie, room } = await ensureMovieAndRoom(nextMovieId, nextRoomId);

    await ensureNoOverlap({
      roomId: nextRoomId,
      movieDuration: movie.duration,
      startTime: nextStartTime,
      excludeId: id,
    });

    const shouldRegenerateSeats = nextRoomId !== existing.roomId;

    const showtime = await prisma.$transaction(async (tx) => {
      const updated = await tx.showtime.update({
        where: { id },
        data: {
          movieId: nextMovieId,
          roomId: nextRoomId,
          startTime: nextStartTime,
        },
      });

      if (shouldRegenerateSeats) {
        await tx.showtimeSeat.deleteMany({ where: { showtimeId: id } });

        if (room.seats.length > 0) {
          await tx.showtimeSeat.createMany({
            data: room.seats.map((seat) => ({
              showtimeId: updated.id,
              seatId: seat.id,
            })),
          });
        }
      }

      return tx.showtime.findUnique({
        where: { id: updated.id },
        include: includeConfig,
      });
    });

    if (!showtime) throw notFound('Không tìm thấy suất chiếu');
    return formatShowtime(showtime);
  },

  async remove(id: string) {
    const existing = await prisma.showtime.findUnique({ where: { id } });
    if (!existing) throw notFound('Không tìm thấy suất chiếu');
    await prisma.showtime.delete({ where: { id } });
  },
};
