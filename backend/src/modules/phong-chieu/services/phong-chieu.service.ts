import { prisma } from '@/config/db';
import { notFound, conflict } from '@/utils/errors';
import { SeatType } from '@prisma/client';

export const phongChieuService = {
  list: async (cinemaId?: string) => {
    return prisma.room.findMany({
      where: cinemaId ? { cinemaId } : undefined,
      include: { cinema: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  detail: async (id: string) => {
    const room = await prisma.room.findUnique({
      where: { id },
      include: { cinema: true, seats: true },
    });
    if (!room) throw notFound('Không tìm thấy phòng chiếu');
    return room;
  },

  create: async (data: { name: string; cinemaId: string }) => {
    const cinema = await prisma.cinema.findUnique({ where: { id: data.cinemaId } });
    if (!cinema) throw notFound('Không tìm thấy rạp chiếu');
    
    // Check if room name already exists in this cinema
    const existing = await prisma.room.findFirst({
      where: { name: data.name, cinemaId: data.cinemaId }
    });
    if (existing) throw conflict('Tên phòng chiếu đã tồn tại trong rạp này');

    return prisma.room.create({ data });
  },

  update: async (id: string, data: { name: string }) => {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) throw notFound('Không tìm thấy phòng chiếu');

    const existing = await prisma.room.findFirst({
      where: { name: data.name, cinemaId: room.cinemaId, id: { not: id } }
    });
    if (existing) throw conflict('Tên phòng chiếu đã tồn tại trong rạp này');

    return prisma.room.update({ where: { id }, data });
  },

  remove: async (id: string) => {
    const existing = await prisma.room.findUnique({ where: { id } });
    if (!existing) throw notFound('Không tìm thấy phòng chiếu');
    return prisma.room.delete({ where: { id } });
  },

  generateSeats: async (roomId: string, config: { rowCount: number; seatsPerRow: number; vipRows?: string[]; sweetboxRows?: string[] }) => {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw notFound('Không tìm thấy phòng chiếu');

    const { rowCount, seatsPerRow, vipRows = [], sweetboxRows = [] } = config;
    
    // Delete existing seats
    await prisma.seat.deleteMany({ where: { roomId } });

    const newSeats = [];
    // rowCount 1-26 mapped to A-Z
    for (let i = 0; i < rowCount; i++) {
      const rowChar = String.fromCharCode(65 + i); // 65 is 'A'
      
      let type: SeatType = SeatType.NORMAL;
      if (vipRows.includes(rowChar)) type = SeatType.VIP;
      if (sweetboxRows.includes(rowChar)) type = SeatType.SWEETBOX;

      for (let number = 1; number <= seatsPerRow; number++) {
        newSeats.push({
          roomId,
          row: rowChar,
          number,
          type
        });
      }
    }

    await prisma.seat.createMany({ data: newSeats });
    
    return { success: true, count: newSeats.length };
  }
};
