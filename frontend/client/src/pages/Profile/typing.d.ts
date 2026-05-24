// Định nghĩa kiểu dữ liệu cho người dùng
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  joinDate: string;
  rank: string;
  isVerified: boolean;
}

// Định nghĩa Props cho thanh Sidebar
export interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  user: UserProfile;
}

// Định nghĩa Props cho Form tài khoản
export interface AccountFormProps {
  user: UserProfile;
}