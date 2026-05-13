import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, Button, Result, Skeleton, Space, Typography } from 'antd';
import { Helmet } from 'react-helmet-async';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { postApi } from '@/api/post';
import type { Post } from '@/types';

const { Title, Paragraph } = Typography;

export default function BlogDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    postApi
      .bySlug(slug)
      .then(setPost)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (error || !post) {
    return (
      <Result
        status='404'
        title='Không tìm thấy bài viết'
        subTitle={error}
        extra={
          <Link to='/blog'>
            <Button type='primary'>Về danh sách</Button>
          </Link>
        }
      />
    );
  }

  return (
    <article style={{ maxWidth: 800, margin: '0 auto' }}>
      <Helmet>
        <title>{post.title}</title>
        <meta name='description' content={post.excerpt} />
      </Helmet>

      <Link to='/blog'>
        <Button icon={<ArrowLeftOutlined />} type='link' style={{ paddingLeft: 0 }}>
          Quay lại
        </Button>
      </Link>

      <Title>{post.title}</Title>
      <Space style={{ marginBottom: 24 }}>
        <Avatar src={post.author?.avatar || undefined} icon={<UserOutlined />} />
        <span>{post.author?.name}</span>
        <span style={{ color: '#999' }}>·</span>
        <span style={{ color: '#999' }}>{dayjs(post.createdAt).format('DD/MM/YYYY HH:mm')}</span>
      </Space>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          style={{ width: '100%', borderRadius: 12, marginBottom: 24 }}
        />
      )}

      <Paragraph style={{ fontSize: 16, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
        {post.content}
      </Paragraph>
    </article>
  );
}
