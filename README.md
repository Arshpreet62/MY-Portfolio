# Portfolio

A Next.js portfolio site with a bold, minimal layout and Tailwind CSS styling.

## Development

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm run start`
- Run lint: `npm run lint`

## Notes

Replace the placeholder copy and contact details with your own.

## Contact Form

The contact form posts to `/api/mail` and sends email via Nodemailer.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

**For Gmail (recommended):**

- `GMAIL_USER` - Your Gmail address
- `GMAIL_APP_PASSWORD` - [Gmail App Password](https://support.google.com/accounts/answer/185833)

**For other SMTP providers:**

- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP port (default: 587)
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `MAIL_FROM` - Sender email address
- `MAIL_TO` - Recipient email address

### Rate Limiting

The API includes a simple in-memory rate limit (10 submissions per day per email + IP).

**Note for Vercel/Serverless:** The limit resets when the function cold-starts. For production deployments with strict rate limiting, consider using Vercel KV or Redis.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Project Settings → Environment Variables
4. Deploy
5. Add your custom domain in Project Settings → Domains

### Security

- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) are configured in `next.config.js`
- Gmail App Password should be rotated if exposed
- Never commit `.env.local` to version control
