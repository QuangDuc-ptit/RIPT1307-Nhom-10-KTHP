import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding showtimes for client testing...');

  // Lấy ra 20 bộ phim đang chiếu
  const movies = await prisma.movie.findMany({ take: 20 });
  
  if (movies.length === 0) {
    console.log('No movie found. Please seed movies first.');
    return;
  }

  // Lấy tất cả các rạp và phòng chiếu
  const rooms = await prisma.room.findMany();
  if (rooms.length === 0) {
    console.log('No rooms found. Please run seedTheaters.ts first.');
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const showtimesToCreate = [];

  // Xoá suất chiếu cũ của phim này để tránh trùng lặp nếu chạy lại
  await prisma.showtime.deleteMany({
    where: { movieId: { in: movies.map(m => m.id) } }
  });

  // Tạo suất chiếu cho 3 ngày tới
  for (let d = 0; d < 3; d++) {
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + d);

    // Mỗi phòng 2 suất chiếu mỗi ngày, lặp qua tất cả phim
    for (const room of rooms) {
      for (const movie of movies) {
        for (const h of [10, 18]) {
          const startTime = new Date(targetDate);
          startTime.setHours(h, 0, 0, 0);
          
          showtimesToCreate.push({
            movieId: movie.id,
            roomId: room.id,
            startTime
          });
        }
      }
    }
  }

  // Tạo suất chiếu mới
  for (const st of showtimesToCreate) {
    const created = await prisma.showtime.create({
      data: {
        movieId: st.movieId,
        roomId: st.roomId,
        startTime: st.startTime
      }
    });

    // Tạo luôn showtimeSeats tương ứng với room's seats
    const seats = await prisma.seat.findMany({ where: { roomId: st.roomId } });
    
    // Giả lập một vài ghế đã được đặt
    const showtimeSeats = seats.map((seat, index) => {
      // Đặt trước khoảng 10% số ghế ngẫu nhiên
      const isBooked = Math.random() < 0.1;
      return {
        showtimeId: created.id,
        seatId: seat.id,
        status: isBooked ? 'BOOKED' : 'AVAILABLE'
      };
    });

    // Prisma không có createMany cho enum với ts-node (đôi khi lỗi type) nhưng thường thì đc
    await prisma.showtimeSeat.createMany({
      data: showtimeSeats as any
    });
    
    console.log(`Created showtime for room ${st.roomId} at ${st.startTime.toLocaleString()} with ${showtimeSeats.length} seats`);
  }

  console.log('Showtimes seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
