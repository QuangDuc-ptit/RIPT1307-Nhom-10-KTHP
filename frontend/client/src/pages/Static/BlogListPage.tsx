import { useEffect, useState } from 'react';
import { Card, Col, Empty, Input, Pagination, Row, Skeleton, Tag, Typography } from 'antd';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { postApi } from '@/api/post';
import type { Paginated, Post } from '@/types';

const { Title, Paragraph } = Typography;
const PAGE_SIZE = 9;

/**
 * Trang danh sách blog — minh hoạ:
 *  - gọi API có phân trang
 *  - search debounce thô bằng setTimeout
 *  - skeleton khi loading
 *  - empty state
 */
export default function BlogListPage() {
  const [data, setData] = useState<Paginated<Post> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(() => {
      postApi
        .list({ page, pageSize: PAGE_SIZE, search })
        .then((d) => {
          if (!cancelled) setData(d);
        })
        .catch(() => {
          if (!cancelled) setData({ items: [], total: 0, page: 1, pageSize: PAGE_SIZE });
        })
        .finally(() => !cancelled && setLoading(false));
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [page, search]);

  return (
    <>
      <Helmet>
        <title>Blog</title>
      </Helmet>

      <Title>Blog</Title>
      <Paragraph type='secondary'>Bài viết mới nhất từ chúng tôi.</Paragraph>

      <Input.Search
        placeholder='Tìm bài viết...'
        size='large'
        allowClear
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{ maxWidth: 480, marginBottom: 24 }}
      />

      {loading ? (
        <Row gutter={[24, 24]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} lg={8}>
              <Card>
                <Skeleton active />
              </Card>
            </Col>
          ))}
        </Row>
      ) : data && data.items.length > 0 ? (
        <>
          <Row gutter={[24, 24]}>
            {data.items.map((p) => (
              <Col key={p.id} xs={24} sm={12} lg={8}>
                <Link to={`/blog/${p.slug}`}>
                  <Card
                    hoverable
                    cover={
                      p.coverImage ? (
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          style={{ height: 180, objectFit: 'cover' }}
                        />
                      ) : undefined
                    }
                  >
                    <Card.Meta
                      title={p.title}
                      description={
                        <>
                          <Tag>{dayjs(p.createdAt).format('DD/MM/YYYY')}</Tag>
                          <div style={{ marginTop: 8, color: '#666' }}>{p.excerpt}</div>
                        </>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={data.total}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty description='Chưa có bài viết nào' style={{ padding: 60 }} />
      )}
    </>
  );
}
