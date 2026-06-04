import React, { useState } from 'react';
import { Button, message } from 'antd';
import { 
  DeleteOutlined, 
  ArrowRightOutlined, 
  FilterOutlined,
  MinusOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { ProductType } from './typing';

const FoodDrinkPage: React.FC = () => {
  const colors = { 
    bg: '#1a1416',        
    cardBg: '#22171a',    
    inputBg: '#342127',   
    primary: '#e42755',   
    textWhite: '#ffffff', 
    textDim: '#a3989c', 
    border: '#3b2a31'     
  };

  // --- 1. KHỞI TẠO STATE CHO TAB ĐANG ACTIVE ---
  const [activeTab, setActiveTab] = useState('Combo nổi bật');

  const combos: ProductType[] = [
    { id: 'c1', name: 'Movie Night Duo', price: 185000, description: '1 bắp rang lớn, 2 nước ngọt vừa, 1 hộp kẹo', image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=400&auto=format&fit=crop', badge: 'Giá tốt nhất' },
    { id: 'c2', name: 'Family Feast', price: 320000, description: '2 bắp rang lớn, 4 nước ngọt vừa, 2 hộp kẹo', image: 'https://images.unsplash.com/photo-1572196284554-4e321b0e7e0b?q=80&w=400&auto=format&fit=crop' },
    { id: 'c3', name: 'Solo Snacker', price: 125000, description: '1 bắp rang nhỏ, 1 nước ngọt nhỏ, 1 hộp kẹo', image: 'https://i.pinimg.com/1200x/71/56/50/71565075be21f3acd4fd8da611b54927.jpg' },
  ];

  // --- 2. THÊM THUỘC TÍNH "category" ĐỂ LỌC ---
  const addons: (ProductType & { category: string })[] = [
    { id: 'a1', name: 'Bắp rang lớn', price: 85000, image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=300&auto=format&fit=crop', category: 'Bắp rang' },
    { id: 'a5', name: 'Bắp rang phô mai', price: 95000, image: 'https://i.pinimg.com/1200x/48/60/b3/4860b397cfa2ba41834cb35e5b9a5fbc.jpg', category: 'Bắp rang' },
    { id: 'a2', name: 'Nước ngọt XL', price: 65000, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300&auto=format&fit=crop', category: 'Đồ uống' },
    { id: 'a6', name: 'Nước suối Dasani', price: 25000, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=300&auto=format&fit=crop', category: 'Đồ uống' },
    { id: 'a3', name: 'Kẹo dẻo', price: 55000, image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=300&auto=format&fit=crop', category: 'Đồ ăn vặt' },
    { id: 'a4', name: 'Nachos đặc biệt', price: 95000, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=300&auto=format&fit=crop', category: 'Đồ ăn vặt' },
  ];

  const allProducts = [...combos, ...addons];
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const handleUpdateCart = (id: string, delta: number) => {
    setCart(prev => {
      const currentQty = prev[id] || 0;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const handleAddToCart = (id: string) => {
    if (!cart[id]) {
      handleUpdateCart(id, 1);
      message.success('Đã thêm vào giỏ hàng!');
    }
  };

  const totalAmount = Object.keys(cart).reduce((total, id) => {
    const product = allProducts.find(p => p.id === id);
    return total + (product ? product.price * cart[id] : 0);
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Render một khối sản phẩm lẻ (để tái sử dụng cho code gọn)
  const renderAddonGrid = (items: typeof addons) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
      {items.map(addon => {
        const qty = cart[addon.id] || 0;
        return (
          <div key={addon.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', height: '220px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src={addon.image} alt={addon.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{addon.name}</h3>
              <div style={{ color: colors.primary, fontWeight: 'bold', fontSize: '15px', marginBottom: '16px' }}>{formatCurrency(addon.price)}</div>
              {qty === 0 ? (
                <Button block onClick={() => handleUpdateCart(addon.id, 1)} style={{ backgroundColor: colors.inputBg, color: colors.primary, border: 'none', borderRadius: '24px', height: '40px', fontWeight: 'bold' }}>+ Thêm</Button>
              ) : (
                <div style={{ backgroundColor: colors.inputBg, borderRadius: '24px', display: 'flex', alignItems: 'center', padding: '4px 8px', justifyContent: 'space-between' }}>
                  <Button type="text" icon={<MinusOutlined />} style={{ color: colors.textWhite }} onClick={() => handleUpdateCart(addon.id, -1)} />
                  <span style={{ fontWeight: 'bold' }}>{qty}</span>
                  <Button type="text" icon={<PlusOutlined />} style={{ color: colors.textWhite }} onClick={() => handleUpdateCart(addon.id, 1)} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', paddingBottom: '120px', color: colors.textWhite, fontFamily: 'sans-serif' }}>
      
      {/* KHỐI TABS KÍCH HOẠT SỰ KIỆN CLICK */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, marginBottom: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%', display: 'flex', gap: '32px' }}>
          {['Combo nổi bật', 'Bắp rang', 'Đồ uống', 'Đồ ăn vặt'].map((tab) => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab)} // <-- Bấm vào để đổi Tab
              style={{ 
                padding: '20px 0', 
                color: activeTab === tab ? colors.primary : colors.textDim, 
                fontWeight: 'bold', 
                borderBottom: activeTab === tab ? `2px solid ${colors.primary}` : '2px solid transparent', 
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
              {tab}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 5%' }}>
        
        {/* LOGIC RENDER DỰA TRÊN TAB ĐƯỢC CHỌN */}
        {activeTab === 'Combo nổi bật' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Combo phổ biến</h2>
              <span style={{ color: colors.primary, cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Xem tất cả</span>
            </div>

            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }}>
              {combos.map(combo => {
                const qty = cart[combo.id] || 0;
                return (
                  <div key={combo.id} style={{ minWidth: '350px', backgroundColor: colors.cardBg, borderRadius: '20px', overflow: 'hidden', border: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', height: '200px' }}>
                      <img src={combo.image} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {combo.badge && <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: colors.primary, color: '#fff', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold' }}>{combo.badge}</div>}
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{combo.name}</h3>
                          <span style={{ color: colors.primary, fontWeight: 'bold', fontSize: '18px' }}>{formatCurrency(combo.price)}</span>
                        </div>
                        <p style={{ color: colors.textDim, fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>{combo.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ backgroundColor: colors.inputBg, borderRadius: '24px', display: 'flex', alignItems: 'center', padding: '4px 8px', width: '100px', justifyContent: 'space-between' }}>
                          <Button type="text" icon={<MinusOutlined />} style={{ color: colors.textWhite }} onClick={() => handleUpdateCart(combo.id, -1)} />
                          <span style={{ fontWeight: 'bold' }}>{qty}</span>
                          <Button type="text" icon={<PlusOutlined />} style={{ color: colors.textWhite }} onClick={() => handleUpdateCart(combo.id, 1)} />
                        </div>
                        <Button type="primary" onClick={() => handleAddToCart(combo.id)} style={{ flex: 1, backgroundColor: qty > 0 ? colors.primary : colors.inputBg, color: qty > 0 ? '#fff' : colors.primary, border: 'none', borderRadius: '24px', height: '42px', fontWeight: 'bold' }}>
                          Thêm vào giỏ
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '40px 0 24px 0' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Kèm theo</h2>
              <Button type="text" icon={<FilterOutlined />} style={{ backgroundColor: colors.inputBg, color: colors.textWhite, border: 'none', borderRadius: '50%', width: '40px', height: '40px' }} />
            </div>
            
            {/* Hiển thị toàn bộ đồ ăn vặt ở tab Combo */}
            {renderAddonGrid(addons)}
          </>
        ) : (
          <>
            {/* KHI BẤM VÀO CÁC TAB KHÁC -> LỌC SẢN PHẨM */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 24px 0' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{activeTab}</h2>
              <Button type="text" icon={<FilterOutlined />} style={{ backgroundColor: colors.inputBg, color: colors.textWhite, border: 'none', borderRadius: '50%', width: '40px', height: '40px' }} />
            </div>

            {/* Dùng filter để lọc theo category */}
            {renderAddonGrid(addons.filter(item => item.category === activeTab))}
          </>
        )}
      </div>

      {/* THANH BOTTOM THANH TOÁN (GIỮ NGUYÊN) */}
      {totalAmount > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#110c0e', borderTop: `1px solid ${colors.border}`, padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000 }}>
          <div>
            <div style={{ color: colors.textDim, fontSize: '12px', textTransform: 'uppercase' }}>Tổng tạm tính</div>
            <div style={{ fontSize: '32px', fontWeight: '900' }}>{formatCurrency(totalAmount)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Button type="text" icon={<DeleteOutlined />} onClick={() => setCart({})} style={{ color: colors.textDim }}>Xóa tất cả</Button>
            <Button type="primary" style={{ backgroundColor: colors.primary, border: 'none', borderRadius: '30px', height: '54px', padding: '0 32px', fontSize: '18px', fontWeight: 'bold' }}>Thanh toán <ArrowRightOutlined /></Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDrinkPage;