/// <reference types="node" />
import { PrismaClient, SeatType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding theaters...');

  // Xoá dữ liệu rạp cũ (nếu muốn)
  // Lưu ý: Tuỳ thuộc vào nghiệp vụ, có thể bạn không muốn xoá rạp nếu đã có dữ liệu.
  // Ở đây tôi dùng lệnh create trực tiếp, nếu lỗi do trùng lặp (nếu có unique) thì sẽ throw.

  const cgvVincom = await prisma.cinema.create({
    data: {
      name: 'KSTAR Vincom Bà Triệu',
      address: '191 Bà Triệu, Lê Đại Hành, Hai Bà Trưng, Hà Nội',
    },
  });

  const cgvLandmark = await prisma.cinema.create({
    data: {
      name: 'KSTAR Landmark 81',
      address: 'Tầng B1, Vincom Center Landmark 81, 772 Điện Biên Phủ, Phường 22, Bình Thạnh, HCM',
    },
  });

  console.log('Created Cinemas:', cgvVincom.name, cgvLandmark.name);

  const roomsToCreate = [
    { name: 'Screen 1 - 2D', cinemaId: cgvVincom.id, rows: 12, cols: 14, vipRows: ['E', 'F', 'G', 'H'], sweetboxRows: ['K', 'L'] },
    { name: 'IMAX 01', cinemaId: cgvVincom.id, rows: 15, cols: 16, vipRows: ['F', 'G', 'H', 'I', 'J'], sweetboxRows: ['N', 'O'] },
    { name: 'Screen 1 - 2D', cinemaId: cgvLandmark.id, rows: 10, cols: 12, vipRows: ['D', 'E', 'F'], sweetboxRows: ['I', 'J'] },
  ];

  for (const r of roomsToCreate) {
    const room = await prisma.room.create({
      data: {
        name: r.name,
        cinemaId: r.cinemaId,
      },
    });

    console.log(`Created Room: ${room.name} in Cinema ${r.cinemaId}`);

    // Generate seats
    const newSeats = [];
    for (let i = 0; i < r.rows; i++) {
      const rowChar = String.fromCharCode(65 + i); // 'A'
      
      let type: SeatType = SeatType.NORMAL;
      if (r.vipRows.includes(rowChar)) type = SeatType.VIP;
      if (r.sweetboxRows.includes(rowChar)) type = SeatType.SWEETBOX;

      for (let number = 1; number <= r.cols; number++) {
        newSeats.push({
          roomId: room.id,
          row: rowChar,
          number,
          type
        });
      }
    }

    await prisma.seat.createMany({ data: newSeats });
    console.log(`Generated ${newSeats.length} seats for ${room.name}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
