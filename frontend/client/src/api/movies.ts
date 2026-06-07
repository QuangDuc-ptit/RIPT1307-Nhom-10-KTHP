// src/api/movies.ts

export const moviesData = [
  // --- PHIM ĐANG CHIẾU ---
  {
    id: 1,
    title: 'Cục Vàng Của Ngoại',
    category: 'dang-chieu',
    genre: 'Tình cảm, Hài hước',
    duration: '115 phút',
    rating: 9.2,
    age: 'P',
    poster: '/movies/Cuc_Vang_Cua_Ngoai.jpg', // Dùng cho trang chủ
    coverImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2000&auto=format&fit=crop', // Nền ngôi nhà cổ kính ấm áp cho trang chi tiết
    tagline: 'TÌNH CẢM GIA ĐÌNH',
    description: 'Câu chuyện cảm động và hài hước về tình bà cháu. Một người bà tần tảo cả đời và đứa cháu trai lém lỉnh nhưng hiếu thảo. Hành trình của họ mang lại những tràng cười sảng khoái và những giọt nước mắt đầy ý nghĩa về giá trị gia đình.',
    cast: [
      { id: '1', name: 'NSND Ngọc Giàu', role: 'NGOẠI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ngoai' },
      { id: '2', name: 'Tuấn Trần', role: 'CHÁU TRAI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan' },
    ],
    reviews: { average: 9.2, totalVotes: '15.2k', breakdown: [ { star: 5, percentage: 85 }, { star: 4, percentage: 10 }, { star: 3, percentage: 5 } ] },
    related: []
  },
  {
    id: 2,
    title: 'Phim: Mai',
    category: 'dang-chieu',
    genre: 'Tình cảm, Tâm lý',
    duration: '131 phút',
    rating: 9.5,
    age: 'T18',
    poster: '/movies/Mai.jpg',
    // 💡 File này ta dùng ảnh ngang cho trang chi tiết
    coverImage: '/movies/Mai.jpg',
    tagline: 'TÁC PHẨM TỪ ĐẠO DIỄN TRẤN THÀNH',
    description: 'Mai là một người phụ nữ có số phận trớ trêu, luôn khao khát được yêu thương nhưng lại bị quá khứ và những định kiến xã hội vùi dập. Khi Dương - một chàng trai trẻ tuổi, nhiệt huyết xuất hiện, cuộc đời Mai bắt đầu thay đổi.',
    cast: [
      { id: '3', name: 'Phương Anh Đào', role: 'MAI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Phuong' },
      { id: '4', name: 'Tuấn Trần', role: 'SÂU (DƯƠNG)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sau' },
      { id: '5', name: 'Hồng Đào', role: 'BÀ ĐÀO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dao' },
    ],
    reviews: { average: 9.5, totalVotes: '45.1k', breakdown: [ { star: 5, percentage: 92 }, { star: 4, percentage: 5 }, { star: 3, percentage: 3 } ] },
    related: []
  },
  { id: 3, title: 'Kỹ Nguyên Robot', category: 'dang-chieu', genre: 'Hành động, Khoa học', duration: '115 phút', rating: 8.5, age: 'T16', poster: '/movies/poster3.png', coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop', tagline: 'THANH TRA ROBOT', description: 'Năm 2050, một thanh tra phải đối mặt với cuộc nổi dậy của các robot phục vụ có nhận thức.', cast: [{ id: '6', name: 'Will Smith', role: 'THANH TRA', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Will' }], reviews: { average: 8.5, totalVotes: '9.8k', breakdown: [] }, related: [] },
  { id: 4, title: 'Bản Giao Hưởng Cuối Cùng', category: 'dang-chieu', genre: 'Âm nhạc, Lãng mạn', duration: '130 phút', rating: 8.7, age: 'T16', poster: '/movies/poster4.png', coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2000&auto=format&fit=crop', tagline: 'BẢN TÌNH CA XUYÊN THỜI GIAN', description: 'Câu chuyện tình yêu tuyệt đẹp giữa một nghệ sĩ piano mù và một nữ ca sĩ vô danh.', cast: [{ id: '7', name: 'Ryan Gosling', role: 'PIANIST', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan' }], reviews: { average: 8.7, totalVotes: '18.4k', breakdown: [] }, related: [] },
  { id: 5, title: 'Tiếng Gọi Trong Đêm', category: 'dang-chieu', genre: 'Kinh dị, Giật gân', duration: '108 phút', rating: 8.2, age: 'T18', poster: '/movies/poster5.png', coverImage: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=2000&auto=format&fit=crop', tagline: 'BẠN CÓ DÁM NGHE MÁY?', description: 'Một MC Radio nhận được những cuộc gọi kỳ lạ từ một người tự xưng là đã chết.', cast: [{ id: '8', name: 'Vera Farmiga', role: 'MC RADIO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vera' }], reviews: { average: 8.2, totalVotes: '6.5k', breakdown: [] }, related: [] },
  { id: 6, title: 'Chiến Binh Ánh Sáng', category: 'dang-chieu', genre: 'Hành động, Kỳ ảo', duration: '135 phút', rating: 9.0, age: 'P', poster: '/movies/poster6.png', coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop', tagline: 'SỨ MỆNH GIẢI CỨU THẾ GIỚI', description: 'Hành trình anh hùng của chiến binh mang sức mạnh ánh sáng.', cast: [], reviews: { average: 9.0, totalVotes: '11.1k', breakdown: [] }, related: [] },
  { id: 7, title: 'Thành Phố Ngầm', category: 'dang-chieu', genre: 'Viễn tưởng, Bí ẩn', duration: '112 phút', rating: 8.4, age: 'T16', poster: '/movies/poster7.png', coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop', tagline: 'BÍ MẬT DƯỚI LÒNG ĐẤT', description: 'Thám hiểm thành phố công nghệ cao nằm sâu dưới lòng đất.', cast: [], reviews: { average: 8.4, totalVotes: '7.8k', breakdown: [] }, related: [] },
  { id: 8, title: 'Mật Mã Cuối Cùng', category: 'dang-chieu', genre: 'Giật gân, Tội phạm', duration: '128 phút', rating: 8.8, age: 'T18', poster: '/movies/poster8.png', coverImage: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2000&auto=format&fit=crop', tagline: 'CHẠY ĐUA VỚI THỜI GIAN', description: 'Một thám tử phải giải mã các ẩn số của tên tội phạm thiên tài.', cast: [], reviews: { average: 8.8, totalVotes: '10.5k', breakdown: [] }, related: [] },
  { id: 9, title: 'Vũ Điệu Hoang Dã', category: 'dang-chieu', genre: 'Hoạt hình, Gia đình', duration: '95 phút', rating: 8.1, age: 'P', poster: '/movies/poster9.png', coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop', tagline: 'BÀI CA THIÊN NHIÊN', description: 'Chuyến phiêu lưu vui nhộn của các loài động vật.', cast: [], reviews: { average: 8.1, totalVotes: '4.2k', breakdown: [] }, related: [] },
  { id: 10, title: 'Siêu Anh Hùng: Trỗi Dậy', category: 'dang-chieu', genre: 'Hành động, Phiêu lưu', duration: '148 phút', rating: 9.5, age: 'T16', poster: '/movies/poster10.png', coverImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2000&auto=format&fit=crop', tagline: 'KỶ NGUYÊN MỚI CỦA SIÊU ANH HÙNG', description: 'Đội ngũ siêu anh hùng thế hệ mới đoàn kết để chống lại mối đe dọa vũ trụ.', cast: [], reviews: { average: 9.5, totalVotes: '32.1k', breakdown: [] }, related: [] },

  // --- PHIM SẮP CHIẾU ---
  { id: 11, title: 'Vệ Binh Dải Ngân Hà 4', category: 'sap-chieu', genre: 'Hành động, Viễn tưởng', duration: '140 phút', rating: 0, age: 'T16', poster: 'coming1.png', coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop', tagline: 'SỰ TRỞ LẠI CỦA CÁC ANH HÙNG', description: 'Đội ngũ anh hùng quen thuộc trở lại với sứ mệnh bảo vệ vũ trụ khỏi một thực thể cổ xưa...', cast: [], reviews: { average: 0, totalVotes: '0', breakdown: [] }, related: [], date: '15 / 04' },
  { id: 12, title: 'Trí Tuệ Nhân Tạo', category: 'sap-chieu', genre: 'Hành động, Khoa học', duration: '118 phút', rating: 0, age: 'T16', poster: 'coming2.png', coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop', tagline: 'RANH GIỚI MỜ NHẠT', description: 'Khi AI vượt qua sự kiểm soát của con người, sự sống và máy móc trở nên khó phân biệt.', cast: [], reviews: { average: 0, totalVotes: '0', breakdown: [] }, related: [], date: '22 / 04' },
  { id: 13, title: 'Ảo Ảnh Đỏ', category: 'sap-chieu', genre: 'Tâm lý, Giật gân', duration: '106 phút', rating: 0, age: 'T18', poster: 'coming3.png', coverImage: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=2000&auto=format&fit=crop', tagline: 'BÍ ẨN TRONG TÂM TRÍ', description: 'Một bộ phim tâm lý ly kỳ đưa khán giả vào những góc tối nhất của tâm trí con người.', cast: [], reviews: { average: 0, totalVotes: '0', breakdown: [] }, related: [], date: '01 / 05' },
  { id: 14, title: 'Ngôi Đền Cổ', category: 'sap-chieu', genre: 'Phiêu lưu, Bí ẩn', duration: '125 phút', rating: 0, age: 'T16', poster: 'coming4.png', coverImage: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=2000&auto=format&fit=crop', tagline: 'KHO BÁU BỊ THẤT LẠC', description: 'Hành trình tìm kiếm kho báu mất tích dẫn đến những bí mật kinh hoàng của một nền văn minh đã quên.', cast: [], reviews: { average: 0, totalVotes: '0', breakdown: [] }, related: [], date: '12 / 05' },
];

// --- CÁC HÀM XUẤT DỮ LIỆU ĐỂ CÁC TRANG KHÁC GỌI VÀO ---
export const getNowShowingMovies = () => moviesData.filter(movie => movie.category === 'dang-chieu');
export const getComingSoonMovies = () => moviesData.filter(movie => movie.category === 'sap-chieu');
export const getMovieById = (id: string | number) => moviesData.find(movie => movie.id.toString() === id.toString());