import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const DAILY_LIMIT = 10;
const rateLimit = new Map<string, { count: number; day: string }>();

const getDayKey = () => new Date().toISOString().slice(0, 10);

const getClientIp = (request: NextRequest) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
};

const isRateLimited = (key: string) => {
  const day = getDayKey();
  const existing = rateLimit.get(key);

  if (!existing || existing.day !== day) {
    rateLimit.set(key, { count: 1, day });
    return false;
  }

  if (existing.count >= DAILY_LIMIT) {
    return true;
  }

  existing.count += 1;
  rateLimit.set(key, existing);
  return false;
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 },
    );
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const interest = String(body.interest || "").trim();
  const company = String(body.company || "").trim();
  const budget = String(body.budget || "").trim();
  const timeline = String(body.timeline || "").trim();
  const contact = String(body.contact || "").trim();
  const phone = String(body.phone || "").trim();

  if (!name || !email || !message || !interest) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const clientIp = getClientIp(request);
  const rateKey = `${email.toLowerCase()}|${clientIp}`;
  if (isRateLimited(rateKey)) {
    return NextResponse.json(
      { error: "Daily message limit reached. Please try again tomorrow." },
      { status: 429 },
    );
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    MAIL_TO,
    MAIL_FROM,
    GMAIL_APP_PASSWORD,
    GMAIL_USER,
  } = process.env;

  const smtpUser = SMTP_USER || GMAIL_USER;
  const smtpPass = SMTP_PASS || GMAIL_APP_PASSWORD;
  const smtpHost =
    SMTP_HOST || (smtpUser && smtpPass ? "smtp.gmail.com" : undefined);
  const mailFrom = MAIL_FROM || smtpUser;
  const mailTo = MAIL_TO || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !mailTo || !mailFrom) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  const port = Number(SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port,
    secure: port === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    interest ? `Interest: ${interest}` : null,
    budget ? `Budget: ${budget}` : null,
    timeline ? `Timeline: ${timeline}` : null,
    contact ? `Preferred contact: ${contact}` : null,
    phone ? `Phone: ${phone}` : null,
    "---",
    message,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      replyTo: email,
      subject: `Portfolio inquiry: ${interest || "New message"}`,
      text,
    });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
