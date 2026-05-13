import { useMemo, useState } from 'react';
import { Layout, Menu, Avatar, Space, Button, Dropdown, type MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';
import { adminMenu, filterMenuByRole } from '@/config/menu';
import { env } from '@/config/env';

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
      <Sider trigger={null} collapsible collapsed={collapsed} width={240} theme='dark'>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: collapsed ? 16 : 18,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {collapsed ? 'BW' : env.appName}
        </div>
        <Menu mode='inline' theme='dark' selectedKeys={[selectedKey]} items={menuItems} />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          <div style={{ flex: 1 }} />
          <Dropdown menu={{ items: userMenu }} placement='bottomRight'>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar src={user?.avatar || undefined} icon={<UserOutlined />} />
              <div style={{ lineHeight: 1.2, textAlign: 'right' }}>
                <div style={{ fontWeight: 500 }}>{user?.name}</div>
                <div style={{ color: '#999', fontSize: 12 }}>{user?.role}</div>
              </div>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: 16, padding: 24, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
