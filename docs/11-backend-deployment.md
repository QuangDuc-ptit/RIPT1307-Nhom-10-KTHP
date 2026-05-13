# 11 — Backend Deployment

## 1. Build

```bash
npm run build      # tsc -> dist/
NODE_ENV=production npm start
```

## 2. Biến môi trường production

**BẮT BUỘC** đổi:
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — random >= 32 ký tự (dùng `openssl rand -hex 32`)
- `DATABASE_URL` — tới DB production
- `CORS_ORIGINS` — domain FE thật

Không bao giờ:
- Commit `.env` vào git
- Dùng cùng secret cho dev & prod
- Để `NODE_ENV=development` trên prod

## 3. Migration trên production

```bash
# Trên server, sau khi pull code mới
npx prisma migrate deploy
```

KHÔNG dùng `migrate dev` trên prod (sẽ hỏi tương tác).

Nếu schema có breaking change (đổi tên column, xoá field) — phải lên kế hoạch:
1. Deploy code mới mà vẫn đọc cả 2 phiên bản
2. Migrate data
3. Deploy code chỉ đọc phiên bản mới
4. Xoá field cũ

## 4. Cách deploy

### 4.1. PM2 (đơn giản, VPS)

```bash
npm i -g pm2
pm2 start dist/server.js --name baseweb-api
pm2 startup    # tạo systemd để tự chạy khi reboot
pm2 save
pm2 logs       # xem log
```

PM2 sẽ auto restart khi process crash.

### 4.2. Docker

`Dockerfile` đã có. Build:
```bash
docker build -t baseweb-backend .
docker run -d --name baseweb-api \
  -e DATABASE_URL=postgres://... \
  -e JWT_ACCESS_SECRET=... \
  -e JWT_REFRESH_SECRET=... \
  -p 4000:4000 \
  baseweb-backend
```

### 4.3. `docker-compose.yml` cho cả stack

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: baseweb
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgres://postgres:${DB_PASSWORD}@postgres:5432/baseweb
      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      CORS_ORIGINS: ${CORS_ORIGINS}
    depends_on:
      - postgres
    ports: ["4000:4000"]
    restart: unless-stopped

volumes:
  postgres_data:
```

### 4.4. Render / Railway / Fly.io

Hosting "Node + Postgres" sẵn: chỉ cần connect repo, set env, tự deploy. Phù hợp dự án nhỏ.

## 5. Nginx reverse proxy

```nginx
server {
  listen 443 ssl;
  server_name api.example.com;
  ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

  location / {
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
  }
}
```

→ Node lắng trên `localhost:4000`, Nginx terminate HTTPS + forward.

## 6. Healthcheck

Endpoint `/api/health` đã có. Dùng cho:
- Load balancer (kiểm tra app còn sống)
- Docker `HEALTHCHECK`
- Monitor (UptimeRobot, Pingdom)

## 7. Logging trong production

- Không dùng `console.log` (không có level, log lẫn lộn).
- Dùng `pino`:
  ```ts
  const logger = pino({ level: 'info' });
  logger.info({ userId, action: 'login' }, 'user logged in');
  ```
- Output JSON → đẩy vào ELK / Loki / Datadog.

## 8. Monitoring

- **Sentry**: bắt lỗi runtime, alert ngay
- **Prometheus + Grafana**: metrics (RPS, latency, error rate)
- **Healthcheck endpoint** + UptimeRobot

## 9. Backup database

```bash
# Backup hàng ngày qua cron
pg_dump $DATABASE_URL > /backups/baseweb-$(date +%F).sql

# Upload S3
aws s3 cp /backups/baseweb-$(date +%F).sql s3://your-bucket/
```

→ Test restore định kỳ. Backup không restore được = không có backup.

## 10. Pre-deploy checklist

- [ ] `NODE_ENV=production`
- [ ] JWT secrets random, đủ dài
- [ ] `CORS_ORIGINS` chỉ chứa domain hợp lệ
- [ ] `npx prisma migrate deploy` đã chạy
- [ ] HTTPS (TLS) đã bật
- [ ] Rate limit cho `/auth/login` (cần thêm `express-rate-limit`)
- [ ] Helmet middleware đã bật (đã có sẵn)
- [ ] Log không in secret/token
- [ ] Backup DB đã setup
- [ ] Healthcheck OK
- [ ] PM2/Docker restart policy = always
