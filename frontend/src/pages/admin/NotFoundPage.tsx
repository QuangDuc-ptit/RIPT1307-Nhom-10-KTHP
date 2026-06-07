import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Result
      status='404'
      title='404'
      subTitle='Trang không tồn tại.'
      extra={
        <Link to='/dashboard'>
          <Button type='primary'>Về Dashboard</Button>
        </Link>
      }
    />
  );
}
