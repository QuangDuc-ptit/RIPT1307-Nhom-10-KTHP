# 05 — Antd 5 và Forms

## 1. ConfigProvider

Đặt ở root để cấu hình locale (vi-VN), theme:

```tsx
<ConfigProvider locale={viVN} theme={antdTheme}>
  <App />
</ConfigProvider>
```

Khi cần dùng `message`/`notification`/`Modal` mà muốn ăn theme + context React, bọc `<App>` của Antd:

```tsx
import { App as AntdApp } from 'antd';
// trong component:
const { message } = AntdApp.useApp();
message.success('ok');
```

**Đừng dùng `import { message } from 'antd'`** vì lỗi không lấy được theme/context. Luôn qua `AntdApp.useApp()`.

## 2. Form + validation (chuẩn nhất Antd)

```tsx
const [form] = Form.useForm();

<Form form={form} layout='vertical' onFinish={onSubmit}>
  <Form.Item
    name='email'
    label='Email'
    rules={[
      { required: true, message: 'Vui lòng nhập' },
      { type: 'email', message: 'Email không hợp lệ' },
    ]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name='confirmPwd'
    dependencies={['pwd']}
    rules={[
      ({ getFieldValue }) => ({
        validator(_, v) {
          if (!v || v === getFieldValue('pwd')) return Promise.resolve();
          return Promise.reject('Không khớp');
        },
      }),
    ]}
  >
    <Input.Password />
  </Form.Item>
</Form>
```

API hay dùng:
- `form.setFieldsValue({ ... })` — set giá trị
- `form.resetFields()` — reset
- `form.validateFields()` — trigger validate, trả promise
- `form.getFieldValue('name')` — đọc giá trị

## 3. Table — pattern chuẩn

Đọc `frontend/admin/src/pages/users/UsersPage.tsx` để xem mẫu đầy đủ. Tóm tắt:

```tsx
<Table
  rowKey='id'
  loading={loading}
  columns={columns}
  dataSource={data?.items || []}
  pagination={{
    current: page,
    pageSize,
    total: data?.total || 0,
    showSizeChanger: true,
    onChange: (p, ps) => { setPage(p); setPageSize(ps); },
  }}
  scroll={{ x: 700 }}
/>
```

- `rowKey` BẮT BUỘC (dùng id từ backend).
- Pagination **server-side**: KHÔNG để Antd phân trang trên client (chỉ ổn khi data nhỏ).
- `scroll.x` để bảng có thể scroll ngang khi nhỏ màn.

## 4. Modal Create/Edit dùng chung

Pattern:
- `editing: T | null` — null = create, có giá trị = edit
- Khi mở: `if (editing) form.setFieldsValue(editing); else form.resetFields();`
- Khi submit: `if (editing) api.update(id, values); else api.create(values);`

Lợi: 1 modal cho cả 2 case → ít code hơn.

## 5. Popconfirm xoá

```tsx
<Popconfirm
  title='Xoá?'
  description='Không thể hoàn tác.'
  okText='Xoá'
  cancelText='Huỷ'
  okButtonProps={{ danger: true }}
  onConfirm={() => handleDelete(id)}
>
  <Button danger icon={<DeleteOutlined />}>Xoá</Button>
</Popconfirm>
```

→ Bao giờ cũng xác nhận trước khi xoá vĩnh viễn.

## 6. Date với dayjs

Antd 5 dùng dayjs (không phải moment như Antd 4). Phải import locale Việt:
```ts
import 'dayjs/locale/vi';
```

Format:
```ts
dayjs(post.createdAt).format('DD/MM/YYYY HH:mm');
```

## 7. Theme tokens

Sửa primary color, border-radius ở `config/theme.ts`:
```ts
export const antdTheme = {
  token: { colorPrimary: '#1677ff', borderRadius: 8 },
  components: { Button: { controlHeight: 38 } },
};
```

→ Toàn app áp dụng ngay.
