import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  VideoCameraOutlined,    // Icon phù hợp cho Quản lý rạp phim / nội dung
  CalendarOutlined,       // Lịch chiếu
  CoffeeOutlined,         // Đồ ăn và nước uống
  PercentageOutlined,     // Khuyến mãi
  SettingOutlined,        // Cài đặt (Đã xóa BarChartOutlined tại đây)
  ScanOutlined,           // Soát vé
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

/**
 * Menu sidebar cho admin rạp phim KSTAR.
 * `key` PHẢI trùng với path để menu tự highlight đúng item theo URL.
 */
export interface AdminMenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  requireRole?: ('ADMIN' | 'USER' | 'STAFF')[];
  children?: AdminMenuItem[];
}

export const adminMenu: AdminMenuItem[] = [
  {
    key: '/dashboard',
    label: <Link to='/dashboard'>Dashboard</Link>,
    icon: <DashboardOutlined />,
  },
  {
    key: '/content',
    label: <Link to='/content'>Quản lý rạp</Link>,
    icon: <VideoCameraOutlined />,
  },
  {
    key: '/showtimes',
    label: <Link to='/showtimes'>Lịch chiếu</Link>,
    icon: <CalendarOutlined />,
  },
  {
    key: '/food-drink',
    label: <Link to='/food-drink'>Đồ ăn và nước uống</Link>,
    icon: <CoffeeOutlined />,
  },
  {
    key: '/promotions',
    label: <Link to='/promotions'>Khuyến mãi</Link>,
    icon: <PercentageOutlined />,
  },
  {
    key: '/settings',
    label: <Link to='/settings'>Cài đặt</Link>,
    icon: <SettingOutlined />,
    requireRole: ['ADMIN'], // Chỉ tài khoản ADMIN mới nhìn thấy mục Cài đặt này
  },
  {
    key: '/staff-scan',
    label: <Link to='/staff-scan'>Soát vé</Link>,
    icon: <ScanOutlined />,
    requireRole: ['ADMIN', 'STAFF'], // Cả ADMIN và STAFF đều có thể soát vé
  },
];

export const filterMenuByRole = (
  items: AdminMenuItem[],
  role: 'ADMIN' | 'USER' | 'STAFF' | undefined,
): MenuProps['items'] =>
  items
    .filter((i) => !i.requireRole || (role && i.requireRole.includes(role)))
    .map((i) => ({
      key: i.key,
      label: i.label,
      icon: i.icon,
      children: i.children ? filterMenuByRole(i.children, role) : undefined,
    }));