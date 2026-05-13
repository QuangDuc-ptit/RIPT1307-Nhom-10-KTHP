import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

/**
 * Menu sidebar cho admin. Chỉ cần sửa file này khi muốn thêm/bớt menu.
 *
 * `key` PHẢI trùng với path để menu tự highlight đúng item theo URL.
 *
 * Để phân quyền theo role, thêm `requireRole` rồi lọc ở `AdminLayout`.
 */
export interface AdminMenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  requireRole?: ('ADMIN' | 'USER')[];
  children?: AdminMenuItem[];
}

export const adminMenu: AdminMenuItem[] = [
  {
    key: '/dashboard',
    label: <Link to='/dashboard'>Dashboard</Link>,
    icon: <DashboardOutlined />,
  },
  {
    key: '/users',
    label: <Link to='/users'>Người dùng</Link>,
    icon: <TeamOutlined />,
    requireRole: ['ADMIN'],
  },
  {
    key: '/posts',
    label: <Link to='/posts'>Bài viết</Link>,
    icon: <FileTextOutlined />,
  },
  {
    key: '/settings',
    label: <Link to='/settings'>Cài đặt</Link>,
    icon: <SettingOutlined />,
    requireRole: ['ADMIN'],
  },
];

export const filterMenuByRole = (
  items: AdminMenuItem[],
  role: 'ADMIN' | 'USER' | undefined,
): MenuProps['items'] =>
  items
    .filter((i) => !i.requireRole || (role && i.requireRole.includes(role)))
    .map((i) => ({
      key: i.key,
      label: i.label,
      icon: i.icon,
      children: i.children ? filterMenuByRole(i.children, role) : undefined,
    }));
