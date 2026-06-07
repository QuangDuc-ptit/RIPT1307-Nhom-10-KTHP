import { useState, useMemo, useEffect } from 'react';
import { Space, Button, InputNumber, Dropdown, MenuProps, message, Modal, Input, Select, Spin } from 'antd';
import { 
  DownOutlined, 
  UndoOutlined, 
  RedoOutlined, 
  AppstoreOutlined, 
  SaveOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { theatersApi, Cinema, Room } from '../../api/theaters';

interface ScreenConfig {
  rows: number;
  cols: number;
  priceStandard: number;
  priceVip: number;
  priceCouple: number;
}

interface GridState {
  rows: number;
  cols: number;
}

export default function TheatersPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const [loadingCinemas, setLoadingCinemas] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal states
  const [isCinemaModalOpen, setIsCinemaModalOpen] = useState(false);
  const [newCinemaName, setNewCinemaName] = useState('');
  const [newCinemaAddress, setNewCinemaAddress] = useState('');
  
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const [currentConfig, setCurrentConfig] = useState<ScreenConfig>({ rows: 10, cols: 10, priceStandard: 80000, priceVip: 120000, priceCouple: 160000 });
  const [history, setHistory] = useState<GridState[]>([{ rows: 10, cols: 10 }]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      const res = await theatersApi.getCinemas();
      setCinemas(res);
    } catch (err) {
      message.error('Không thể tải danh sách rạp chiếu');
    } finally {
      setLoadingCinemas(false);
    }
  };

  const handleCinemaChange = async (cinemaId: string) => {
    setSelectedCinemaId(cinemaId);
    setSelectedRoomId(null);
    setRooms([]);
    setLoadingRooms(true);
    try {
      const res = await theatersApi.getRooms(cinemaId);
      setRooms(res);
    } catch (err) {
      message.error('Không thể tải danh sách phòng chiếu');
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleRoomChange = async (roomId: string) => {
    setSelectedRoomId(roomId);
    setLoadingDetail(true);
    try {
      const room = await theatersApi.getRoomDetail(roomId);
      if (room.seats && room.seats.length > 0) {
        let maxRowCode = 65;
        let maxCol = 10;
        room.seats.forEach(s => {
          const code = s.row.charCodeAt(0);
          if (code > maxRowCode) maxRowCode = code;
          if (s.number > maxCol) maxCol = s.number;
        });
        const rowsCount = maxRowCode - 65 + 1;
        const newRows = Math.max(10, rowsCount);
        const newCols = Math.max(10, maxCol);
        
        setCurrentConfig(prev => ({ ...prev, rows: newRows, cols: newCols }));
        setHistory([{ rows: newRows, cols: newCols }]);
        setHistoryIndex(0);
      } else {
        setCurrentConfig(prev => ({ ...prev, rows: 10, cols: 10 }));
        setHistory([{ rows: 10, cols: 10 }]);
        setHistoryIndex(0);
      }
    } catch (error) {
      message.error('Không thể tải chi tiết phòng chiếu');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCreateCinema = async () => {
    if (!newCinemaName || !newCinemaAddress) {
      message.warning('Vui lòng nhập đầy đủ tên rạp và địa chỉ');
      return;
    }
    try {
      const cinema = await theatersApi.createCinema({ name: newCinemaName, address: newCinemaAddress });
      message.success('Tạo rạp chiếu thành công');
      setCinemas([...cinemas, cinema]);
      setIsCinemaModalOpen(false);
      setNewCinemaName('');
      setNewCinemaAddress('');
      handleCinemaChange(cinema.id);
    } catch (err) {
      message.error('Có lỗi xảy ra khi tạo rạp chiếu');
    }
  };

  const handleCreateRoom = async () => {
    if (!selectedCinemaId) return;
    if (!newRoomName) {
      message.warning('Vui lòng nhập tên phòng chiếu');
      return;
    }
    try {
      const room = await theatersApi.createRoom({ name: newRoomName, cinemaId: selectedCinemaId });
      message.success('Tạo phòng chiếu thành công');
      setRooms([...rooms, room]);
      setIsRoomModalOpen(false);
      setNewRoomName('');
      handleRoomChange(room.id);
    } catch (err) {
      message.error('Có lỗi xảy ra khi tạo phòng chiếu');
    }
  };

  const handleSave = async () => {
    if (!selectedRoomId) return;
    setSaving(true);
    try {
      // Logic xác định dòng VIP (cố định D, E, F, G như giao diện)
      const vipRows = ['D', 'E', 'F', 'G'].filter(char => char.charCodeAt(0) - 65 < currentConfig.rows);
      
      // Logic xác định Sweetbox (Couple): 2 hàng cuối
      const sweetboxRows = [];
      const coupleStartIdx = Math.max(0, currentConfig.rows - 2);
      for (let i = coupleStartIdx; i < currentConfig.rows; i++) {
        sweetboxRows.push(String.fromCharCode(65 + i));
      }

      await theatersApi.generateSeats(selectedRoomId, {
        rowCount: currentConfig.rows,
        seatsPerRow: currentConfig.cols,
        vipRows,
        sweetboxRows
      });
      message.success('Đã lưu cấu hình ghế vào cơ sở dữ liệu thành công!');
    } catch (err) {
      message.error('Có lỗi xảy ra khi lưu cấu hình ghế.');
    } finally {
      setSaving(false);
    }
  };

  const updateCurrentConfig = (fields: Partial<ScreenConfig>) => {
    setCurrentConfig(prev => ({ ...prev, ...fields }));
  };

  const updateGridSize = (newRows: number, newCols: number) => {
    const validRows = Math.max(10, Math.min(20, newRows));
    const validCols = Math.max(10, Math.min(20, newCols));

    updateCurrentConfig({ rows: validRows, cols: validCols });

    const cleanHistory = history.slice(0, historyIndex + 1);
    setHistory([...cleanHistory, { rows: validRows, cols: validCols }]);
    setHistoryIndex(cleanHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      updateCurrentConfig({ rows: history[prevIndex].rows, cols: history[prevIndex].cols });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      updateCurrentConfig({ rows: history[nextIndex].rows, cols: history[nextIndex].cols });
    }
  };

  const [hoveredRow, setHoveredRow] = useState<number>(0);
  const [hoveredCol, setHoveredCol] = useState<number>(0);

  const wordTableMenu = (
    <div style={{ background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }}>
      <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 8, color: '#475569', textAlign: 'center' }}>
        Kích thước rạp: {hoveredRow > 0 ? hoveredRow + 9 : currentConfig.rows} Hàng x {hoveredCol > 0 ? hoveredCol + 9 : currentConfig.cols} Cột
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {Array.from({ length: 11 }).map((_, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 11 }).map((_, cIdx) => {
              const isSelected = rIdx < hoveredRow && cIdx < hoveredCol;
              return (
                <div
                  key={cIdx}
                  onMouseEnter={() => { setHoveredRow(rIdx + 1); setHoveredCol(cIdx + 1); }}
                  onMouseLeave={() => { setHoveredRow(0); setHoveredCol(0); }}
                  onClick={() => updateGridSize(rIdx + 10, cIdx + 10)}
                  style={{
                    width: 18, height: 18, borderRadius: 2, border: '1px solid #cbd5e1',
                    background: isSelected ? '#c7d2fe' : '#f8fafc', cursor: 'pointer', transition: 'all 0.1s ease'
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>
        Di chuột chọn kích thước (10x10 - 20x20)
      </div>
    </div>
  );

  const rowLabels = useMemo(() => {
    const labels = [];
    for (let i = 0; i < currentConfig.rows; i++) {
      labels.push(String.fromCharCode(65 + (i >= 8 ? i + 1 : i)));
    }
    return labels;
  }, [currentConfig.rows]);

  const selectedCinema = cinemas.find(c => c.id === selectedCinemaId);
  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  return (
    <div style={{ background: '#fff', minHeight: '75vh', padding: '12px 0' }}>
      
      {/* HÀNG 1: CHỌN RẠP, CHỌN PHÒNG & NÚT LƯU */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space size={16} style={{ fontSize: '14px', color: '#64748b' }}>
          {/* Dropdown Rạp */}
          <Space>
            <span style={{ fontWeight: 600 }}>Rạp chiếu:</span>
            <Select
              style={{ width: 220 }}
              placeholder="Chọn rạp chiếu"
              loading={loadingCinemas}
              value={selectedCinemaId}
              onChange={handleCinemaChange}
              options={cinemas.map(c => ({ label: c.name, value: c.id }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: '8px', borderTop: '1px solid #e8e8e8' }}>
                    <Button type="dashed" block icon={<PlusOutlined />} onClick={() => setIsCinemaModalOpen(true)}>
                      Thêm rạp mới
                    </Button>
                  </div>
                </>
              )}
            />
          </Space>

          {selectedCinemaId && <span>&gt;</span>}

          {/* Dropdown Phòng chiếu */}
          {selectedCinemaId && (
            <Space>
              <span style={{ fontWeight: 600 }}>Phòng chiếu:</span>
              <Select
                style={{ width: 180 }}
                placeholder="Chọn phòng"
                loading={loadingRooms}
                value={selectedRoomId}
                onChange={handleRoomChange}
                options={rooms.map(r => ({ label: r.name, value: r.id }))}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <div style={{ padding: '8px', borderTop: '1px solid #e8e8e8' }}>
                      <Button type="dashed" block icon={<PlusOutlined />} onClick={() => setIsRoomModalOpen(true)}>
                        Thêm phòng mới
                      </Button>
                    </div>
                  </>
                )}
              />
            </Space>
          )}
        </Space>

        {selectedRoomId && (
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={saving}
            style={{ borderRadius: 6, background: '#1677ff', fontWeight: 600 }}
          >
            Lưu
          </Button>
        )}
      </div>

      {!selectedRoomId ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#94a3b8' }}>
          <AppstoreOutlined style={{ fontSize: 40, marginBottom: 12, color: '#cbd5e1' }} />
          <p style={{ fontSize: '14px' }}>Vui lòng chọn hoặc tạo mới Rạp và Phòng chiếu để hiển thị ma trận ghế.</p>
        </div>
      ) : loadingDetail ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* HÀNG 2: THANH CẤU HÌNH THEO TỪNG PHÒNG CHIẾU */}
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            background: '#f8fafc', padding: '16px', borderRadius: 8, marginBottom: 32, border: '1px dashed #cbd5e1'
          }}>
            <Space size={32}>
              {/* Kích thước */}
              <Space direction="vertical" size={4}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>KÍCH THƯỚC</span>
                <Space>
                  <span style={{ fontSize: '13px' }}>Hàng:</span>
                  <InputNumber min={10} max={20} value={currentConfig.rows} onChange={(val) => updateGridSize(val || 10, currentConfig.cols)} size="small" style={{ width: 55 }} />
                  <span style={{ fontSize: '13px' }}>Cột:</span>
                  <InputNumber min={10} max={20} value={currentConfig.cols} onChange={(val) => updateGridSize(currentConfig.rows, val || 10)} size="small" style={{ width: 55 }} />
                </Space>
              </Space>

              {/* GIÁ VÉ SỐ TIỀN CỦA TỪNG PHÒNG */}
              <Space direction="vertical" size={4}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>GIÁ VÉ (Chỉ hiển thị)</span>
                <Space size={16}>
                  <Space size={4}>
                    <span style={{ background: '#93c5fd', color: '#1d4ed8', width: 12, height: 12, borderRadius: 2, display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: 600 }}>Standard:</span>
                    <InputNumber min={0} step={5000} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value ? Number(value.replace(/[^\d]/g, '')) : 0} value={currentConfig.priceStandard} onChange={(val) => updateCurrentConfig({ priceStandard: val || 0 })} size="small" style={{ width: 110 }} addonAfter="đ" />
                  </Space>
                  <Space size={4}>
                    <span style={{ background: '#fef08a', color: '#a16207', width: 12, height: 12, borderRadius: 2, display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: '#a16207', fontWeight: 600 }}>VIP:</span>
                    <InputNumber min={0} step={5000} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value ? Number(value.replace(/[^\d]/g, '')) : 0} value={currentConfig.priceVip} onChange={(val) => updateCurrentConfig({ priceVip: val || 0 })} size="small" style={{ width: 110 }} addonAfter="đ" />
                  </Space>
                  <Space size={4}>
                    <span style={{ background: '#fbcfe8', color: '#db2777', width: 12, height: 12, borderRadius: 2, display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: '#db2777', fontWeight: 600 }}>Couple:</span>
                    <InputNumber min={0} step={5000} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value ? Number(value.replace(/[^\d]/g, '')) : 0} value={currentConfig.priceCouple} onChange={(val) => updateCurrentConfig({ priceCouple: val || 0 })} size="small" style={{ width: 110 }} addonAfter="đ" />
                  </Space>
                </Space>
              </Space>
            </Space>

            {/* Điều hướng lịch sử & Tự động căn chỉnh */}
            <Space size={12}>
              <Button type="text" icon={<UndoOutlined />} disabled={historyIndex === 0} onClick={handleUndo} style={{ color: historyIndex === 0 ? '#cbd5e1' : '#64748b' }} />
              <Button type="text" icon={<RedoOutlined />} disabled={historyIndex === history.length - 1} onClick={handleRedo} style={{ color: historyIndex === history.length - 1 ? '#cbd5e1' : '#64748b' }} />
              
              <Dropdown dropdownRender={() => wordTableMenu} trigger={['click']} placement="bottomRight">
                <Button icon={<AppstoreOutlined />} style={{ borderRadius: 6, color: '#4f46e5', borderColor: '#cbd5e1', fontWeight: 500, fontSize: '13px' }}>
                  Tự động căn chỉnh <DownOutlined style={{ fontSize: 10 }} />
                </Button>
              </Dropdown>
            </Space>
          </div>

          {/* SƠ ĐỒ PHÒNG CHIẾU CHÍNH */}
          <div style={{ maxWidth: '850px', margin: '0 auto', paddingTop: 16 }}>
            {/* Vòng cung Màn hình */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: '65%', height: '18px', margin: '0 auto', borderTop: '3px solid #a5b4fc', borderRadius: '50% / 10px 10px 0 0' }} />
              <div style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '4px', fontWeight: 600, marginTop: 4 }}>IMAX SCREEN</div>
            </div>

            {/* CHÚ THÍCH CÁC DÒNG CHỮ ĐỒNG BỘ MÀU GHẾ */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', marginBottom: 32, fontSize: '13px', fontWeight: 600 }}>
              <Space><span style={{ width: 14, height: 14, background: '#93c5fd', border: '1px solid #60a5fa', borderRadius: 3 }} /><span style={{ color: '#1d4ed8' }}>Standard</span></Space>
              <Space><span style={{ width: 14, height: 14, background: '#fef08a', border: '1px solid #facc15', borderRadius: 3 }} /><span style={{ color: '#a16207' }}>VIP</span></Space>
              <Space><span style={{ width: 36, height: 14, background: '#fbcfe8', border: '1px solid #f472b6', borderRadius: 3 }} /><span style={{ color: '#db2777' }}>Couple</span></Space>
              <Space><span style={{ width: 14, height: 14, background: '#e2e8f0', borderRadius: 3 }} /><span style={{ color: '#64748b' }}>Lối đi</span></Space>
            </div>

            {/* KHU VỰC VẼ LƯỚI MA TRẬN GHẾ CHÍNH XÁC */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rowLabels.map((rowLabel, rowIndex) => {
                const isCoupleRow = rowIndex >= currentConfig.rows - 2; // 2 hàng cuối cùng là ghế đôi
                let currentSeatNumber = 0;

                const displayColsArray = Array.from({ length: currentConfig.cols + 2 });

                return (
                  <div key={rowLabel} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {/* Tên hàng ghế */}
                    <span style={{ width: 20, fontWeight: 700, color: '#475569', fontSize: '13px' }}>{rowLabel}</span>
                    
                    {(() => {
                      if (isCoupleRow) {
                        let coupleCount = 0;
                        return displayColsArray.map((_, colDisplayIndex) => {
                          const displayColNum = colDisplayIndex + 1;
                          if (displayColNum === 4 || displayColNum === 9) {
                            return <div key={`walkway-couple-${displayColNum}`} style={{ width: 24, height: 24, background: '#e2e8f0', borderRadius: 4 }} />;
                          }
                          coupleCount++;
                          if (coupleCount <= Math.floor(currentConfig.cols / 2)) {
                            return (
                              <div 
                                key={`couple-${rowLabel}-${coupleCount}`}
                                style={{ 
                                  width: 54, height: 24, background: '#fbcfe8', borderRadius: 6, border: '1px solid #f472b6',
                                  fontSize: '10px', fontWeight: 600, color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                              >
                                C{coupleCount}
                              </div>
                            );
                          }
                          return null;
                        });
                      }

                      return displayColsArray.map((_, colDisplayIndex) => {
                        const displayColNum = colDisplayIndex + 1;
                        if (displayColNum === 4 || displayColNum === 9) {
                          return <div key={`walkway-${displayColNum}`} style={{ width: 24, height: 24, background: '#e2e8f0', borderRadius: 4 }} />;
                        }

                        currentSeatNumber++;
                        const charCode = rowLabel.charCodeAt(0);
                        const isVipRow = charCode >= 68 && charCode <= 71; 
                        const isVipCol = currentSeatNumber >= 4 && currentSeatNumber <= 7;

                        if (isVipRow && isVipCol) {
                          return (
                            <div 
                              key={`${rowLabel}-${currentSeatNumber}`}
                              style={{ 
                                width: 24, height: 24, background: '#fef08a', borderRadius: 4,
                                fontSize: '10px', fontWeight: 600, color: '#a16207', border: '1px solid #facc15',
                                display: 'flex', alignItems: 'center', justifyContent: 'center' 
                              }}
                            >
                              {currentSeatNumber}
                            </div>
                          );
                        }

                        return (
                          <div 
                            key={`${rowLabel}-${currentSeatNumber}`}
                            style={{ 
                              width: 24, height: 24, background: '#93c5fd', borderRadius: 4,
                              fontSize: '10px', fontWeight: 600, color: '#1d4ed8', border: '1px solid #60a5fa',
                              display: 'flex', alignItems: 'center', justifyContent: 'center' 
                            }}
                          >
                            {currentSeatNumber}
                          </div>
                        );
                      });
                    })()}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* MODAL THÊM RẠP MỚI */}
      <Modal
        title="Thêm Rạp Chiếu Mới"
        open={isCinemaModalOpen}
        onOk={handleCreateCinema}
        onCancel={() => setIsCinemaModalOpen(false)}
        okText="Lưu rạp"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Tên rạp</label>
          <Input placeholder="Nhập tên rạp..." value={newCinemaName} onChange={e => setNewCinemaName(e.target.value)} />
        </div>
        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Địa chỉ</label>
          <Input placeholder="Nhập địa chỉ..." value={newCinemaAddress} onChange={e => setNewCinemaAddress(e.target.value)} />
        </div>
      </Modal>

      {/* MODAL THÊM PHÒNG CHIẾU MỚI */}
      <Modal
        title="Thêm Phòng Chiếu Mới"
        open={isRoomModalOpen}
        onOk={handleCreateRoom}
        onCancel={() => setIsRoomModalOpen(false)}
        okText="Lưu phòng"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Rạp trực thuộc</label>
          <Input disabled value={selectedCinema?.name || ''} />
        </div>
        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Tên phòng chiếu</label>
          <Input placeholder="Ví dụ: Screen 1, IMAX 01..." value={newRoomName} onChange={e => setNewRoomName(e.target.value)} />
        </div>
      </Modal>

    </div>
  );
}