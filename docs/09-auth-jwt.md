# 09 — Authentication với JWT

## 1. Tổng quan luồng đăng nhập

```
1. User nhập email + password trên FE
2. FE gọi POST /api/auth/login
3. BE: tìm user theo email
4. BE: so sánh password (bcrypt.compare)
5. BE: tạo accessToken + refreshToken (JWT)
6. BE: lưu refreshToken vào DB (bảng RefreshToken)
7. BE: trả { user, accessToken, refreshToken }
8. FE: lưu 2 token vào localStorage
9. FE: gắn accessToken vào mọi request
```

## 2. Hash password với bcrypt

**KHÔNG BAO GIỜ** lưu password plaintext. Dùng bcrypt:

```ts
import bcrypt from 'bcryptjs';

// Khi tạo user
const passwordHash = await bcrypt.hash(plainPassword, 10);
// Lưu passwordHash vào DB

// Khi login
const isMatch = await bcrypt.compare(input.password, user.passwordHash);
```

Tham số `10` là "cost" — số lần lặp hash. Càng cao càng an toàn, càng chậm. 10-12 là cân bằng OK năm 2025.

→ Nếu DB bị lộ, attacker không thể đảo ngược ra password gốc (cost bcrypt làm brute force chậm khủng khiếp).

## 3. JWT — cấu trúc

JWT là chuỗi 3 phần phân cách bởi dấu `.`:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ4eHgiLCJyb2xlIjoiQURNSU4iLCJleHAiOjE2OTk5OTk5OTl9.signature
```

- **Header**: thuật toán (HS256)
- **Payload**: data (sub = user id, role, exp)
- **Signature**: HMAC SHA256 của (header + payload) với SECRET

→ Đổi 1 ký tự trong payload → signature không khớp → token invalid.

**KHÔNG nên** đặt password, email, hay info nhạy cảm trong payload — JWT chỉ encode chứ không encrypt (base64 mở ra ai cũng đọc được).

## 4. Access vs Refresh token

| | Access | Refresh |
| --- | --- | --- |
| Thời hạn | Ngắn (15 phút) | Dài (7-30 ngày) |
| Dùng cho | Mọi request | Chỉ gọi `/auth/refresh` |
| Lưu DB | Không | Có (để revoke) |
| Lộ thì sao? | Tự hết sau 15 phút | Attacker giả mạo lâu → nguy hiểm hơn |

Vì sao tách 2 token?
- Nếu chỉ có 1 token dài hạn → lộ là nguy.
- Nếu chỉ có 1 token ngắn → user phải đăng nhập lại 15 phút/lần.
- 2 token: access ngắn cho an toàn, refresh để gia hạn mượt.

## 5. Refresh token rotation

Pattern: mỗi lần refresh, **cấp lại refresh token MỚI**, revoke cũ.

```ts
// auth.service.ts (đã làm sẵn)
await prisma.refreshToken.update({
  where: { id: stored.id },
  data: { revokedAt: new Date() },
});
return issueTokens(payload.sub, payload.role);
```

Lý do: nếu attacker đánh cắp refresh token cũ và user vẫn dùng → khi user refresh, attacker bị "đẩy ra" vì token cũ đã revoke.

## 6. Middleware bảo vệ

```ts
// middlewares/auth.ts
export const requireAuth = (req, _res, next) => {
  const token = req.headers.authorization?.slice('Bearer '.length);
  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch {
    next(unauthorized());
  }
};

export const requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) return next(forbidden());
  next();
};
```

Dùng:
```ts
router.get('/posts', requireAuth, controller.list);
router.delete('/admin/users/:id', requireAuth, requireRole('ADMIN'), controller.delete);
```

## 7. Logout

Cách 1 (đơn giản): FE xoá localStorage. Token vẫn valid cho đến hết hạn → kém an toàn.

Cách 2 (an toàn, base này dùng): gọi `/auth/logout` → BE revoke refresh token trong DB.
- Sau đó access token cũ vẫn dùng được tới khi hết hạn (15 phút).
- Khi access hết hạn, FE thử refresh → fail vì refresh đã revoke → đẩy về login.

Cách 3 (cực an toàn, phức tạp): blacklist access token (lưu jti vào Redis). Chỉ làm khi yêu cầu cao.

## 8. Sai lầm hay gặp

- Lưu password plaintext → **lỗi nghiêm trọng**
- Đặt password/email trong JWT payload → ai đó copy token là biết info
- JWT secret quá ngắn (< 32 ký tự) → có thể brute force
- Cùng 1 secret cho dev và prod → lộ secret dev là lộ prod
- Không có thời hạn (exp) cho access token → token sống mãi
- Trả về password hash trong API → dù hash khó đảo, vẫn không nên lộ

## 9. Tăng cường

- **Rate limit** `/auth/login` (5 lần / phút / IP) → chống brute force
- **CAPTCHA** sau 3 lần fail
- **Email verification** (gửi link xác minh trước khi cho dùng)
- **2FA** (TOTP — Google Authenticator)
- **Detect new device login** → gửi email cảnh báo

## 10. OAuth / Social login

Base này dùng email+password. Khi cần Google/Facebook login:
- Thư viện: `passport` + `passport-google-oauth20`
- Hoặc OIDC qua Keycloak (như base-web-umi)
- Hoặc dịch vụ: Auth0, Clerk, Supabase Auth, Firebase Auth

→ Khi dự án nhỏ, dùng email+password đơn giản hơn. Khi cần social, thêm vào sau (chỉ thêm 1 module mới).
