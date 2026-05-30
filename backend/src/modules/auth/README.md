Endpoints for authentication (Vietnamese file naming):

- `POST /api/auth/social-login` — Login via provider (Google).
- `POST /api/auth/quen-mat-khau` — Request password reset (send email).
- `POST /api/auth/dat-lai-mat-khau` — Reset password with token.

Make sure to set env variables for SMTP if you want real emails:

```
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
FRONTEND_URL=http://localhost:5173
JWT_RESET_SECRET=... (>=32 chars)
```
