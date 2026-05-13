import { Layout, Menu, Button, Space, Avatar, Dropdown, type MenuProps } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';
import { env } from '@/config/env';

const { Header, Content, Footer } = Layout;

const navItems: MenuProps['items'] = [
  { key: '/', label: <Link to='/'>Trang chủ</Link> },
  { key: '/blog', label: <Link to='/blog'>Blog</Link> },
  { key: '/about', label: <Link to='/about'>Về chúng tôi</Link> },
];

/**
 * Layout cho phần public (không cần đăng nhập).
 * - Header có navigation + nút Đăng nhập / Avatar (nếu đã đăng nhập)
 * - Content render `<Outlet/>` (page con từ react-router)
 * - Footer chung
 */
export default function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const userMenu: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard cá nhân',
      onClick: () => navigate('/me'),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin tài khoản',
      onClick: () => navigate('/me/profile'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: async () => {
        await logout();
        navigate('/');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          borderBottom: '1px solid #eee',
        }}
      >
        <Link
          to='/'
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--ant-color-primary, #1677ff)',
            marginRight: 32,
          }}
        >
          {env.appName}
        </Link>
        <Menu
          mode='horizontal'
          items={navItems}
          selectedKeys={[location.pathname]}
          style={{ flex: 1, borderBottom: 'none' }}
        />

        {user ? (
          <Dropdown menu={{ items: userMenu }} placement='bottomRight'>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar src={user.avatar || undefined} icon={<UserOutlined />} />
              <span style={{ fontWeight: 500 }}>{user.name}</span>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Button onClick={() => navigate('/auth/login')}>Đăng nhập</Button>
            <Button type='primary' onClick={() => navigate('/auth/register')}>
              Đăng ký
            </Button>
          </Space>
        )}
      </Header>

      <Content style={{ padding: '24px 32px' }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center', background: '#fafafa' }}>
        © {new Date().getFullYear()} {env.appName} — Built with React + Antd 5
      </Footer>
    </Layout>
  );
}
