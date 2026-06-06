import React, { useEffect, useState } from 'react';
import { Avatar, Button, Form, Input, Tag, message, Upload, Modal } from 'antd';
import { IdcardOutlined, KeyOutlined, UploadOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';

// Import Store để cập nhật dữ liệu ảnh ra ngoài ngay lập tức
import { useAuthStore } from '@/store/auth';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  joinDate: string;
  isVerified: boolean;
  avatar?: string; 
}

interface AccountFormProps {
  user: UserProfile;
}

const { TextArea } = Input;
const { confirm } = Modal;

const AccountForm: React.FC<AccountFormProps> = ({ user }) => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>((user as any).avatar);
  const [isSaving, setIsSaving] = useState(false);

  const watchFirstName = Form.useWatch('firstName', profileForm);
  const watchLastName = Form.useWatch('lastName', profileForm);

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
      });
      setAvatarUrl((user as any).avatar);
    }
  }, [user, profileForm]);

  const colors = { bgCard: '#1d171a', bgInput: '#2a1e23', border: '#3b2a31', primary: '#e42755', textDim: '#a3989c', textMain: '#ffffff' };
  const cardStyle: React.CSSProperties = { backgroundColor: colors.bgCard, borderRadius: '16px', padding: '24px', marginBottom: '24px', border: `1px solid ${colors.border}`, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' };
  const inputStyle = { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain, height: '45px', borderRadius: '8px' };

  // 🚀 CÁCH 1: Cập nhật ảnh đại diện thẳng vào Store tổng khi vừa chọn file
  const handleBeforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target?.result as string;
      
      // Đổi ở giao diện hiện tại
      setAvatarUrl(base64Image);
      
      // Đổi ở kho lưu trữ tổng Zustand để các tab khác không làm mất ảnh
      useAuthStore.setState((prev: any) => ({
        user: {
          ...prev.user,
          avatar: base64Image
        }
      }));
      
      message.success('Đã cập nhật ảnh đại diện hệ thống!');
    };
    reader.readAsDataURL(file);
    return false; 
  };

  const handleSaveProfile = (values: any) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      message.success('Cập nhật thông tin hồ sơ thành công!');
      useAuthStore.setState((prev: any) => ({
        user: {
          ...prev.user,
          firstName: values.firstName,
          lastName: values.lastName,
          bio: values.bio,
        }
      }));
    }, 1000);
  };

  const handleUpdatePassword = (values: any) => {
    message.success('Đổi mật khẩu thành công! (Test UI)');
    passwordForm.resetFields();
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa tài khoản này?',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: 'Toàn bộ dữ liệu của bạn sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc chắn không?',
      okText: 'Có, xóa vĩnh viễn',
      okType: 'danger',
      cancelText: 'Hủy bỏ',
      centered: true,
      maskClosable: true,
      onOk() {
        const hide = message.loading('Đang xử lý xóa tài khoản...', 0);
        setTimeout(() => {
          hide();
          message.success('Tài khoản đã được xóa!');
        }, 1500);
      },
    });
  };

  if (!user) return <div style={{ color: 'white' }}>Đang tải dữ liệu...</div>;

  const displayFirstName = watchFirstName !== undefined ? watchFirstName : user.firstName;
  const displayLastName = watchLastName !== undefined ? watchLastName : user.lastName;

  return (
    <div style={{ maxWidth: '800px', width: '100%' }}>
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Avatar src={avatarUrl} size={80} style={{ backgroundColor: '#fcdfd5', color: '#e42755', fontSize: '30px', fontWeight: 'bold' }}>
            {!avatarUrl && (displayFirstName ? displayFirstName.charAt(0).toUpperCase() : 'U')}
          </Avatar>
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
              {displayFirstName} {displayLastName}
            </h2>
            <p style={{ margin: '0 0 10px 0', color: colors.textDim }}>Thành viên từ {user.joinDate}</p>
            <div>
              <Tag style={{ backgroundColor: '#3b4358', color: '#a0aabf', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>KHÁCH</Tag>
            </div>
          </div>
        </div>
        <Upload showUploadList={false} beforeUpload={handleBeforeUpload}>
          <Button icon={<UploadOutlined />} type="primary" style={{ backgroundColor: colors.primary, border: 'none', borderRadius: '30px', fontWeight: 'bold', padding: '0 20px', height: '40px' }}>
            Đổi ảnh đại diện
          </Button>
        </Upload>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>
          <IdcardOutlined style={{ color: colors.primary }} /> Thông tin cá nhân
        </div>
        <Form form={profileForm} layout="vertical" onFinish={handleSaveProfile}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Form.Item name="firstName" label={<span style={{ color: colors.textDim }}>Tên</span>} style={{ flex: 1 }}><Input style={inputStyle} /></Form.Item>
            <Form.Item name="lastName" label={<span style={{ color: colors.textDim }}>Họ</span>} style={{ flex: 1 }}><Input style={inputStyle} /></Form.Item>
          </div>
          <Form.Item name="email" label={<span style={{ color: colors.textDim }}>Địa chỉ email</span>}><Input disabled style={{ ...inputStyle, cursor: 'not-allowed', opacity: 0.7 }} /></Form.Item>
          <Form.Item name="bio" label={<span style={{ color: colors.textDim }}>Giới thiệu</span>}><TextArea rows={4} style={{ ...inputStyle, height: 'auto', paddingTop: '10px' }} /></Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button loading={isSaving} htmlType="submit" type="primary" style={{ backgroundColor: colors.primary, border: 'none', borderRadius: '30px', fontWeight: 'bold', padding: '0 24px', height: '40px' }}>Lưu thay đổi</Button>
          </div>
        </Form>
      </div>
      
      <div style={cardStyle}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>
          <KeyOutlined style={{ color: colors.primary }} /> Cài đặt bảo mật
        </div>
        <Form form={passwordForm} layout="vertical" onFinish={handleUpdatePassword}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Form.Item name="currentPassword" label={<span style={{ color: colors.textDim }}>Mật khẩu hiện tại</span>} style={{ flex: 1 }}><Input.Password style={inputStyle} /></Form.Item>
            <Form.Item name="newPassword" label={<span style={{ color: colors.textDim }}>Mật khẩu mới</span>} style={{ flex: 1 }}><Input.Password style={inputStyle} /></Form.Item>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button htmlType="submit" style={{ backgroundColor: '#344054', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', padding: '0 24px', height: '40px' }}>Cập nhật</Button>
          </div>
        </Form>
      </div>

      <div style={{ ...cardStyle, backgroundColor: '#2a161c', borderColor: '#4a202b' }}>
        <h3 style={{ color: colors.primary, fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Khu vực nguy hiểm</h3>
        <p style={{ color: colors.textDim, marginBottom: '20px' }}>
          Việc xóa tài khoản sẽ xóa vĩnh viễn toàn bộ dữ liệu. Hành động này không thể hoàn tác.
        </p>
        <Button onClick={showDeleteConfirm} danger ghost style={{ borderRadius: '30px', borderColor: colors.primary, color: colors.primary, fontWeight: 'bold', height: '40px', padding: '0 24px' }}>
          Xóa tài khoản
        </Button>
      </div>
    </div>
  );
};

export default AccountForm;