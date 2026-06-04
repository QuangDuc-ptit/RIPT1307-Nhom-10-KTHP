import React from 'react';
import { Avatar, Button, Form, Input, Tag } from 'antd';
import { IdcardOutlined, KeyOutlined } from '@ant-design/icons';
import { AccountFormProps } from '../typing';

const { TextArea } = Input;

const AccountForm: React.FC<AccountFormProps> = ({ user }) => {
  const colors = { bgCard: '#1d171a', bgInput: '#2a1e23', border: '#3b2a31', primary: '#e42755', textDim: '#a3989c', textMain: '#ffffff' };

  const cardStyle = { backgroundColor: colors.bgCard, borderRadius: '16px', padding: '24px', marginBottom: '24px', border: `1px solid ${colors.border}` };
  const inputStyle = { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain, height: '45px', borderRadius: '8px' };

  return (
    <div style={{ maxWidth: '800px', width: '100%' }}>
      {/* Khối 1: Header Profile */}
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Avatar size={80} style={{ backgroundColor: '#fcdfd5' }} />
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>{user.firstName} {user.lastName}</h2>
            <p style={{ margin: '0 0 10px 0', color: colors.textDim }}>Thành viên từ {user.joinDate}</p>
            <div>
              {user.isVerified && <Tag style={{ backgroundColor: 'rgba(228, 39, 85, 0.2)', color: colors.primary, border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>ĐÃ XÁC MINH</Tag>}
              <Tag style={{ backgroundColor: '#3b4358', color: '#a0aabf', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>KHÁCH</Tag>
            </div>
          </div>
        </div>
        <Button type="primary" style={{ backgroundColor: colors.primary, border: 'none', borderRadius: '30px', fontWeight: 'bold', padding: '0 20px', height: '40px' }}>
          Đổi ảnh đại diện
        </Button>
      </div>

      {/* Khối 2: Thông tin cá nhân */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
          <IdcardOutlined style={{ color: colors.primary }} /> Thông tin cá nhân
        </div>
        <Form layout="vertical">
          <div style={{ display: 'flex', gap: '20px' }}>
            <Form.Item label={<span style={{ color: colors.textDim }}>Tên</span>} style={{ flex: 1 }}>
              <Input defaultValue={user.firstName} style={inputStyle} />
            </Form.Item>
            <Form.Item label={<span style={{ color: colors.textDim }}>Họ</span>} style={{ flex: 1 }}>
              <Input defaultValue={user.lastName} style={inputStyle} />
            </Form.Item>
          </div>
          <Form.Item label={<span style={{ color: colors.textDim }}>Địa chỉ email</span>}>
            <Input defaultValue={user.email} style={inputStyle} />
          </Form.Item>
          <Form.Item label={<span style={{ color: colors.textDim }}>Giới thiệu</span>}>
            <TextArea defaultValue={user.bio} rows={4} style={{ ...inputStyle, height: 'auto', paddingTop: '10px' }} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" style={{ backgroundColor: colors.primary, border: 'none', borderRadius: '30px', fontWeight: 'bold', padding: '0 24px', height: '40px' }}>
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </div>

      {/* --- BỔ SUNG: Khối 3: Cài đặt bảo mật --- */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
          <KeyOutlined style={{ color: colors.primary }} /> Cài đặt bảo mật
        </div>
        <Form layout="vertical">
          <div style={{ display: 'flex', gap: '20px' }}>
            <Form.Item label={<span style={{ color: colors.textDim }}>Mật khẩu hiện tại</span>} style={{ flex: 1 }}>
              <Input.Password value="12345678" style={inputStyle} />
            </Form.Item>
            <Form.Item label={<span style={{ color: colors.textDim }}>Mật khẩu mới</span>} style={{ flex: 1 }}>
              <Input.Password value="12345678" style={inputStyle} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ color: colors.textDim, fontSize: '13px' }}>Lần thay đổi gần nhất: 3 tháng trước</span>
            <Button style={{ backgroundColor: '#344054', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', padding: '0 24px', height: '40px' }}>
              Cập nhật
            </Button>
          </div>
        </Form>
      </div>

      {/* Khối 4: Khu vực nguy hiểm */}
      <div style={{ ...cardStyle, backgroundColor: '#2a161c', borderColor: '#4a202b' }}>
        <h3 style={{ color: colors.primary, fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Khu vực nguy hiểm</h3>
        <p style={{ color: colors.textDim, marginBottom: '20px' }}>
          Việc xóa tài khoản sẽ xóa vĩnh viễn toàn bộ dữ liệu. Hành động này không thể hoàn tác.
        </p>
        <Button danger ghost style={{ borderRadius: '30px', borderColor: colors.primary, color: colors.primary, fontWeight: 'bold', height: '40px', padding: '0 24px' }}>
          Xóa tài khoản
        </Button>
      </div>
    </div>
  );
};

export default AccountForm;