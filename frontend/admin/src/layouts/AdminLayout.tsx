import { useMemo, useState } from 'react';
import { Layout, Menu, Avatar, Space, Button, Dropdown, Input, type MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  VideoCameraOutlined,
  SearchOutlined, // Import thêm icon kính lúp cho ô tìm kiếm
} from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';
import { adminMenu, filterMenuByRole } from '@/config/menu';

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const menuItems = useMemo(() => filterMenuByRole(adminMenu, user?.role), [user?.role]);

  // tìm key được highlight: lấy item có path là prefix của url hiện tại
  const selectedKey = useMemo(() => {
    const match = adminMenu.find((i) => location.pathname.startsWith(i.key));
    return match ? match.key : '';
  }, [location.pathname]);

  const userMenu: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: async () => {
        await logout();
        navigate('/auth/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* SIDEBAR NỀN TRẮNG CHUẨN FIGMA */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        width={240} 
        theme='light' 
        style={{ borderRight: '1px solid #f0f0f0' }}
      >
        {/* KHỐI LOGO CHỨA AVATAR + CHỮ KSTAR CINEMA */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 20px',
            gap: '12px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {/* Vòng tròn Avatar màu xanh chứa icon cuộn phim */}
          <Avatar 
            size={36} 
            style={{ 
              backgroundColor: '#1677ff', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }} 
            icon={<VideoCameraOutlined style={{ fontSize: '18px', color: '#fff' }} />} 
          />
          
          {/* Tên rạp phim (Ẩn mượt mà khi Sidebar thu nhỏ để tránh vỡ chữ) */}
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ color: '#1e293b', fontWeight: 800, fontSize: '15px', letterSpacing: '0.5px' }}>
                KSTAR
              </span>
              <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>
                Admin Console
              </span>
            </div>
          )}
        </div>

        {/* MENU DIỀU HƯỚNG TIẾNG VIỆT */}
        <Menu mode='inline' theme='light' selectedKeys={[selectedKey]} items={menuItems} />
      </Sider>

      <Layout>
        {/* HEADER TRÊN CÙNG */}
        <header
          style={{
            height: 64,
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            gap: '16px' // Tạo khoảng cách giữa nút menu, ô search và phần avatar bên phải
          }}
        >
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          
          {/* Ô TÌM KIẾM THEO THIẾT KẾ FIGMA */}
          <Input
            placeholder="Search movies, screens, or times..."
            prefix={<SearchOutlined style={{ color: '#94a3b8', marginRight: 8 }} />}
            style={{ 
              maxWidth: '400px', // Đặt độ rộng tối đa để không bị tràn
              borderRadius: '20px', // Bo tròn viền elip
              background: '#f8fafc', // Màu nền xám nhạt
              border: '1px solid #e2e8f0', // Viền xám nhạt
            }}
            variant="filled" // Sử dụng variant filled của Ant Design v5 để màu nền đồng bộ
          />

          <div style={{ flex: 1 }} />
          
          <Dropdown menu={{ items: userMenu }} placement='bottomRight'>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar src={user?.avatar || undefined} icon={<UserOutlined />} />
              <div style={{ lineHeight: 1.2, textAlign: 'right' }}>
                <div style={{ fontWeight: 500 }}>{user?.name || 'Admin User'}</div>
                <div style={{ color: '#999', fontSize: 12 }}>{user?.role || 'Super Admin'}</div>
              </div>
            </Space>
          </Dropdown>
        </header>

        {/* VÙNG CHỨA NỘI DUNG TRANG CON */}
        <Content style={{ margin: 16, padding: 24, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}