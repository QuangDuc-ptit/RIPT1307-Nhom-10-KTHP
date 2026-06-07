import { useState } from 'react';
import { Space, Card, Button, DatePicker, Select, Typography, Tag, Modal, Form, TimePicker, message } from 'antd';
import { PlusOutlined, CalendarOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;

// DANH SÁCH DATABASE PHIM VÀ POSTER
const MOVIE_DATABASE: Record<string, { label: string; poster: string }> = {
  'cuc_vang_cua_ngoai': { label: 'Cục vàng của ngoại', poster: 'https://i.ibb.co/b5RgnGy7/C-C-V-NG-C-A-NGO-I.jpg' },
  'mat_biec': { label: 'Mắt biếc', poster: 'https://i.ibb.co/wFXB6ZNx/Dreamy-Eyes-Mat-Biec-2019-Vietnam.jpg' },
  'dia_dao': { label: 'Địa đạo', poster: 'https://i.ibb.co/gM1GThgM/a-o-film-Yahoo-Image-Search-Results.jpg' },
  'lat_mat_7': { label: 'Lật mặt 7', poster: 'https://i.ibb.co/CsmN1VKD/L-t-M-t-7-M-t-i-u-c.jpg' },
  'mai': { label: 'Mai', poster: 'https://i.ibb.co/bM5FXfHT/MAI.jpg' },
  'nha_ba_nu': { label: 'Nhà bà nữ', poster: 'https://i.ibb.co/tpVDdHQ5/NH-B-N-22-01-2022.jpg' },
  'em_va_trinh': { label: 'Em và Trịnh', poster: 'https://i.ibb.co/fdtm4Y4L/Poster-Em-v-Tr-nh.jpg' },
  'tiec_trang_mau': { label: 'Tiệc trăng máu', poster: 'https://i.ibb.co/8LKYTS4S/t-i-xu-ng-6.jpg' },
  'your_name': { label: 'Your Name', poster: 'https://i.ibb.co/dsb7tcJf/A-Masterpiece-and-most-Beautiful-movie.jpg' },
  'march_23': { label: 'March 23', poster: 'https://i.ibb.co/h1RjqwVT/March-23.jpg' },
  'the_space_between_us': { label: 'The Space Between Us', poster: 'https://i.ibb.co/QF2Jf5TT/t-i-xu-ng-5.jpg' },
  'the_last_of_us': { label: 'The Last of Us', poster: 'https://i.ibb.co/Jw4pBq3z/The-last-of-us-hd-poster.jpg' },
  'the_wild_robot': { label: 'The Wild Robot', poster: 'https://i.ibb.co/VpPpRzjr/The-Wild-Robot-4-6.jpg' },
  'larva': { label: 'Larva', poster: 'https://i.ibb.co/ksYpN2Mz/Larva.jpg' },
  'doraemon': { label: 'Doraemon', poster: 'https://i.ibb.co/Lz1GXcXv/t-i-xu-ng-7.jpg' },
};

const SCREENS = [
  { name: 'Screen 1', type: 'IMAX' },
  { name: 'Screen 2', type: '4DX' },
  { name: 'Screen 3', type: 'Standard' },
  { name: 'Screen 4', type: 'Standard' },
  { name: 'Screen 5', type: 'Standard' },
  { name: 'Screen 6', type: 'Standard' },
];

interface SuatChieu {
  id: string;
  movieKey: string;
  screenName: string;
  dateStr: string; 
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  format: string;
}

export default function LichChieuPage() {
  const [suatChieuList, setSuatChieuList] = useState<SuatChieu[]>(() => {
    const savedData = localStorage.getItem('global_suat_chieu_list');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return parsed.map((item: any) => ({
          ...item,
          startTime: dayjs(item.startTime),
          endTime: dayjs(item.endTime),
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  }); 

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs()); 
  const [selectedMovieFilter, setSelectedMovieFilter] = useState<string>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 🌟 STATE MỚI: Lưu trữ suất chiếu đang được bấm vào để sửa (null nghĩa là đang Thêm mới)
  const [editingShowtime, setEditingShowtime] = useState<SuatChieu | null>(null);
  
  const [form] = Form.useForm();

  const TOTAL_MINUTES = 14 * 60; 
  const timelineHours = [];
  for (let i = 8; i <= 22; i++) {
    timelineHours.push(`${i}:00 ${i < 12 ? 'AM' : 'PM'}`);
  }

  // 🌟 HÀM MỚI: Mở modal thêm mới (Reset form)
  const handleOpenAdd = () => {
    setEditingShowtime(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // 🌟 HÀM MỚI: Bấm vào 1 suất chiếu để sửa
  const handleEditClick = (show: SuatChieu) => {
    setEditingShowtime(show);
    // Đổ dữ liệu cũ của suất chiếu vào form
    form.setFieldsValue({
      movie: show.movieKey,
      screen: show.screenName,
      timeRange: [show.startTime, show.endTime],
      format: show.format,
    });
    setIsModalOpen(true);
  };

  // 🌟 CẬP NHẬT: Xử lý lưu (Phân biệt Thêm mới vs Cập nhật)
  const handleSaveShowtime = (values: any) => {
    let updatedList;

    if (editingShowtime) {
      // Chế độ CẬP NHẬT suất chiếu cũ
      updatedList = suatChieuList.map(item => 
        item.id === editingShowtime.id 
          ? {
              ...item,
              movieKey: values.movie,
              screenName: values.screen,
              startTime: values.timeRange[0],
              endTime: values.timeRange[1],
              format: values.format,
            }
          : item
      );
      message.success('Đã cập nhật suất chiếu thành công!');
    } else {
      // Chế độ THÊM MỚI
      const newShowtime: SuatChieu = {
        id: Math.random().toString(),
        movieKey: values.movie,
        screenName: values.screen,
        dateStr: selectedDate.format('YYYY-MM-DD'), 
        startTime: values.timeRange[0],
        endTime: values.timeRange[1],
        format: values.format,
      };
      updatedList = [...suatChieuList, newShowtime];
      message.success('Đã thêm suất chiếu mới thành công!');
    }

    setSuatChieuList(updatedList);
    localStorage.setItem('global_suat_chieu_list', JSON.stringify(updatedList));
    
    setIsModalOpen(false);
    setEditingShowtime(null);
    form.resetFields();
  };

  // 🌟 HÀM MỚI: Xóa suất chiếu
  const handleDeleteShowtime = () => {
    if (!editingShowtime) return;
    
    // Lọc bỏ suất chiếu có ID trùng với ID đang edit
    const updatedList = suatChieuList.filter(item => item.id !== editingShowtime.id);
    
    setSuatChieuList(updatedList);
    localStorage.setItem('global_suat_chieu_list', JSON.stringify(updatedList));
    
    message.success('Đã xóa suất chiếu!');
    setIsModalOpen(false);
    setEditingShowtime(null);
    form.resetFields();
  };

  // 🌟 HÀM MỚI: Đóng Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingShowtime(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: '16px 24px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Quản lý lịch chiếu</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleOpenAdd} // Đổi thành gọi hàm handleOpenAdd
          style={{ borderRadius: 6, fontWeight: 600 }}
        >
          Thêm suất chiếu
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <Space size="large" style={{ marginBottom: 32, display: 'flex', flexWrap: 'wrap' }}>
          <Space direction="vertical" size={4}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>NGÀY CHIẾU</span>
            <DatePicker 
              value={selectedDate} 
              onChange={(date) => {
                if (date) setSelectedDate(date);
              }} 
              format="DD/MM/YYYY" 
              allowClear={false}
              suffixIcon={<CalendarOutlined />}
              style={{ width: 200 }} 
            />
          </Space>

          <Space direction="vertical" size={4}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>LỌC THEO PHIM</span>
            <Select 
              value={selectedMovieFilter}
              onChange={(value) => setSelectedMovieFilter(value)}
              style={{ width: 260 }}
              placeholder="Chọn phim để lọc lịch"
            >
              {Object.entries(MOVIE_DATABASE).map(([key, value]) => (
                <Select.Option key={key} value={key}>{value.label}</Select.Option>
              ))}
              <Select.Option value="all" style={{ fontWeight: 700, borderTop: '1px solid #f0f0f0', marginTop: 4 }}>
                ✨ Tất cả suất chiếu
              </Select.Option>
            </Select>
          </Space>
        </Space>

        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 8 }}>
          <div style={{ minWidth: '1500px' }}>
            
            <div style={{ display: 'flex', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ width: '160px', padding: '14px 20px', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>THEATER</div>
              <div style={{ flex: 1, display: 'flex' }}>
                {timelineHours.map((hour, idx) => (
                  <div key={idx} style={{ flex: 1, padding: '14px 12px', fontSize: '11px', color: '#94a3b8', borderRight: '1px dashed #e2e8f0' }}>
                    {hour}
                  </div>
                ))}
              </div>
            </div>

            {SCREENS.map((screen) => (
              <div key={screen.name} style={{ display: 'flex', borderBottom: '1px solid #f0f4f8', minHeight: '110px' }}>
                <div style={{ width: '160px', padding: '20px', borderRight: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <div style={{ fontWeight: 700 }}>{screen.name}</div>
                  <Tag color="blue" style={{ fontSize: 10 }}>{screen.type}</Tag>
                </div>

                <div style={{ flex: 1, position: 'relative', background: '#fff' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', pointerEvents: 'none' }}>
                      {Array.from({ length: timelineHours.length }).map((_, i) => (
                        <div key={i} style={{ flex: 1, borderRight: '1px dashed #f1f5f9' }} />
                      ))}
                    </div>

                  {suatChieuList
                    .filter(item => {
                      const matchesScreen = item.screenName === screen.name;
                      const matchesDate = item.dateStr === selectedDate.format('YYYY-MM-DD');
                      const matchesMovie = selectedMovieFilter === 'all' ? true : item.movieKey === selectedMovieFilter;
                      
                      return matchesScreen && matchesDate && matchesMovie;
                    })
                    .map(show => {
                      const movieInfo = MOVIE_DATABASE[show.movieKey];
                      if (!movieInfo) return null;
                      
                      const startMinutesTotal = show.startTime.hour() * 60 + show.startTime.minute();
                      const startDiff = startMinutesTotal - (8 * 60); 
                      const duration = show.endTime.diff(show.startTime, 'minute');
                      
                      const leftPercent = (startDiff / TOTAL_MINUTES) * 100;
                      const widthPercent = (duration / TOTAL_MINUTES) * 100;

                      return (
                        <div 
                          key={show.id} 
                          onClick={() => handleEditClick(show)} // 🌟 Thêm sự kiện click để Edit
                          style={{
                            position: 'absolute',
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            top: '15px',
                            height: '80px',
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: 8,
                            padding: '6px 8px', 
                            display: 'flex',
                            gap: 10,            
                            zIndex: 10,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                            alignItems: 'center',
                            cursor: 'pointer', // 🌟 Đổi con trỏ chuột thành hình bàn tay để biết có thể click
                            transition: 'all 0.2s ease',
                          }}
                          // Thêm hiệu ứng hover nhẹ (React inline style không support :hover hoàn hảo, nhưng cursor là đủ)
                        >
                          <img 
                            src={movieInfo.poster} 
                            alt={movieInfo.label} 
                            style={{ 
                              width: 48, 
                              height: 66, 
                              objectFit: 'cover', 
                              borderRadius: 6,
                              flexShrink: 0, 
                              boxShadow: '0 2px 4px rgba(0,0,0,0.12)' 
                            }} 
                          />
                          
                          <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, height: '100%' }}>
                            <div style={{ fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', marginTop: 2 }}>
                              {movieInfo.label}
                            </div>
                            <div style={{ fontSize: 10, color: '#64748b' }}>
                              {show.startTime.format('HH:mm')} - {show.endTime.format('HH:mm')}
                            </div>
                            <Tag color="green" style={{ fontSize: 9, width: 'fit-content', margin: '0 0 2px 0', padding: '0 6px' }}>{show.format}</Tag>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 🌟 MODAL THÊM / SỬA SUẤT CHIẾU */}
      <Modal
        title={editingShowtime ? `Chỉnh sửa suất chiếu` : `Thêm suất chiếu cho ngày ${selectedDate.format('DD/MM/YYYY')}`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        width={500}
        // 🌟 Tùy chỉnh thanh Footer của Modal để chèn nút Xóa
        footer={[
          // Nút Xóa chỉ xuất hiện khi đang chỉnh sửa (nằm bên trái)
          editingShowtime && (
            <Button 
              key="delete" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={handleDeleteShowtime}
              style={{ float: 'left' }}
            >
              Xóa suất chiếu
            </Button>
          ),
          <Button key="cancel" onClick={handleCloseModal}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {editingShowtime ? 'Cập nhật' : 'Lưu suất chiếu'}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveShowtime} style={{ marginTop: 20 }}>
          <Form.Item name="movie" label="Chọn phim" rules={[{ required: true, message: 'Vui lòng chọn phim!' }]}>
            <Select placeholder="Chọn phim từ danh sách">
              {Object.entries(MOVIE_DATABASE).map(([key, value]) => (
                <Select.Option key={key} value={key}>{value.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="screen" label="Phòng chiếu" rules={[{ required: true, message: 'Vui lòng chọn phòng!' }]}>
            <Select placeholder="Chọn phòng">
              {SCREENS.map(s => <Select.Option key={s.name} value={s.name}>{s.name} ({s.type})</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="timeRange" label="Thời gian chiếu (Bắt đầu - Kết thúc)" rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}>
            <TimePicker.RangePicker format="HH:mm" minuteStep={15} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="format" label="Định dạng" initialValue="2D">
            <Select>
              <Select.Option value="2D">Standard 2D</Select.Option>
              <Select.Option value="3D">Standard 3D</Select.Option>
              <Select.Option value="IMAX">IMAX</Select.Option>
              <Select.Option value="4DX">4DX</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}