import React, { useState } from 'react';
import { Button, Progress, Rate, Input, message, List, Avatar } from 'antd';
import { PlaySquareOutlined, SendOutlined, EditOutlined, MessageOutlined } from '@ant-design/icons';
import { MovieDetailData } from '../typing';

interface Props {
  movie: MovieDetailData;
}

const Sidebar: React.FC<Props> = ({ movie }) => {
  // Quản lý trạng thái Đóng/Mở của 2 khối
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviewList, setShowReviewList] = useState(false);
  const [reviewText, setReviewText] = useState('');

  const colors = { bgCard: '#1a1316', border: '#2d2025', primary: '#e42755', textDim: '#a3989c' };

  // Dữ liệu giả lập các bình luận cũ (Sau này sẽ lấy từ API)
  const mockReviews = [
    { id: 1, author: 'Nguyễn Văn A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', content: 'Phim quá xuất sắc, kỹ xảo mãn nhãn! Nên xem ở rạp IMAX.', date: '24/05/2026' },
    { id: 2, author: 'Trần Thị B', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', content: 'Kịch bản hơi khó hiểu đoạn đầu nhưng cái kết quá đỉnh cao.', date: '23/05/2026' },
    { id: 3, author: 'Lê Hoàng C', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', content: 'Diễn xuất của David Sterling cứu cả bộ phim.', date: '22/05/2026' },
    { id: 4, author: 'Phạm D', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', content: 'Âm thanh vòm nghe nổ tung tai, rất đáng tiền vé!', date: '20/05/2026' },
  ];

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      message.warning('Vui lòng nhập nội dung đánh giá của bạn!');
      return;
    }
    message.success('Đánh giá của bạn đã được gửi thành công!');
    setReviewText('');
    setShowReviewForm(false);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* KHỐI 1: ĐÁNH GIÁ CỦA KHÁN GIẢ */}
      <div style={{ backgroundColor: colors.bgCard, borderRadius: '16px', border: `1px solid ${colors.border}`, padding: '24px' }}>
        <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold', margin: '0 0 20px 0' }}>Đánh giá của khán giả</h3>
        
        {/* Điểm số tổng quan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{ color: colors.primary, fontSize: '48px', fontWeight: '900', lineHeight: 1 }}>{movie.reviews.average}</div>
          <div>
            <Rate disabled defaultValue={5} style={{ color: colors.primary, fontSize: '14px' }} />
            <div style={{ color: colors.textDim, fontSize: '12px', marginTop: '4px' }}>Dựa trên {movie.reviews.totalVotes} lượt đánh giá</div>
          </div>
        </div>

        {/* Thanh Progress Bar từng sao */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {movie.reviews.breakdown.map((item) => (
            <div key={item.star} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#ffffff', fontSize: '12px', width: '10px' }}>{item.star}</span>
              <Progress percent={item.percentage} showInfo={false} strokeColor={colors.primary} trailColor={colors.border} size="small" style={{ flex: 1, margin: 0 }} />
              <span style={{ color: colors.textDim, fontSize: '12px', width: '30px', textAlign: 'right' }}>{item.percentage}%</span>
            </div>
          ))}
        </div>

        {/* --- CỤM 2 NÚT THAO TÁC --- */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            icon={<EditOutlined />}
            onClick={() => { setShowReviewForm(!showReviewForm); setShowReviewList(false); }}
            style={{ 
              flex: 1, backgroundColor: showReviewForm ? colors.primary : 'transparent', 
              borderColor: colors.primary, color: showReviewForm ? '#fff' : colors.primary, 
              borderRadius: '20px', height: '40px', fontWeight: 'bold'
            }}
          >
            {showReviewForm ? 'Hủy' : 'Viết'}
          </Button>
          
          <Button 
            icon={<MessageOutlined />}
            onClick={() => { setShowReviewList(!showReviewList); setShowReviewForm(false); }}
            style={{ 
              flex: 1, backgroundColor: showReviewList ? '#2d2025' : 'transparent', 
              borderColor: '#2d2025', color: '#fff', 
              borderRadius: '20px', height: '40px', fontWeight: 'bold'
            }}
          >
            {showReviewList ? 'Đóng bình luận' : 'Xem đánh giá'}
          </Button>
        </div>

        {/* --- FORM NHẬP BÌNH LUẬN XỔ XUỐNG --- */}
        {showReviewForm && (
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Input.TextArea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
              style={{ backgroundColor: '#2a1e23', borderColor: colors.border, color: '#fff', borderRadius: '8px', padding: '12px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" icon={<SendOutlined />} onClick={handleSubmitReview} style={{ backgroundColor: colors.primary, border: 'none', borderRadius: '20px', fontWeight: 'bold' }}>
                Gửi đánh giá
              </Button>
            </div>
          </div>
        )}

        {/* --- DANH SÁCH BÌNH LUẬN XỔ XUỐNG CÓ SCROLL --- */}
        {showReviewList && (
          <div style={{ 
            marginTop: '20px', 
            maxHeight: '320px', // Giới hạn chiều cao
            overflowY: 'auto',  // Tạo thanh cuộn dọc khi nội dung vượt quá maxHeight
            paddingRight: '10px', // Tạo khoảng cách cho thanh cuộn không đè vào chữ
            borderTop: `1px solid ${colors.border}`, 
            paddingTop: '16px' 
          }}>
            <List
              dataSource={mockReviews}
              renderItem={item => (
                <List.Item style={{ borderBottom: `1px solid ${colors.border}`, padding: '12px 0' }}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#fff', fontWeight: 'bold' }}>{item.author}</span>
                      <span style={{ color: colors.textDim, fontSize: '11px', fontWeight: 'normal' }}>{item.date}</span>
                    </div>}
                    description={<span style={{ color: 'rgba(255, 255, 255, 0.75)' }}>{item.content}</span>}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </div>

      {/* KHỐI 2: NỘI DUNG LIÊN QUAN */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <PlaySquareOutlined style={{ color: colors.primary, fontSize: '18px' }} />
          <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Nội dung liên quan</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {movie.related.map(item => (
            <div key={item.id}>
              <div style={{ height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '8px', backgroundColor: '#333' }}>
                <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              </div>
              <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ color: colors.textDim, fontSize: '12px' }}>{item.meta}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;