"use client";

import { track } from "@vercel/analytics";
import { useState, type FormEvent } from "react";
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
type FormDraft = Record<FieldName, string>;
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
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

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
      });
      form.reset();
    } catch (error) {
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
      className="relative isolate rounded-lg overflow-hidden py-16 reveal-on-load reveal-delay-3 scroll-mt-24"
      aria-label="Contact"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
        <div className="grid gap-7 lg:grid-cols-[1fr_1fr] lg:items-stretch">
          <div className=" p-6  md:p-7">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Looking forward to hearing from you
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Thank you for considering my profile. I would be glad to learn
                about your requirements and discuss how I can contribute to your
                team or project.
              </p>
              <div className="space-y-2">
                <p className="text-base font-semibold uppercase tracking-wide text-foreground/80">
                  What I offer
                </p>
                <p className="text-base text-muted-foreground">
                  End-to-end product thinking with strong execution to help you
                  ship confidently.
                </p>
              </div>
              <div className="grid gap-4 text-base text-muted-foreground">
                <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                  <p className="font-medium text-foreground">Product Design</p>
                  <p>
                    User-focused interface design, wireframes, and practical UX
                    decisions that support business goals.
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                  <p className="font-medium text-foreground">
                    Frontend Development
                  </p>
                  <p>
                    Clean, responsive React and Next.js applications with
                    maintainable architecture and polished UI quality.
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                  <p className="font-medium text-foreground">
                    API Integration and Performance
                  </p>
                  <p>
                    Reliable API integrations, optimization, and production
                    readiness to deliver fast, stable, and scalable products.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="h-full rounded-2xl border-border/60 bg-background/80 shadow-xl shadow-black/5 backdrop-blur">
            <CardHeader className="space-y-1 rounded-t-2xl border-b border-border/40 bg-card/30">
              <CardTitle className="text-2xl">Send a message</CardTitle>
              <p className="text-base text-muted-foreground">
                The more context you share, the better I can help.
              </p>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-5"
                onSubmit={handleSubmit}
                method="post"
                action="#"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid min-w-0 gap-2 text-base font-medium">
                    Name
                    <Input
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
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
                      className={`bg-background/80 ${
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
                  <label className="grid min-w-0 gap-2 text-base font-medium">
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
                      className={`bg-background/80 ${
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid min-w-0 gap-2 text-base font-medium">
                    Company
                    <Input
                      name="company"
                      type="text"
                      placeholder="Company or team"
                      className="bg-background/80"
                    />
                  </label>
                  <label className="grid min-w-0 gap-2 text-base font-medium">
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
                        className={`bg-background/80 ${
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid min-w-0 gap-2 text-base font-medium">
                    Budget range
                    <Select name="budget">
                      <SelectTrigger className="bg-background/80">
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
                  <label className="grid min-w-0 gap-2 text-base font-medium">
                    Timeline
                    <Select name="timeline">
                      <SelectTrigger className="bg-background/80">
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

                <label className="grid min-w-0 gap-2 text-base font-medium">
                  Message
                  <Textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="What are you looking to build or who are you looking to hire?"
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
                    className={`bg-background/80 ${
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
                    className={`text-sm ${
                      formDraft.message.trim().length >= 20
                        ? "text-emerald-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formDraft.message.trim().length}/20 characters minimum
                  </span>
                </label>

                <div className="grid gap-4">
                  <label className="grid min-w-0 gap-2 text-base font-medium">
                    Phone (optional)
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="+1 000 000 0000"
                      className="bg-background/80"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    className="h-12 px-7 text-base"
                    disabled={status === "loading" || !isFormValid}
                  >
                    {status === "loading"
                      ? "Sending..."
                      : isFormValid
                        ? "Send message"
                        : "Complete required fields"}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    By submitting, you agree to be contacted about your inquiry.
                  </span>
                </div>
                {!isFormValid && status !== "loading" && (
                  <div
                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800"
                    aria-live="polite"
                  >
                    <p className="font-medium">Required fields left to fill:</p>
                    <p>{missingFields.join(", ")}</p>
                  </div>
                )}
                <p
                  className={`text-base ${
                    status === "error" ? "text-destructive" : "text-emerald-500"
                  }`}
                  aria-live="polite"
                >
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
