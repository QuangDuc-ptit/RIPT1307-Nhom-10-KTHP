import { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, App as AntdApp } from 'antd';
import { userApi, type CreateUserPayload } from '@/api/user';
import type { User } from '@/types';

interface Props {
  open: boolean;
  editing: User | null; // null = create, có giá trị = edit
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal dùng chung cho cả Create và Edit.
 * Đây là pattern hay dùng — tránh phải maintain 2 trang riêng cho thêm/sửa.
 */
export default function UserFormModal({ open, editing, onClose, onSuccess }: Props) {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm<CreateUserPayload>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue({
          email: editing.email,
          name: editing.name,
          role: editing.role,
          password: '', // không hiển thị password cũ
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
        await userApi.update(editing.id, {
          name: values.name,
          role: values.role,
          ...(values.password ? { password: values.password } : {}),
        });
        message.success('Cập nhật thành công');
      } else {
        await userApi.create(values);
        message.success('Tạo mới thành công');
      }
      onSuccess();
    } catch (e: any) {
      if (e?.errorFields) return; // form validate fail
      message.error(e?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={editing ? 'Sửa người dùng' : 'Thêm người dùng'}
      open={open}
      onCancel={onClose}
      onOk={onOk}
      confirmLoading={submitting}
      okText='Lưu'
      cancelText='Huỷ'
      destroyOnClose
    >
      <Form form={form} layout='vertical' preserve={false}>
        <Form.Item
          name='email'
          label='Email'
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input disabled={!!editing} />
        </Form.Item>
        <Form.Item
          name='name'
          label='Họ tên'
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='role'
          label='Vai trò'
          initialValue='USER'
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: 'USER', label: 'Người dùng' },
              { value: 'ADMIN', label: 'Quản trị' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name='password'
          label={editing ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'}
          rules={[
            ...(editing
              ? []
              : [{ required: true, message: 'Vui lòng nhập mật khẩu' } as any]),
            { min: 6, message: 'Tối thiểu 6 ký tự' },
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
}
