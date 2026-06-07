import { useMemo, useState } from 'react';
import { Layout, Menu, Avatar, Space, Button, Dropdown, Input, type MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  VideoCameraOutlined,
  SearchOutlined,
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
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        width={240} 
        theme='light' 
        style={{ borderRight: '1px solid #f0f0f0' }}
      >
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
        <Menu mode='inline' theme='light' selectedKeys={[selectedKey]} items={menuItems} />
      </Sider>

      <Layout>
        <header
          style={{
            height: 64,
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            gap: '16px'
          }}
        >
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          <Input
            placeholder="Search movies, screens, or times..."
            prefix={<SearchOutlined style={{ color: '#94a3b8', marginRight: 8 }} />}
            style={{ 
              maxWidth: '400px',
              borderRadius: '20px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
            variant="filled"
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
        <Content style={{ margin: 16, padding: 24, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}