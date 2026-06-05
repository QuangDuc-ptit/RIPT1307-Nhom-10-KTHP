import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'combo' | 'addon';
  badge?: string;
  description?: string;
}

const productsData: Product[] = [
  {
    id: 'combo1',
    name: 'Combo Bắp Nước Solo',
    price: 85000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlOaXSe15brAi_oVQ2g9zkB7HxOseWTh_sYTubDG1l2q2UOy4PRL-y3bdy6LOboE0TQyD4fm01pSoGHVJZ0JypbPqEHj1jZCAIAeagEtieeNSaJlXKSE2_k3Q6sn1_QPEsorBzmVaQG4-mdHwRFIJd4KS89mVWV2vSAmhicO2H8ZBRnmZ3Opb2JqvquFcbZ7QvcwoCK3ejGKGQ7DDRUrVaBZgCMZh59WKuAOkeyrw62OyoPkc0g6kb-3vTQKQc0TX0nFsCAhzqNXQ',
    category: 'combo',
    badge: 'TIẾT KIỆM 15%',
    description: '1 Bắp lớn (Vị ngọt/mặn) + 1 Nước ngọt lớn (Coke/Pepsi/Fanta)'
  },
  {
    id: 'combo2',
    name: 'Combo KSTAR Duo',
    price: 145000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvVxm7MENc1-nqMDu8193NTB-CWkGHxbmAha9a0bTBsKcYqbq4Gf7BbJCwRayiiWRlUEfJTv3opcZCMyvi7CZ8tD-9nb-oI9TZldxjHb0_bQf4qPXkzOtU1Kw56hFEF3StDDhHtcA95PzxWFJQufQipqO332ramwut9dXD2AJIWtcJkI9eoQyD9ZNMXFe5BNAl38vMyZZPZfSdvgx3tLSYhzDcVazpnGR2LrKMHtqY12QvkPdZDlCEg8eVQTCNjQo3SL6_RmyaPrQ',
    category: 'combo',
    badge: 'COMBO CẶP ĐÔI',
    description: '2 Bắp vừa + 2 Nước ngọt lớn + 1 Gói Snack khoai tây'
  },
  {
    id: 'combo3',
    name: 'Combo Gia Đình',
    price: 210000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0B8zoMy0qp9hFajLTwRSCeOPnvL4wcsnYw1sjkiIsKFDvuDpYdH_QiOG9qAS-fli4oM4nLSztZZmV3uSxFQjcb2ffcZcg_uhxvTF-uQcb7lYsHviAopp_4FejKWe-5NTltyIRQ0qpsa6QZqNHLn_VEMQdRgWfojXHUrkk6S_HMNb_Xv-tUzcRXagpjNceENuLDkN0VbyTEYCJSvbdWvvRRzJI3HL6JOZgVFvsmXJHTfyJf10KxZmYSH9TrerI5uwPPCNPN_ldRRI',
    category: 'combo',
    badge: 'FAMILY PACK',
    description: '3 Bắp lớn + 4 Nước ngọt + 2 Phần Hotdog đặc biệt'
  },
  {
    id: 'addon1',
    name: 'Hot Dog',
    price: 45000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBoul2GTnWA65Z1GYEMuGw7RvoDPIuNrMwrWE55Ad8TjeQ_Kf3q9zAWHrW1bWHhIObUSrbZtgecsn9B4QtUyC0-3JUQYKpJRDmQ5s5pAmqSjAnAM35ZoeQ7L25penl3utV-o7flaJIGfkT0D1YlmkZKCqfN1GlpqR3dci-ymBRKR2RXQo8LoynU0CPUxVcG6RuSM6SUs00BGrW3KL3HN1U-Z9nkVAz5iZgVYwNa8GFXTQU8tJ0uxsR18sTyHlM1kTjokcUbB-F5-k',
    category: 'addon'
  },
  {
    id: 'addon2',
    name: 'Pepsi Cỡ Đại',
    price: 35000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGIKgR1cyGp8CATdF0oa40FurAH1cYadH2LFlXcb2WmKyEfJWV33cbI8OuI1Nz2Q4oIGvfVXPvvl1WmOrJzsPkANW0lsjb-f8_sxJJm1I2EnlCjIemfRu8x_loExtYQqCu7hRfD9k7UZqDz1ILrPP8lkvNYVmWXCczWbu6hobewp-GnxZaufX6J-iegsIK2PFjKr2TYT90D5Iq8dEbC4z0xhcQAlcI-poTP3G-5yCx10HGRaoayEt-PR8hG4-BV6KU6fF2CT0xG8g',
    category: 'addon'
  },
  {
    id: 'addon3',
    name: 'Nachos Phô Mai',
    price: 55000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcwOvNt2h_14oBuweZUCanD6xrIchufmo3Pog-qOhuqEO_U4QsHt91TvK0WpphD6psvFhKvraAe7k7hbAFmnd5NkeVuiRLhNvX2mnm2pm_dxvCSwF94ZD1aza1y894071G2ypBkKiKYEe7WTz3TrziiV81rOcsiSPivyVyR2NLUr1Z5_j6yWwtZK4u_gBSRYMbl_UkbND0DzShO8iYRZNlHLBHB7YM28OzZjPNfJrAgG7l17ihXA2XGm0y4iEyny4FYJZqZxCTYxo',
    category: 'addon'
  },
  {
    id: 'addon4',
    name: 'Aquafina 500ml',
    price: 20000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJb5-3HO908IoeqcbHByxxlFEhz2yB36-4jOqBUw6OIx79uZm16HwrQgIndsyofxFUOAnSzsArGHxgiuwKTfLlGfWSqS1ZA11GwNl-POaSWc4NKOaoi5Xai1nQay6wBR7knRTAKzMqMRfNfyBeqyYASP_VtR1GTXgC0XW8rZHau4ysYVuuWGrZDl-vyULnra3EcbYQPF5tX-aU8gKmh3FQ8PUA0N8ijxD8etlqyTxVv_0aZRXSF_eLZrqp6H9laqxGfQVo756VZsU',
    category: 'addon'
  }
];

const FoodDrinkPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingState = location.state as any;

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    productsData.forEach(p => { init[p.id] = 0; });
    return init;
  });

  const increment = (id: string) => setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
  const decrement = (id: string) => setQuantities(prev => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));

  const foodTotal = useMemo(() => {
    return productsData.reduce((sum, p) => sum + p.price * quantities[p.id], 0);
  }, [quantities]);

  const seatsTotal = bookingState?.totalSeatsPrice || 0;
  const grandTotal = seatsTotal + foodTotal;

  const selectedItemsSummary = useMemo(() => {
    return productsData.filter(p => quantities[p.id] > 0).map(p => `${quantities[p.id]}x ${p.name}`);
  }, [quantities]);

  const handleReset = () => {
    const reset: Record<string, number> = {};
    productsData.forEach(p => { reset[p.id] = 0; });
    setQuantities(reset);
  };

  const handleContinue = () => {
    const selectedProducts = productsData
      .filter(p => quantities[p.id] > 0)
      .map(p => ({ ...p, quantity: quantities[p.id] }));
    navigate('/checkout', {
      state: {
        ...bookingState,
        foodItems: selectedProducts,
        foodTotal,
        grandTotal
      }
    });
  };

  useEffect(() => {
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';
    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1';
    document.head.appendChild(link1);
    document.head.appendChild(link2);
    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
    };
  }, []);

  const colors = {
    surface: '#131313',
    onSurface: '#e5e2e1',
    onSurfaceVariant: '#e9bcb6',
    primaryContainer: '#e50914',
    primary: '#ffb4aa',
    border: 'rgba(255,255,255,0.1)',
  };

  const glassStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${colors.border}`,
  };

  const movieTitle = bookingState?.bookingInfo?.movie?.title || 'Interstellar: Trải nghiệm IMAX';

  return (
    <div style={{ backgroundColor: colors.surface, color: colors.onSurface, fontFamily: 'Montserrat, sans-serif', minHeight: '100vh', paddingBottom: '120px' }}>
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ width: '32px', height: '32px', ...glassStyle, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>arrow_back</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>QUAY LẠI</span>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '9999px', border: `1px solid ${colors.onSurface}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>1</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>CHỌN GHẾ</span>
          </div>
          <div style={{ width: '32px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '9999px', backgroundColor: colors.primaryContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: 'white' }}>2</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: colors.primary }}>CHỌN COMBO</span>
          </div>
          <div style={{ width: '32px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '9999px', border: `1px solid ${colors.onSurface}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>3</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>THANH TOÁN</span>
          </div>
        </div>

        <section style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: colors.primary, display: 'block', marginBottom: '4px' }}>BÁN CHẠY NHẤT</span>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Combo Phổ Biến</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {productsData.filter(p => p.category === 'combo').map(combo => (
              <div key={combo.id} style={{ ...glassStyle, borderRadius: '12px', padding: '16px' }}>
                <div style={{ position: 'relative', height: '160px', marginBottom: '16px', overflow: 'hidden', borderRadius: '8px' }}>
                  <img src={combo.image} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                  {combo.badge && <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: colors.primaryContainer, color: 'white', padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: 'bold' }}>{combo.badge}</div>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{combo.name}</h3>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: colors.primary }}>{combo.price.toLocaleString('vi-VN')}đ</span>
                </div>
                <p style={{ fontSize: '14px', color: colors.onSurfaceVariant, marginBottom: '16px' }}>{combo.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>SỐ LƯỢNG</span>
                  <div style={{ display: 'flex', alignItems: 'center', ...glassStyle, borderRadius: '9999px', padding: '2px' }}>
                    <button onClick={() => decrement(combo.id)} style={{ width: '32px', height: '32px', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
                    </button>
                    <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>{quantities[combo.id]}</span>
                    <button onClick={() => increment(combo.id)} style={{ width: '32px', height: '32px', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainer, border: 'none', cursor: 'pointer' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'white' }}>add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: colors.onSurfaceVariant, display: 'block', marginBottom: '4px' }}>THÊM HƯƠNG VỊ</span>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Sản Phẩm Kèm Theo</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {productsData.filter(p => p.category === 'addon').map(addon => (
              <div key={addon.id} style={{ ...glassStyle, borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={addon.image} alt={addon.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{addon.name}</h4>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: colors.primary, margin: '4px 0 0' }}>{addon.price.toLocaleString('vi-VN')}đ</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ...glassStyle, borderRadius: '8px', padding: '4px 8px' }}>
                  <button onClick={() => increment(addon.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined" style={{ color: colors.primary, fontSize: '18px' }}>add</span>
                  </button>
                  <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{quantities[addon.id]}</span>
                  <button onClick={() => decrement(addon.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, ...glassStyle, borderTop: `1px solid ${colors.border}`, padding: '16px 20px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>PHIM ĐANG CHỌN</div>
              <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{movieTitle}</p>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>TỔNG CỘNG</div>
              <p style={{ fontSize: '24px', fontWeight: '700', color: colors.primary, margin: 0 }}>{grandTotal.toLocaleString('vi-VN')}đ</p>
            </div>
            <div style={{ borderLeft: `1px solid ${colors.border}`, paddingLeft: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>COMBO ĐÃ CHỌN</div>
              <p style={{ fontSize: '14px', fontStyle: 'italic', color: colors.onSurfaceVariant, maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                {selectedItemsSummary.length > 0 ? selectedItemsSummary.join(', ') : 'Chưa có combo nào'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
            <button onClick={handleReset} style={{ flex: 1, padding: '12px 24px', ...glassStyle, borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer' }}>LÀM MỚI</button>
            <button onClick={handleContinue} style={{ flex: 1, padding: '12px 24px', backgroundColor: colors.primaryContainer, border: 'none', borderRadius: '12px', color: 'white', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(229,9,20,0.4)' }}>
              TIẾP TỤC
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        button {
          transition: all 0.2s;
        }
        button:hover:not(:disabled) {
          transform: scale(1.02);
        }
        button:active:not(:disabled) {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default FoodDrinkPage;