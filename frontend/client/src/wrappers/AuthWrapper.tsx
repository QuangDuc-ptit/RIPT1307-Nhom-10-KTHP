import { history } from 'umi';
import { Spin } from 'antd';
import { useAuthStore } from '@/store/auth';

/**
 * Wrapper bảo vệ route cho UmiJS.
 * - Nếu chưa load xong, hiện spinner.
 * - Nếu chưa đăng nhập, redirect về /auth/login (lưu lại đường dẫn hiện tại để quay lại sau).
 */
export default function AuthWrapper(props: any) {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const loading = useAuthStore((s) => s.loading);

  if (!initialized || loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    // Lưu lại đường dẫn hiện tại để sau khi login có thể quay lại
    const currentPath = window.location.pathname;
    history.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
    return null;
  }

  return <div>{props.children}</div>;
}