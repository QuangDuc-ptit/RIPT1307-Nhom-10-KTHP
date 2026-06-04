import React from 'react';
import { Layout, Menu, Avatar, Space, Button, type MenuProps } from 'antd';
import { history, useLocation } from 'umi';
import {
  DashboardOutlined,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '@/store/auth';
import { env } from '@/config/env';

const { Header, Sider, Content } = Layout;

const sideItems: MenuProps['items'] = [
  {
    key: '/me',
    icon: <DashboardOutlined />,
    label: (
      <span
        onClick={() => history.push('/me')}
        style={{ cursor: 'pointer' }}
      >
        Dashboard
      </span>
    ),
  },
  {
    key: '/me/profile',
    icon: <UserOutlined />,
    label: (
      <span
        onClick={() => history.push('/me/profile')}
        style={{ cursor: 'pointer' }}
      >
        Hồ sơ
      </span>
    ),
  },
  {
    key: '/me/change-password',
    icon: <LockOutlined />,
    label: (
      <span
        onClick={() => history.push('/me/change-password')}
        style={{ cursor: 'pointer' }}
      >
        Đổi mật khẩu
      </span>
    ),
  },
];

interface Props {
  children?: React.ReactNode;
}

export default function UserLayout(props: Props) {
  const location = useLocation();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        theme="light"
        width={240}
      >
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
            cursor: 'pointer',
          }}
          onClick={() => history.push('/')}
        >
          {env.appName}
        </div>

        <Menu
          mode="inline"
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
            <Avatar
              src={user?.avatar || undefined}
              icon={<UserOutlined />}
            />

            <span>{user?.name}</span>

            <Button
              icon={<LogoutOutlined />}
              onClick={async () => {
                await logout();
                history.push('/');
              }}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>

        <Content style={{ padding: 24 }}>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
}