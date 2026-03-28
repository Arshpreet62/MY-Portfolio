"use client";

import { track } from "@vercel/analytics";
import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  Clock3,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FormStatus = "idle" | "loading" | "success" | "error";
type FieldName = "name" | "email" | "interest" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type FormDraft = {
  name: string;
  email: string;
  interest: string;
  message: string;
  company: string;
  budget: string;
  timeline: string;
  phone: string;
};
const fieldOrder: FieldName[] = ["name", "email", "interest", "message"];

function suggestEmailDomain(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.includes("@")) return trimmed;
  if (/^[a-zA-Z0-9._%+-]+$/.test(trimmed)) {
    return `${trimmed}@gmail.com`;
  }
  return trimmed;
}

function getValue(payload: Record<string, FormDataEntryValue>, field: string) {
  const value = payload[field];
  return typeof value === "string" ? value.trim() : "";
}

function validateForm(
  payload: Record<string, FormDataEntryValue>,
): FieldErrors {
  const errors: FieldErrors = {};

  const name = getValue(payload, "name");
  const email = getValue(payload, "email");
  const interest = getValue(payload, "interest");
  const message = getValue(payload, "message");

  if (name.length < 2) {
    errors.name = "Please enter at least 2 characters for your name.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!interest) {
    errors.interest = "Please choose what you are interested in.";
  }

  if (message.length < 20) {
    errors.message = "Please add at least 20 characters in your message.";
  }

  return errors;
}

function focusFirstInvalidField(form: HTMLFormElement, errors: FieldErrors) {
  const firstInvalidField = fieldOrder.find((field) => Boolean(errors[field]));
  if (!firstInvalidField) return;

  const element = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    `[name="${firstInvalidField}"]`,
  );

  if (element) {
    element.focus();
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (firstInvalidField === "interest") {
    const selectTrigger = form.querySelector<HTMLButtonElement>(
      '[data-field="interest"]',
    );
    if (selectTrigger) {
      selectTrigger.focus();
      selectTrigger.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formDraft, setFormDraft] = useState<FormDraft>({
    name: "",
    email: "",
    interest: "",
    message: "",
    company: "",
    budget: "",
    timeline: "",
    phone: "",
  });

  const draftErrors = validateForm({
    name: formDraft.name,
    email: formDraft.email,
    interest: formDraft.interest,
    message: formDraft.message,
  });

  const isFormValid = Object.keys(draftErrors).length === 0;
  const missingFieldLabels: Record<FieldName, string> = {
    name: "Name",
    email: "Email",
    interest: "Interested in",
    message: "Message",
  };
  const missingFields = fieldOrder
    .filter((field) => Boolean(draftErrors[field]))
    .map((field) => missingFieldLabels[field]);

  const completionScore =
    (Number(formDraft.name.trim().length >= 2) +
      Number(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formDraft.email.trim())) +
      Number(Boolean(formDraft.interest)) +
      Number(formDraft.message.trim().length >= 20)) *
    25;

  const clearFieldError = (field: FieldName) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const payload: Record<string, FormDataEntryValue> = {
      name: formDraft.name,
      email: formDraft.email,
      interest: formDraft.interest,
      message: formDraft.message,
      company: formDraft.company,
      budget: formDraft.budget,
      timeline: formDraft.timeline,
      phone: formDraft.phone,
    };

    const validationErrors = validateForm(payload);
    if (Object.keys(validationErrors).length > 0) {
      focusFirstInvalidField(form, validationErrors);
      track("contact_validation_failed", {
        fields: Object.keys(validationErrors).join(","),
      });
      setFieldErrors(validationErrors);
      setStatus("error");
      setMessage("Please fix the highlighted fields and try again.");
      return;
    }

    setFieldErrors({});
    track("contact_submit_attempt", {
      interest: getValue(payload, "interest") || "unknown",
    });

    try {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        track("contact_submit_failed", {
          statusCode: response.status,
        });
        setStatus("error");
        setMessage(data?.error || "Something went wrong. Please try again.");
        return;
      }

      track("contact_submit_success", {
        interest: getValue(payload, "interest") || "unknown",
      });
      setStatus("success");
      setMessage("Thanks for reaching out. I will get back to you soon.");
      setFieldErrors({});
      setFormDraft({
        name: "",
        email: "",
        interest: "",
        message: "",
        company: "",
        budget: "",
        timeline: "",
        phone: "",
      });
    } catch {
      track("contact_submit_error", {
        type: "network_or_server",
      });
      setStatus("error");
      setMessage("Unable to send message right now. Please try again later.");
    }
  };

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden py-8 rounded-lg reveal-on-load reveal-delay-3 px-5 scroll-mt-24"
      aria-label="Contact"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-90">
        <div className="absolute -right-12 -top-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/20" />
        <div className="absolute -bottom-14 -left-10 h-72 w-72 rounded-full bg-lime-400/15 blur-3xl dark:bg-emerald-500/20" />
      </div>

      <div className="relative z-10 w-full">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-lg shadow-black/5 backdrop-blur md:p-7">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-cyan-300" />
                Contact
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Let&apos;s build something
                <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent dark:from-lime-300 dark:to-cyan-300">
                  {" "}
                  remarkable
                </span>
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Share your goals, constraints, and timeline. I&apos;ll help
                shape a practical plan and deliver a product that feels
                polished, performant, and production-ready.
              </p>

              <div className="grid gap-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-background/60 p-3">
                  <Rocket className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-cyan-300" />
                  <p>End-to-end execution from UX to API and deployment.</p>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-background/60 p-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-cyan-300" />
                  <p>
                    Reliable architecture with maintainable, team-friendly code.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-background/60 p-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-cyan-300" />
                  <p>Fast communication and clear milestone-based delivery.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-900 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">
                Typical response time: within 24 hours.
              </div>
            </div>
          </div>

          <Card className="h-full rounded-2xl border-border/60 bg-background/85 shadow-xl shadow-black/10 backdrop-blur">
            <CardHeader className="space-y-2.5 rounded-t-2xl border-b border-border/40 bg-card/30 p-5">
              <CardTitle className="text-xl">Send a message</CardTitle>
              <p className="text-sm text-muted-foreground sm:text-base">
                The more context you share, the better I can help.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <span>Form completeness</span>
                  <span>{completionScore}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                    style={{ width: `${completionScore}%` }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <form
                className="grid gap-3"
                onSubmit={handleSubmit}
                method="post"
                action="#"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid min-w-0 gap-2 text-sm font-medium uppercase tracking-[0.12em] text-foreground/85">
                    Name
                    <Input
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      value={formDraft.name}
                      onInput={() => clearFieldError("name")}
                      onChange={(event) =>
                        setFormDraft((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={
                        fieldErrors.name ? "contact-name-error" : undefined
                      }
                      className={`h-10 rounded-xl bg-background/80 ${
                        fieldErrors.name ? "border-destructive" : "border-input"
                      }`}
                    />
                    {fieldErrors.name && (
                      <span
                        id="contact-name-error"
                        className="text-sm text-destructive"
                      >
                        {fieldErrors.name}
                      </span>
                    )}
                  </label>
                  <label className="grid min-w-0 gap-2 text-sm font-medium uppercase tracking-[0.12em] text-foreground/85">
                    Email
                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formDraft.email}
                      autoComplete="email"
                      onInput={() => clearFieldError("email")}
                      onChange={(event) =>
                        setFormDraft((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      onBlur={(event) => {
                        const suggestedEmail = suggestEmailDomain(
                          event.target.value,
                        );
                        if (suggestedEmail !== event.target.value) {
                          setFormDraft((prev) => ({
                            ...prev,
                            email: suggestedEmail,
                          }));
                        }
                      }}
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={
                        fieldErrors.email ? "contact-email-error" : undefined
                      }
                      className={`h-10 rounded-xl bg-background/80 ${
                        fieldErrors.email
                          ? "border-destructive"
                          : "border-input"
                      }`}
                    />
                    {fieldErrors.email && (
                      <span
                        id="contact-email-error"
                        className="text-sm text-destructive"
                      >
                        {fieldErrors.email}
                      </span>
                    )}
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid min-w-0 gap-2 text-sm font-medium uppercase tracking-[0.12em] text-foreground/85">
                    Company
                    <Input
                      name="company"
                      type="text"
                      placeholder="Company or team"
                      value={formDraft.company}
                      onChange={(event) =>
                        setFormDraft((prev) => ({
                          ...prev,
                          company: event.target.value,
                        }))
                      }
                      className="h-10 rounded-xl bg-background/80"
                    />
                  </label>
                  <label className="grid min-w-0 gap-2 text-sm font-medium uppercase tracking-[0.12em] text-foreground/85">
                    Interested in
                    <Select
                      name="interest"
                      required
                      value={formDraft.interest}
                      onValueChange={(value) => {
                        clearFieldError("interest");
                        setFormDraft((prev) => ({
                          ...prev,
                          interest: value,
                        }));
                      }}
                    >
                      <SelectTrigger
                        data-field="interest"
                        aria-invalid={Boolean(fieldErrors.interest)}
                        aria-describedby={
                          fieldErrors.interest
                            ? "contact-interest-error"
                            : undefined
                        }
                        className={`h-10 rounded-xl bg-background/80 ${
                          fieldErrors.interest
                            ? "border-destructive"
                            : "border-input"
                        }`}
                      >
                        <SelectValue placeholder="Choose one" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hire">Hiring for a role</SelectItem>
                        <SelectItem value="project">
                          A project or contract
                        </SelectItem>
                        <SelectItem value="collab">Collaboration</SelectItem>
                        <SelectItem value="other">Something else</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldErrors.interest && (
                      <span
                        id="contact-interest-error"
                        className="text-sm text-destructive"
                      >
                        {fieldErrors.interest}
                      </span>
                    )}
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid min-w-0 gap-2 text-sm font-medium uppercase tracking-[0.12em] text-foreground/85">
                    Budget range
                    <Select
                      name="budget"
                      value={formDraft.budget}
                      onValueChange={(value) =>
                        setFormDraft((prev) => ({
                          ...prev,
                          budget: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-10 rounded-xl bg-background/80">
                        <SelectValue placeholder="Select a range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less than 5k">Below $5k</SelectItem>
                        <SelectItem value="5k-15k">$5k - $15k</SelectItem>
                        <SelectItem value="15k-40k">$15k - $40k</SelectItem>
                        <SelectItem value="40k+">$40k+</SelectItem>
                        <SelectItem value="custom">Custom amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="grid min-w-0 gap-2 text-sm font-medium uppercase tracking-[0.12em] text-foreground/85">
                    Timeline
                    <Select
                      name="timeline"
                      value={formDraft.timeline}
                      onValueChange={(value) =>
                        setFormDraft((prev) => ({
                          ...prev,
                          timeline: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-10 rounded-xl bg-background/80">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP</SelectItem>
                        <SelectItem value="1-2-months">1-2 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>

                <label className="grid min-w-0 gap-2 text-sm font-medium uppercase tracking-[0.12em] text-foreground/85">
                  Message
                  <Textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="What are you looking to build or who are you looking to hire?"
                    value={formDraft.message}
                    onInput={() => clearFieldError("message")}
                    onChange={(event) =>
                      setFormDraft((prev) => ({
                        ...prev,
                        message: event.target.value,
                      }))
                    }
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={
                      fieldErrors.message ? "contact-message-error" : undefined
                    }
                    className={`min-h-[126px] rounded-xl bg-background/80 ${
                      fieldErrors.message
                        ? "border-destructive"
                        : "border-input"
                    }`}
                  />
                  {fieldErrors.message && (
                    <span
                      id="contact-message-error"
                      className="text-sm text-destructive"
                    >
                      {fieldErrors.message}
                    </span>
                  )}
                  <span
                    className={`text-xs uppercase tracking-[0.16em] ${
                      formDraft.message.trim().length >= 20
                        ? "text-emerald-600 dark:text-cyan-300"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formDraft.message.trim().length}/20 characters minimum
                  </span>
                </label>

                <div className="grid gap-4">
                  <label className="grid min-w-0 gap-2 text-sm font-medium uppercase tracking-[0.12em] text-foreground/85">
                    Phone (optional)
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="+1 000 000 0000"
                      value={formDraft.phone}
                      onChange={(event) =>
                        setFormDraft((prev) => ({
                          ...prev,
                          phone: event.target.value,
                        }))
                      }
                      className="h-10 rounded-xl bg-background/80"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    className="h-11 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 text-sm text-white shadow-lg hover:opacity-95"
                    disabled={status === "loading" || !isFormValid}
                  >
                    {status === "loading"
                      ? "Sending..."
                      : isFormValid
                        ? "Send message"
                        : "Complete required fields"}
                  </Button>
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    By submitting, you agree to be contacted about your inquiry.
                  </span>
                </div>
                {!isFormValid && status !== "loading" && (
                  <div
                    className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-100"
                    aria-live="polite"
                  >
                    <p className="font-medium">Required fields left to fill:</p>
                    <p>{missingFields.join(", ")}</p>
                  </div>
                )}
                <p
                  className={`flex items-center gap-2 text-sm ${
                    status === "error"
                      ? "text-destructive"
                      : "text-emerald-600 dark:text-cyan-300"
                  }`}
                  aria-live="polite"
                >
                  {status === "success" && <CheckCircle2 className="h-4 w-4" />}
                  {message}
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
