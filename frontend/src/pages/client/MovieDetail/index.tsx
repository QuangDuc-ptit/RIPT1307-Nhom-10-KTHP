import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeroBanner from './HeroBanner';
import MainContent from './MainContent';
import Sidebar from './Sidebar';
import Footer from '@/components/layout/Footer';

const MovieDetailPage: React.FC = () => {
  // Bắt ID phim từ thanh URL (Ví dụ bạn ấn phim Mai có ID là '2' ở trang chủ, thì id ở đây sẽ là '2')
  const { id } = useParams<{ id: string }>();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [id]);

  // 🚀 KHO DỮ LIỆU ĐÃ ĐƯỢC CẬP NHẬT ĐẦY ĐỦ 10 PHIM KHỚP VỚI LANDINGPAGE
  const mockDatabase: any[] = [
    {
      id: '1',
      title: 'CỤC VÀNG CỦA NGOẠI',
      tagline: 'TÌNH CẢM GIA ĐÌNH',
      metaInfo: 'Tình cảm, Gia đình • 126 phút • 2024',
      rating: 9.2,
      description: 'Câu chuyện cảm động về một chàng trai trẻ quyết định nghỉ việc để chăm sóc người bà bị ung thư giai đoạn cuối, nhằm mong muốn thừa kế khối tài sản khổng lồ. Tuy nhiên, hành trình này đã thay đổi hoàn toàn cách nhìn của anh về tình mẫu tử và giá trị gia đình.',
      coverImage: '/movies/Cuc_Vang_Cua_Ngoai.jpg',
      cast: [
        { id: '1', name: 'Putthipong Assaratanakul', role: 'CHÁU TRAI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Billkin' },
        { id: '2', name: 'Tontawan Tantivejakul', role: 'CHÁU GÁI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tu' },
      ],
      cinemas: [], reviews: { average: 9.2, totalVotes: '15.2k', breakdown: [ { star: 5, percentage: 85 }, { star: 4, percentage: 10 }, { star: 3, percentage: 5 } ] },
      related: []
    },
    {
      id: '2',
      title: 'PHIM: MAI',
      tagline: 'TÁC PHẨM TỪ ĐẠO DIỄN TRẤN THÀNH',
      metaInfo: 'Tình cảm, Tâm lý • 131 phút • 2024',
      rating: 9.5,
      description: 'Mai là một người phụ nữ gần 30 tuổi với quá khứ nhiều tổn thương, đang chật vật mưu sinh. Định mệnh đưa cô gặp Dương, một chàng trai đào hoa, kém tuổi. Liệu tình yêu chân thành có giúp cả hai vượt qua những định kiến?',
      coverImage: '/movies/Mai.jpg',
      cast: [
        { id: '3', name: 'Phương Anh Đào', role: 'MAI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Phuong' },
        { id: '4', name: 'Tuấn Trần', role: 'SÂU (DƯƠNG)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sau' },
        { id: '5', name: 'Hồng Đào', role: 'BÀ ĐÀO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dao' },
      ],
      cinemas: [], reviews: { average: 9.5, totalVotes: '45.1k', breakdown: [ { star: 5, percentage: 92 }, { star: 4, percentage: 5 }, { star: 3, percentage: 3 } ] },
      related: [
        { id: 'r1', title: 'Hậu trường phim Mai', meta: '15:20 • BEHIND THE SCENES', thumbnail: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=500&auto=format&fit=crop' }
      ]
    },
    {
      id: '3', 
      title: 'MẮT BIẾC',
      tagline: 'TÌNH YÊU TRONG TRẺO NHƯNG ĐẦY TIẾC NUỐI',
      metaInfo: 'Tình cảm, Lãng mạn • 117 phút • 2019',
      rating: 9.0,
      description: 'Chuyển thể từ truyện dài cùng tên của nhà văn Nguyễn Nhật Ánh, bộ phim xoay quanh tình yêu đơn phương đầy day dứt của Ngạn dành cho Hà Lan - cô bạn thanh mai trúc mã có đôi mắt biếc hút hồn.',
      coverImage: '/movies/Mat_Biec.jpg',
      cast: [
        { id: '6', name: 'Trần Nghĩa', role: 'NGẠN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ngan' },
        { id: '7', name: 'Trúc Anh', role: 'HÀ LAN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HaLan' },
      ],
      cinemas: [], reviews: { average: 9.0, totalVotes: '30.8k', breakdown: [ { star: 5, percentage: 75 }, { star: 4, percentage: 15 }, { star: 3, percentage: 10 } ] },
      related: []
    },
    {
      id: '4',
      title: 'NHÀ BÀ NỮ',
      tagline: 'MỖI GIA ĐÌNH ĐỀU CÓ NHỮNG BÍ MẬT',
      metaInfo: 'Tình cảm, Gia đình, Hài hước • 102 phút • 2023',
      rating: 8.5,
      description: 'Bộ phim đi sâu vào những mâu thuẫn thế hệ, áp đặt tư tưởng trong một gia đình làm nghề bán bánh canh cua do bà Nữ làm chủ. Bức tranh thực tế về tình yêu, hoài bão và những rạn nứt gia đình ẩn sau vỏ bọc yêu thương.',
      coverImage: '/movies/Nha_Ba_Nu.jpg',
      cast: [
        { id: '8', name: 'Uyển Ân', role: 'NGỌC NHI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UyenAn' },
        { id: '9', name: 'Lê Giang', role: 'BÀ NỮ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LeGiang' },
      ],
      cinemas: [], reviews: { average: 8.5, totalVotes: '32.1k', breakdown: [ { star: 5, percentage: 70 }, { star: 4, percentage: 20 }, { star: 3, percentage: 10 } ] },
      related: []
    },
    {
      id: '5',
      title: 'US',
      tagline: 'SỰ THẬT KINH HOÀNG DƯỚI LÒNG ĐẤT',
      metaInfo: 'Kinh dị, Giật gân • 116 phút • 2019',
      rating: 8.8,
      description: 'Một gia đình bốn người đến kỳ nghỉ mát. Cơn ác mộng ập đến khi họ đối mặt với một nhóm người kỳ lạ đứng trước cửa nhà - những bản sao độc ác và khát máu của chính họ.',
      coverImage: '/movies/Us.jpg',
      cast: [
        { id: '10', name: 'Lupita Nyong\'o', role: 'ADELAIDE / RED', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lupita' },
        { id: '11', name: 'Winston Duke', role: 'GABE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Winston' },
      ],
      cinemas: [], reviews: { average: 8.8, totalVotes: '28.5k', breakdown: [ { star: 5, percentage: 78 }, { star: 4, percentage: 12 }, { star: 3, percentage: 10 } ] },
      related: []
    },
    {
      id: '6',
      title: 'YOUR NAME',
      tagline: 'KHOẢNG CÁCH KHÔNG GIAN KHÔNG THỂ NGĂN CÁCH TÌNH YÊU',
      metaInfo: 'Hoạt hình, Anime, Lãng mạn • 106 phút • 2016',
      rating: 9.6,
      description: 'Mitsuha và Taki phát hiện ra mình bị hoán đổi cơ thể cho nhau sau những giấc mơ. Một sợi dây liên kết vô hình và cuộc hành trình vượt qua không gian, thời gian bắt đầu.',
      coverImage: '/movies/Your_Name.jpg',
      cast: [
        { id: '12', name: 'Ryunosuke Kamiki', role: 'TAKI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taki' },
        { id: '13', name: 'Mone Kamishiraishi', role: 'MITSUHA', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mitsuha' },
      ],
      cinemas: [], reviews: { average: 9.6, totalVotes: '80.2k', breakdown: [ { star: 5, percentage: 95 }, { star: 4, percentage: 3 }, { star: 3, percentage: 2 } ] },
      related: []
    },
    {
      id: '7',
      title: 'THE WILD ROBOT',
      tagline: 'HÀNH TRÌNH TÌM KIẾM TRÁI TIM',
      metaInfo: 'Hoạt hình, Phiêu lưu • 102 phút • 2024',
      rating: 8.8,
      description: 'ROZZUM unit 7134, gọi tắt là Roz, bị đắm tàu và dạt vào một hòn đảo hoang dã. Để sống sót, cô robot phải học cách thích nghi với môi trường khắc nghiệt, kết bạn với các loài động vật và trở thành mẹ nuôi của một chú ngỗng.',
      coverImage: '/movies/The_Wild_Robot.jpg',
      cast: [
        { id: '14', name: 'Lupita Nyong\'o', role: 'ROZ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roz' },
        { id: '15', name: 'Pedro Pascal', role: 'FINK', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro' },
      ],
      cinemas: [], reviews: { average: 8.8, totalVotes: '12.4k', breakdown: [ { star: 5, percentage: 80 }, { star: 4, percentage: 15 }, { star: 3, percentage: 5 } ] },
      related: []
    },
    {
      id: '8',
      title: 'TIỆC TRĂNG MÁU',
      tagline: 'BẢN CHẤT CON NGƯỜI QUA CHIẾC ĐIỆN THOẠI',
      metaInfo: 'Hành động, Tâm lý, Hài đen • 118 phút • 2020',
      rating: 8.9,
      description: 'Trong một buổi tiệc tân gia, nhóm bạn thân lâu năm chơi một trò chơi: công khai toàn bộ tin nhắn, cuộc gọi đến trong tối hôm đó. Từ đây, những bí mật đen tối dần bị vạch trần.',
      coverImage: '/movies/Tiec_Trang_Mau.jpg',
      cast: [
        { id: '16', name: 'Thái Hòa', role: 'BÌNH', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThaiHoa' },
        { id: '17', name: 'Đức Thịnh', role: 'MẠNH', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DucThinh' },
      ],
      cinemas: [], reviews: { average: 8.9, totalVotes: '25.0k', breakdown: [ { star: 5, percentage: 82 }, { star: 4, percentage: 10 }, { star: 3, percentage: 8 } ] },
      related: []
    },
    {
      id: '9',
      title: 'LARVA',
      tagline: 'HÀI HƯỚC VÔ TRI',
      metaInfo: 'Hoạt hình, Hài hước • 90 phút • 2024',
      rating: 8.8,
      description: 'Phiên bản điện ảnh đặc biệt của hai chú ấu trùng tinh nghịch Red và Yellow dưới cống ngầm. Những tình huống dở khóc dở cười vô cùng giải trí.',
      coverImage: '/movies/Larva.jpg',
      cast: [
        { id: '18', name: 'Red', role: 'ẤU TRÙNG ĐỎ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Red' },
        { id: '19', name: 'Yellow', role: 'ẤU TRÙNG VÀNG', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yellow' },
      ],
      cinemas: [], reviews: { average: 8.8, totalVotes: '10.5k', breakdown: [ { star: 5, percentage: 75 }, { star: 4, percentage: 15 }, { star: 3, percentage: 10 } ] },
      related: []
    },
    {
      id: '10',
      title: 'DOREMON BẢN GIAO HƯỞNG ĐỊA CẦU',
      tagline: 'HÀNH TRÌNH ÂM NHẠC KỲ DIỆU',
      metaInfo: 'Hoạt hình, Phiêu lưu • 115 phút • 2024',
      rating: 9.1,
      description: 'Doraemon và nhóm bạn Nobita tham gia vào cuộc phiêu lưu âm nhạc vĩ đại nhằm giải cứu Trái Đất khỏi một thực thể bí ẩn muốn xóa sổ âm nhạc khỏi vũ trụ.',
      coverImage: '/movies/Ban_Giao_Huong.jpg',
      cast: [
        { id: '20', name: 'Wasabi Mizuta', role: 'DORAEMON', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Doraemon' },
        { id: '21', name: 'Megumi Ohara', role: 'NOBITA', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nobita' },
      ],
      cinemas: [], reviews: { average: 9.1, totalVotes: '40.2k', breakdown: [ { star: 5, percentage: 85 }, { star: 4, percentage: 10 }, { star: 3, percentage: 5 } ] },
      related: []
    }
  ];

  // Logic tìm phim: Nếu click vào phim chưa có data, lấy giao diện mặc định
  const currentMovie = mockDatabase.find(m => m.id === id) || {
    ...mockDatabase[0],
    id: id,
    title: `PHIM ĐANG CẬP NHẬT (ID: ${id})`, 
    description: 'Nội dung chi tiết của bộ phim này đang được hệ thống KSTAR cập nhật. Quý khách vui lòng quay lại sau!',
    coverImage: `https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2000&auto=format&fit=crop`,
    cast: [
      { id: '99', name: 'Đang cập nhật', role: 'DIỄN VIÊN', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Actor${id}` }
    ]
  };

  return (
    <div 
      style={{ 
        backgroundColor: '#151113', 
        minHeight: '100vh', 
        paddingBottom: '60px', 
        fontFamily: 'sans-serif',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
      }}
    >
      <HeroBanner movie={currentMovie} />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 5%', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        <MainContent movie={currentMovie} />
        <Sidebar movie={currentMovie} />
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetailPage;