# Portfolio

> A modern, responsive portfolio website built with Next.js 16, featuring a clean design, functional contact form, and smooth animations.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://my-portfolio-nc41isu6k-arshpreet62s-projects.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

- 🎨 **Modern UI** - Clean, minimal design with smooth animations and gradient accents
- 📱 **Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- 📧 **Contact Form** - Functional email integration with Nodemailer
- 👀 **Visitor Counter** - Persistent total visitor count using MongoDB
- 🎭 **Dark Mode Ready** - Theme system with CSS variables
- ⚡ **Performance Optimized** - Built with Next.js 16 and Turbopack
- 🔒 **Security Headers** - Pre-configured security headers for production
- 📊 **Analytics Ready** - Vercel Analytics and Speed Insights integrated
- ♿ **Accessible** - Semantic HTML and ARIA labels

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (React 18, App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + CSS Variables
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Email:** [Nodemailer](https://nodemailer.com/)
- **Storage:** [MongoDB](https://www.mongodb.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics)
- **Deployment:** [Vercel](https://vercel.com/)

## 📸 Screenshots

> Add screenshots of your portfolio here

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Gmail account (for contact form) or SMTP credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your credentials (see [Environment Variables](#environment-variables) below)

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── mail/         # Email API route
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── contact.tsx       # Contact form section
│   │   ├── hero.tsx          # Hero section
│   │   ├── projects.tsx      # Projects showcase
│   │   └── tech-stack.tsx    # Tech stack section
│   └── lib/
│       └── utils.ts          # Utility functions
├── public/                   # Static assets
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## ⚙️ Environment Variables

The contact form requires SMTP credentials to send emails. Create a `.env.local` file in the root directory:

### Option 1: Gmail (Recommended for Testing)

```bash
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

📝 **How to get Gmail App Password:**

1. Go to [Google Account](https://myaccount.google.com/)
2. Security → 2-Step Verification (must be enabled)
3. App Passwords → Generate new password
4. Copy the 16-character password

### Option 2: Custom SMTP

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
MAIL_FROM=sender@example.com
MAIL_TO=recipient@example.com
```

### MongoDB (Visitor Counter)

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=portfolio
```

Create a MongoDB database (MongoDB Atlas or your own server), then copy these variables into `.env.local` for local testing and into your deployment environment settings for production.

### Rate Limiting

- **Development:** 10 submissions per day per email + IP
- **Production (Vercel):** Resets on function cold-start
- **Recommended:** Use Redis or another shared datastore for persistent cross-instance rate limiting

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/portfolio)

**Manual Deployment:**

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Framework: Next.js (auto-detected)

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add `GMAIL_USER` and `GMAIL_APP_PASSWORD`
   - Or use custom SMTP variables

4. **Deploy**
   - Click Deploy
   - Your site will be live at `your-project.vercel.app`

5. **Custom Domain (Optional)**
   - Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Deploy to Other Platforms

<details>
<summary>Netlify</summary>

```bash
npm run build
# Upload .next/ directory to Netlify
```

</details>

<details>
<summary>Railway</summary>

1. Connect GitHub repository
2. Add environment variables
3. Deploy
</details>

## 🔒 Security

This project includes:

- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- ✅ CSRF protection via Next.js
- ✅ Input validation and sanitization
- ✅ Rate limiting on contact form
- ✅ Email validation
- ✅ Environment variable encryption

**Important:**

- Never commit `.env.local` to version control
- Rotate API keys if exposed publicly
- Use strong passwords for production SMTP

## 🎨 Customization

### Update Content

1. **Personal Info:** Edit `src/components/hero.tsx`
2. **Projects:** Update `src/components/projects.tsx`
3. **Tech Stack:** Modify `src/components/tech-stack.tsx`
4. **Contact Form:** Customize `src/components/contact.tsx`

### Styling

- **Colors:** Edit CSS variables in `src/app/globals.css`
- **Fonts:** Change in `src/app/layout.tsx`
- **Theme:** Modify `tailwind.config.ts`

### Add New Sections

```tsx
// src/components/about.tsx
export function About() {
  return (
    <section id="about" className="py-24">
      {/* Your content */}
    </section>
  );
}
```

Then import in `src/app/page.tsx`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Your Name**

- Website: [https://my-portfolio-nc41isu6k-arshpreet62s-projects.vercel.app/](https://my-portfolio-nc41isu6k-arshpreet62s-projects.vercel.app/)
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vercel](https://vercel.com/) - Hosting platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

<div align="center">
  <p>Built with ❤️ using Next.js and Tailwind CSS</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
