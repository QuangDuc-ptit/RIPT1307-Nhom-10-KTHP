# 06 — Frontend Deployment

## 1. Build

```bash
npm run build      # tạo dist/
npm run preview    # preview build cục bộ
```

`dist/` chỉ là static file → có thể serve bằng Nginx, Caddy, Vercel, Netlify, S3+CloudFront.

## 2. Biến môi trường

- Dev: `.env` (KHÔNG commit)
- Production: tuỳ host
  - Vercel/Netlify: cấu hình trong dashboard
  - Server tự: dùng `.env.production` rồi `cross-env` khi build, hoặc inject lúc deploy

⚠️ Vite **inline biến `VITE_*` lúc build** → khác Node.js. Nghĩa là build 1 lần thì các biến đã "đông cứng". Phải build lại nếu đổi biến.

## 3. Deploy Vercel (đơn giản nhất)

```bash
npm i -g vercel
vercel        # lần đầu
vercel --prod # deploy prod
```

`vercel.json` (tuỳ chọn, để có rewrite SPA):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

(Đây là rewrite cho SPA: mọi URL đều trả `index.html`, để React Router tự handle.)

## 4. Deploy Nginx (VPS)

```nginx
server {
  listen 80;
  server_name yourdomain.com;
  root /var/www/client;
  index index.html;

  location / {
    try_files $uri /index.html;   # SPA fallback
  }

  # cache static asset
  location ~* \.(js|css|png|jpg|svg|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000, immutable";
  }
}
```

Build local, scp / rsync lên server:
```bash
npm run build
rsync -avzh --delete dist/ user@server:/var/www/client/
```

## 5. Deploy Docker (cho cả 2 app)

`Dockerfile` cho mỗi app (client/admin):

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

Thêm `nginx.conf` (cùng nội dung mục 4).

## 6. Domain & subdomain

Chia thường:
- `https://example.com` → client
- `https://admin.example.com` → admin
- `https://api.example.com` → backend

→ Mỗi cái 1 deployment riêng. Tránh chung 1 domain để bảo mật (cookie scope, CSP).

## 7. HTTPS

Bắt buộc cho production. Cách miễn phí:
- Vercel/Netlify: tự cấp SSL
- VPS: Let's Encrypt qua `certbot` hoặc dùng Caddy (auto HTTPS).

## 8. Pre-deploy checklist

- [ ] Build không có lỗi (`npm run build`)
- [ ] Build không có warning lớn (chunk > 1MB chẳng hạn)
- [ ] `VITE_API_BASE_URL` trỏ đúng production API
- [ ] Console không log secret
- [ ] Đã test trên Chrome + Firefox + Safari + mobile
- [ ] Lighthouse audit > 80 (Performance, Accessibility)
- [ ] Sourcemap KHÔNG public (set `build.sourcemap: false` hoặc upload riêng cho Sentry)
