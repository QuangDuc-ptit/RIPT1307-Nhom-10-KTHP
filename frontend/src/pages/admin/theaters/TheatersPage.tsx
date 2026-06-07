import { useState, useMemo, useEffect } from 'react';
import { Space, Button, InputNumber, Dropdown, MenuProps, message } from 'antd';
import { 
  DownOutlined, 
  UndoOutlined, 
  RedoOutlined, 
  AppstoreOutlined, 
  SaveOutlined 
} from '@ant-design/icons';

// Interface cấu hình riêng cho từng phòng chiếu
interface ScreenConfig {
  rows: number;
  cols: number;
  priceStandard: number;
  priceVip: number;
  priceCouple: number;
}

// Interface để quản lý lịch sử undo/redo cho từng phòng
interface GridState {
  rows: number;
  cols: number;
}

export default function TheatersPage() {
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);

  // Khởi tạo data từ localStorage, nếu chưa có dữ liệu cũ thì nạp giá trị mặc định ban đầu bằng VND
  const [theaterConfigs, setTheaterConfigs] = useState<Record<string, ScreenConfig>>(() => {
    const savedConfigs = localStorage.getItem('global_theater_configs');
    if (savedConfigs) {
      try {
        return JSON.parse(savedConfigs);
      } catch (e) {
        // Phòng hờ dữ liệu bị lỗi format JSON
      }
    }
    // Giá vé mặc định ban đầu theo đơn vị VND (80k - 120k - 160k)
    return {
      'Screen 1 - IMAX': { rows: 11, cols: 13, priceStandard: 80000, priceVip: 120000, priceCouple: 160000 },
      'Screen 2 - IMAX': { rows: 12, cols: 12, priceStandard: 80000, priceVip: 120000, priceCouple: 160000 },
      'Screen 3 - IMAX': { rows: 10, cols: 10, priceStandard: 80000, priceVip: 120000, priceCouple: 160000 },
      'Screen 4 - IMAX': { rows: 10, cols: 10, priceStandard: 80000, priceVip: 120000, priceCouple: 160000 },
      'Screen 5 - IMAX': { rows: 10, cols: 10, priceStandard: 80000, priceVip: 120000, priceCouple: 160000 },
      'Screen 6 - IMAX': { rows: 10, cols: 10, priceStandard: 80000, priceVip: 120000, priceCouple: 160000 },
    };
  });

  // Tự động đồng bộ toàn bộ thay đổi của các phòng chiếu vào localStorage của trình duyệt
  useEffect(() => {
    localStorage.setItem('global_theater_configs', JSON.stringify(theaterConfigs));
  }, [theaterConfigs]);

  // Lấy ra cấu hình hiện tại của phòng đang chọn (nếu chưa chọn thì lấy tạm mặc định)
  const currentConfig = useMemo(() => {
    if (!selectedScreen) return { rows: 10, cols: 10, priceStandard: 80000, priceVip: 120000, priceCouple: 160000 };
    return theaterConfigs[selectedScreen];
  }, [selectedScreen, theaterConfigs]);

  // Các hàm cập nhật config động dựa theo phòng đang chọn
  const updateCurrentConfig = (fields: Partial<ScreenConfig>) => {
    if (!selectedScreen) return;
    setTheaterConfigs(prev => ({
      ...prev,
      [selectedScreen]: {
        ...prev[selectedScreen],
        ...fields
      }
    }));
  };

  // LOGIC UNDO / REDO TRẠNG THÁI KÍCH THƯỚC (Quản lý theo phòng hiện tại)
  const [history, setHistory] = useState<GridState[]>([{ rows: 10, cols: 10 }]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

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

  // Khi chuyển đổi phòng chiếu, reset lại lịch sử undo/redo của grid size về trạng thái phòng đó
  const handleScreenChange = (screenKey: string) => {
    setSelectedScreen(screenKey);
    const targetConfig = theaterConfigs[screenKey];
    setHistory([{ rows: targetConfig.rows, cols: targetConfig.cols }]);
    setHistoryIndex(0);
  };

  // LOGIC DROPDOWN CHÈN BẢNG KIỂU WORD
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
                  onMouseEnter={() => {
                    setHoveredRow(rIdx + 1);
                    setHoveredCol(cIdx + 1);
                  }}
                  onMouseLeave={() => {
                    setHoveredRow(0);
                    setHoveredCol(0);
                  }}
                  onClick={() => updateGridSize(rIdx + 10, cIdx + 10)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 2,
                    border: '1px solid #cbd5e1',
                    background: isSelected ? '#c7d2fe' : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease'
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

  const screenItems: MenuProps['items'] = [
    { key: 'Screen 1 - IMAX', label: 'Screen 1 - IMAX' },
    { key: 'Screen 2 - IMAX', label: 'Screen 2 - IMAX' },
    { key: 'Screen 3 - IMAX', label: 'Screen 3 - IMAX' },
    { key: 'Screen 4 - IMAX', label: 'Screen 4 - IMAX' },
    { key: 'Screen 5 - IMAX', label: 'Screen 5 - IMAX' },
    { key: 'Screen 6 - IMAX', label: 'Screen 6 - IMAX' },
  ];

  const rowLabels = useMemo(() => {
    const labels = [];
    for (let i = 0; i < currentConfig.rows; i++) {
      labels.push(String.fromCharCode(65 + (i >= 8 ? i + 1 : i)));
    }
    return labels;
  }, [currentConfig.rows]);

  return (
    <div style={{ background: '#fff', minHeight: '75vh', padding: '12px 0' }}>
      
      {/* HÀNG 1: BREADCRUMB & NÚT LƯU */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space style={{ fontSize: '14px', color: '#64748b' }}>
          <span>Theaters</span>
          <span>&gt;</span>
          <Dropdown menu={{ items: screenItems, onClick: (info) => handleScreenChange(info.key) }} trigger={['click']}>
            <Button type="text" style={{ fontWeight: 700, color: '#1e293b', fontSize: '16px', padding: 0 }}>
              {selectedScreen ? selectedScreen : 'Chọn phòng chiếu'} <DownOutlined style={{ fontSize: 12, marginLeft: 4 }} />
            </Button>
          </Dropdown>
        </Space>

        {selectedScreen && (
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={() => message.success(`Đã lưu cấu hình thành công cho ${selectedScreen}!`)}
            style={{ borderRadius: 6, background: '#1677ff', fontWeight: 600 }}
          >
            Lưu
          </Button>
        )}
      </div>

      {!selectedScreen ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#94a3b8' }}>
          <AppstoreOutlined style={{ fontSize: 40, marginBottom: 12, color: '#cbd5e1' }} />
          <p style={{ fontSize: '14px' }}>Vui lòng chọn phòng chiếu phía trên để hiển thị ma trận cấu hình ghế.</p>
        </div>
      ) : (
        <>
          {/* HÀNG 2: THANH CẤU HÌNH THEO TỪNG PHÒNG CHIẾU */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: '#f8fafc', 
            padding: '16px', 
            borderRadius: 8,
            marginBottom: 32,
            border: '1px dashed #cbd5e1'
          }}>
            <Space size={32}>
              {/* Kích thước */}
              <Space direction="vertical" size={4}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>KÍCH THƯRICH</span>
                <Space>
                  <span style={{ fontSize: '13px' }}>Hàng:</span>
                  <InputNumber min={10} max={20} value={currentConfig.rows} onChange={(val) => updateGridSize(val || 10, currentConfig.cols)} size="small" style={{ width: 55 }} />
                  <span style={{ fontSize: '13px' }}>Cột:</span>
                  <InputNumber min={10} max={20} value={currentConfig.cols} onChange={(val) => updateGridSize(currentConfig.rows, val || 10)} size="small" style={{ width: 55 }} />
                </Space>
              </Space>

              {/* GIÁ VÉ SỐ TIỀN CỦA TỪNG PHÒNG */}
              <Space direction="vertical" size={4}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>GIÁ VÉ</span>
                <Space size={16}>
                  <Space size={4}>
                    <span style={{ background: '#93c5fd', color: '#1d4ed8', width: 12, height: 12, borderRadius: 2, display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: 600 }}>Standard:</span>
                    <InputNumber 
                      min={0} 
                      step={5000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value ? Number(value.replace(/[^\d]/g, '')) : 0}
                      value={currentConfig.priceStandard} 
                      onChange={(val) => updateCurrentConfig({ priceStandard: val || 0 })} 
                      size="small" 
                      style={{ width: 110 }} 
                      addonAfter="đ" 
                    />
                  </Space>
                  <Space size={4}>
                    <span style={{ background: '#fef08a', color: '#a16207', width: 12, height: 12, borderRadius: 2, display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: '#a16207', fontWeight: 600 }}>VIP:</span>
                    <InputNumber 
                      min={0} 
                      step={5000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value ? Number(value.replace(/[^\d]/g, '')) : 0}
                      value={currentConfig.priceVip} 
                      onChange={(val) => updateCurrentConfig({ priceVip: val || 0 })} 
                      size="small" 
                      style={{ width: 110 }} 
                      addonAfter="đ" 
                    />
                  </Space>
                  <Space size={4}>
                    <span style={{ background: '#fbcfe8', color: '#db2777', width: 12, height: 12, borderRadius: 2, display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: '#db2777', fontWeight: 600 }}>Couple:</span>
                    <InputNumber 
                      min={0} 
                      step={5000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value ? Number(value.replace(/[^\d]/g, '')) : 0}
                      value={currentConfig.priceCouple} 
                      onChange={(val) => updateCurrentConfig({ priceCouple: val || 0 })} 
                      size="small" 
                      style={{ width: 110 }} 
                      addonAfter="đ" 
                    />
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
                      // LOGIC GHẾ ĐÔI COUPLE: CỐ ĐỊNH ĐÚNG 6 GHẾ MỖI HÀNG
                      if (isCoupleRow) {
                        let coupleCount = 0;
                        return displayColsArray.map((_, colDisplayIndex) => {
                          const displayColNum = colDisplayIndex + 1;

                          // Lối đi xám cố định
                          if (displayColNum === 4 || displayColNum === 9) {
                            return (
                              <div 
                                key={`walkway-couple-${displayColNum}`} 
                                style={{ width: 24, height: 24, background: '#e2e8f0', borderRadius: 4 }} 
                              />
                            );
                          }

                          // Tạo tối đa đúng 6 cặp ghế đôi bo góc mỗi hàng
                          coupleCount++;
                          if (coupleCount <= 6) {
                            return (
                              <div 
                                key={`couple-${rowLabel}-${coupleCount}`}
                                style={{ 
                                  width: 54, 
                                  height: 24, 
                                  background: '#fbcfe8', 
                                  borderRadius: 6,
                                  border: '1px solid #f472b6',
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  color: '#db2777',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                C{coupleCount}
                              </div>
                            );
                          }
                          return null;
                        });
                      }

                      // LOGIC RENDER GHẾ THƯỜNG & VIP
                      return displayColsArray.map((_, colDisplayIndex) => {
                        const displayColNum = colDisplayIndex + 1;

                        if (displayColNum === 4 || displayColNum === 9) {
                          return (
                            <div 
                              key={`walkway-${displayColNum}`} 
                              style={{ width: 24, height: 24, background: '#e2e8f0', borderRadius: 4 }} 
                            />
                          );
                        }

                        currentSeatNumber++;

                        // Cố định vùng ghế VIP
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

                        // Ghế Standard thông thường
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
    </div>
  );
}