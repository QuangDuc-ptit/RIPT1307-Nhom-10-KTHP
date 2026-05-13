import { useEffect, useState } from 'react';
import { Form, Input, Modal, Switch, App as AntdApp } from 'antd';
import { postApi, type CreatePostPayload } from '@/api/post';
import type { Post } from '@/types';

interface Props {
  open: boolean;
  editing: Post | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PostFormModal({ open, editing, onClose, onSuccess }: Props) {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm<CreatePostPayload>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue({
          title: editing.title,
          content: editing.content,
          excerpt: editing.excerpt,
          coverImage: editing.coverImage || '',
          published: editing.published,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editing, form]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      if (editing) {
        await postApi.update(editing.id, values);
        message.success('Cập nhật thành công');
      } else {
        await postApi.create(values);
        message.success('Tạo mới thành công');
      }
      onSuccess();
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={editing ? 'Sửa bài viết' : 'Thêm bài viết'}
      open={open}
      onCancel={onClose}
      onOk={onOk}
      confirmLoading={submitting}
      okText='Lưu'
      cancelText='Huỷ'
      width={720}
      destroyOnClose
    >
      <Form form={form} layout='vertical' preserve={false}>
        <Form.Item
          name='title'
          label='Tiêu đề'
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='excerpt' label='Mô tả ngắn'>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name='coverImage' label='Ảnh bìa (URL)'>
          <Input placeholder='https://...' />
        </Form.Item>
        <Form.Item
          name='content'
          label='Nội dung'
          rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
        >
          <Input.TextArea rows={8} />
        </Form.Item>
        <Form.Item name='published' label='Xuất bản' valuePropName='checked'>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
