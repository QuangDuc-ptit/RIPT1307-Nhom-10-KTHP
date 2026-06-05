import { Typography } from 'antd';
import { Helmet } from 'react-helmet-async';

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Về chúng tôi</title>
      </Helmet>
      <Title>Về chúng tôi</Title>
      <Paragraph>
        Đây là trang giới thiệu mẫu. Trong dự án thực, bạn có thể đặt thông tin
        công ty, sứ mệnh, đội ngũ, lịch sử phát triển, v.v.
      </Paragraph>
      <Paragraph>
        Mỗi trang public là một file trong <code>src/pages/public/</code> và đăng
        ký route ở <code>src/routes/index.tsx</code>.
      </Paragraph>
    </>
  );
}
