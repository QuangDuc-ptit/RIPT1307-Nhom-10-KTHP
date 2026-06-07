/// <reference types="node" />
import { PrismaClient, MovieStatus } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

const moviesData = [
  {
    title: 'Cục Vàng Của Ngoại',
    category: 'dang-chieu',
    genre: 'Tình cảm, Hài hước',
    duration: 115,
    poster: '/movies/Cuc_Vang_Cua_Ngoai.jpg',
    coverImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2000&auto=format&fit=crop',
    description: 'Câu chuyện cảm động và hài hước về tình bà cháu. Một người bà tần tảo cả đời và đứa cháu trai lém lỉnh nhưng hiếu thảo. Hành trình của họ mang lại những tràng cười sảng khoái và những giọt nước mắt đầy ý nghĩa về giá trị gia đình.',
    releaseDate: new Date('2024-05-01'),
  },
  {
    title: 'Phim: Mai',
    category: 'dang-chieu',
    genre: 'Tình cảm, Tâm lý',
    duration: 131,
    poster: '/movies/Mai.jpg',
    coverImage: '/movies/Mai.jpg',
    description: 'Mai là một người phụ nữ có số phận trớ trêu, luôn khao khát được yêu thương nhưng lại bị quá khứ và những định kiến xã hội vùi dập. Khi Dương - một chàng trai trẻ tuổi, nhiệt huyết xuất hiện, cuộc đời Mai bắt đầu thay đổi.',
    releaseDate: new Date('2024-02-10'),
  },
  { title: 'Kỹ Nguyên Robot', category: 'dang-chieu', genre: 'Hành động, Khoa học', duration: 115, poster: '/movies/poster3.png', coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop', description: 'Năm 2050, một thanh tra phải đối mặt với cuộc nổi dậy của các robot phục vụ có nhận thức.', releaseDate: new Date('2024-03-01') },
  { title: 'Bản Giao Hưởng Cuối Cùng', category: 'dang-chieu', genre: 'Âm nhạc, Lãng mạn', duration: 130, poster: '/movies/poster4.png', coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2000&auto=format&fit=crop', description: 'Câu chuyện tình yêu tuyệt đẹp giữa một nghệ sĩ piano mù và một nữ ca sĩ vô danh.', releaseDate: new Date('2024-04-15') },
  { title: 'Tiếng Gọi Trong Đêm', category: 'dang-chieu', genre: 'Kinh dị, Giật gân', duration: 108, poster: '/movies/poster5.png', coverImage: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=2000&auto=format&fit=crop', description: 'Một MC Radio nhận được những cuộc gọi kỳ lạ từ một người tự xưng là đã chết.', releaseDate: new Date('2024-05-20') },
  { title: 'Chiến Binh Ánh Sáng', category: 'dang-chieu', genre: 'Hành động, Kỳ ảo', duration: 135, poster: '/movies/poster6.png', coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop', description: 'Hành trình anh hùng của chiến binh mang sức mạnh ánh sáng.', releaseDate: new Date('2024-05-15') },
  { title: 'Thành Phố Ngầm', category: 'dang-chieu', genre: 'Viễn tưởng, Bí ẩn', duration: 112, poster: '/movies/poster7.png', coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop', description: 'Thám hiểm thành phố công nghệ cao nằm sâu dưới lòng đất.', releaseDate: new Date('2024-04-10') },
  { title: 'Mật Mã Cuối Cùng', category: 'dang-chieu', genre: 'Giật gân, Tội phạm', duration: 128, poster: '/movies/poster8.png', coverImage: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2000&auto=format&fit=crop', description: 'Một thám tử phải giải mã các ẩn số của tên tội phạm thiên tài.', releaseDate: new Date('2024-03-25') },
  { title: 'Vũ Điệu Hoang Dã', category: 'dang-chieu', genre: 'Hoạt hình, Gia đình', duration: 95, poster: '/movies/poster9.png', coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop', description: 'Chuyến phiêu lưu vui nhộn của các loài động vật.', releaseDate: new Date('2024-06-01') },
  { title: 'Siêu Anh Hùng: Trỗi Dậy', category: 'dang-chieu', genre: 'Hành động, Phiêu lưu', duration: 148, poster: '/movies/poster10.png', coverImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2000&auto=format&fit=crop', description: 'Đội ngũ siêu anh hùng thế hệ mới đoàn kết để chống lại mối đe dọa vũ trụ.', releaseDate: new Date('2024-05-05') },

  // --- PHIM SẮP CHIẾU ---
  { title: 'Vệ Binh Dải Ngân Hà 4', category: 'sap-chieu', genre: 'Hành động, Viễn tưởng', duration: 140, poster: '/banners/coming1.png', coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop', description: 'Đội ngũ anh hùng quen thuộc trở lại với sứ mệnh bảo vệ vũ trụ khỏi một thực thể cổ xưa...', releaseDate: new Date('2026-08-15') },
  { title: 'Trí Tuệ Nhân Tạo', category: 'sap-chieu', genre: 'Hành động, Khoa học', duration: 118, poster: '/banners/coming2.png', coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop', description: 'Khi AI vượt qua sự kiểm soát của con người, sự sống và máy móc trở nên khó phân biệt.', releaseDate: new Date('2026-09-22') },
  { title: 'Ảo Ảnh Đỏ', category: 'sap-chieu', genre: 'Tâm lý, Giật gân', duration: 106, poster: '/banners/coming3.png', coverImage: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=2000&auto=format&fit=crop', description: 'Một bộ phim tâm lý ly kỳ đưa khán giả vào những góc tối nhất của tâm trí con người.', releaseDate: new Date('2026-10-01') },
  { title: 'Ngôi Đền Cổ', category: 'sap-chieu', genre: 'Phiêu lưu, Bí ẩn', duration: 125, poster: '/banners/coming4.png', coverImage: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=2000&auto=format&fit=crop', description: 'Hành trình tìm kiếm kho báu mất tích dẫn đến những bí mật kinh hoàng của một nền văn minh đã quên.', releaseDate: new Date('2026-11-12') },
];

async function main() {
  console.log('🎬 Seeding movies...');

  // Xóa dữ liệu cũ nếu muốn (tuỳ chọn)
  // await prisma.movieTranslation.deleteMany();
  // await prisma.movieGenre.deleteMany();
  // await prisma.movie.deleteMany();
  // await prisma.genre.deleteMany();

  for (const m of moviesData) {
    // 1. Tạo hoặc lấy thể loại
    const genreNames = m.genre.split(',').map(s => s.trim());
    const genreIds: string[] = [];
    
    for (const gName of genreNames) {
      const slug = slugify(gName, { lower: true, locale: 'vi' });
      const genre = await prisma.genre.upsert({
        where: { name: gName },
        update: {},
        create: { name: gName, slug }
      });
      genreIds.push(genre.id);
    }

    // 2. Tạo phim
    await prisma.movie.create({
      data: {
        title: m.title,
        poster: m.poster,
        backdrop: m.coverImage,
        overview: m.description,
        duration: m.duration,
        releaseDate: m.releaseDate,
        status: MovieStatus.PUBLISHED,
        isActive: true,
        translations: {
          create: [
            { locale: 'vi', title: m.title, overview: m.description }
          ]
        },
        genres: {
          create: genreIds.map(id => ({ genreId: id }))
        }
      }
    });
  }

  console.log('✅ Done seeding movies!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
