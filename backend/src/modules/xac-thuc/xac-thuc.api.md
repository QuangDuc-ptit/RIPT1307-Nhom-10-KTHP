# Spec API — Xác thực (social login & quên mật khẩu)

Tệp này mô tả các endpoint mới cần triển khai cho social login (đăng nhập qua provider như Google) và chức năng quên mật khẩu.

1) POST /api/auth/social-login
- Mô tả: Xác thực token của provider (vd: Google idToken) ở phía server, tìm hoặc tạo user, trả access + refresh token.
- Body:
  - `provider`: string — tên provider, ví dụ `google` (required)
  - `idToken`: string — token/ID token do provider cung cấp (required)
- Response 200:
  - `{ user: { id, email, name, role, avatar, createdAt }, accessToken, refreshToken }`
- Lỗi:
  - 400: input không hợp lệ
  - 401: token provider không hợp lệ

2) POST /api/auth/quen-mat-khau
- Mô tả: Gửi email chứa link đặt lại mật khẩu. Server tạo `resetToken` (JWT ngắn hạn hoặc record DB) và gửi email.
- Body:
  - `email`: string
- Response 204 No Content (không tiết lộ xem email tồn tại hay không để tránh lộ thông tin)
- Lỗi:
  - 400: input không hợp lệ

3) POST /api/auth/dat-lai-mat-khau
- Mô tả: Người dùng đặt lại mật khẩu bằng `resetToken`.
- Body:
  - `token`: string
  - `newPassword`: string (min 6)
- Response 204 No Content
- Hành vi:
  - Verify `token` (JWT secret hoặc lookup DB)
  - Nếu hợp lệ, cập nhật `user.passwordHash`, và revoke tüm refresh tokens của user
  - Nếu token không hợp lệ hoặc hết hạn -> 400/401

Validation schemas
- `quenMatKhauSchema`: `{ email: z.string().email() }`
- `datLaiMatKhauSchema`: `{ token: z.string().min(1), newPassword: z.string().min(6).max(72) }`
- `socialLoginSchema`: `{ provider: z.string(), idToken: z.string().min(1) }`

Implementation notes
- Dùng `firebase-admin` để verify Google `idToken` (nếu provider = 'google').
- Gửi email bằng `nodemailer` (reuse config dự án). Tạo template link: `${FRONTEND_URL}/auth/reset-password?token=${resetToken}`
- Lưu `resetToken` có thể dưới dạng JWT với secret `JWT_RESET_SECRET` và expiry ngắn (ví dụ 1h) hoặc lưu table `passwordReset` trong DB.
- Sau đổi mật khẩu, revoke refresh tokens (cập nhật `refreshToken.revokedAt`).
