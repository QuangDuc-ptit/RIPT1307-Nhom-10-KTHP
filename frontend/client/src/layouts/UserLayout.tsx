import { Layout, Menu, Avatar, Space, Button, type MenuProps } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DashboardOutlined, UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';
import { env } from '@/config/env';

const { Header, Sider, Content } = Layout;

const sideItems: MenuProps['items'] = [
  { key: '/me', icon: <DashboardOutlined />, label: <Link to='/me'>Dashboard</Link> },
  { key: '/me/profile', icon: <UserOutlined />, label: <Link to='/me/profile'>Hồ sơ</Link> },
  {
    key: '/me/change-password',
    icon: <LockOutlined />,
    label: <Link to='/me/change-password'>Đổi mật khẩu</Link>,
  },
];

/**
 * Layout cho khu vực user đã đăng nhập (`/me/*`).
 * Khác PublicLayout ở chỗ có Sidebar menu.
 */
export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint='lg' collapsedWidth='0' theme='light' width={240}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--ant-color-primary, #1677ff)',
            borderBottom: '1px solid #eee',
          }}
        >
          <Link to='/'>{env.appName}</Link>
        </div>
        <Menu
          mode='inline'
          selectedKeys={[location.pathname]}
          items={sideItems}
          style={{ borderRight: 'none' }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px',
            background: '#fff',
            borderBottom: '1px solid #eee',
          }}
        >
          <Space>
            <Avatar src={user?.avatar || undefined} icon={<UserOutlined />} />
            <span>{user?.name}</span>
            <Button
              icon={<LogoutOutlined />}
              onClick={async () => {
                await logout();
                navigate('/');
              }}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
