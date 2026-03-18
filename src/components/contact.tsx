"use client";

import { track } from "@vercel/analytics";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormStatus = "idle" | "loading" | "success" | "error";
type FieldName = "name" | "email" | "interest" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type FormDraft = Record<FieldName, string>;
const fieldOrder: FieldName[] = ["name", "email", "interest", "message"];

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

  const element = form.querySelector<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >(`[name="${firstInvalidField}"]`);

  if (!element) return;

  element.focus();
  element.scrollIntoView({ behavior: "smooth", block: "center" });
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
  const missingFieldsText = fieldOrder
    .filter((field) => Boolean(draftErrors[field]))
    .map((field) => missingFieldLabels[field])
    .join(", ");

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
      preferredContact: getValue(payload, "contact") || "email",
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
      className="relative isolate overflow-hidden py-24 reveal-on-load reveal-delay-3 scroll-mt-24"
      aria-label="Contact"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Tell me about needed project or role
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Share a few details about what you need, your timeline, and how
              you want to work. I will reply within 1-2 business days.
            </p>
            <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                <p className="font-medium text-foreground">Availability</p>
                <p>Open for freelance and full-time roles.</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                <p className="font-medium text-foreground">Focus</p>
                <p>Web development with modern technologies.</p>
              </div>
            </div>
          </div>

          <Card className="border-border/60 bg-background/80 shadow-xl shadow-black/5 backdrop-blur">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Send a message</CardTitle>
              <p className="text-sm text-muted-foreground">
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
                  <label className="grid min-w-0 gap-2 text-sm font-medium">
                    Name
                    <input
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
                      className={`h-11 w-full rounded-lg border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        fieldErrors.name ? "border-destructive" : "border-input"
                      }`}
                    />
                    {fieldErrors.name && (
                      <span
                        id="contact-name-error"
                        className="text-xs text-destructive"
                      >
                        {fieldErrors.name}
                      </span>
                    )}
                  </label>
                  <label className="grid min-w-0 gap-2 text-sm font-medium">
                    Email
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      onInput={() => clearFieldError("email")}
                      onChange={(event) =>
                        setFormDraft((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={
                        fieldErrors.email ? "contact-email-error" : undefined
                      }
                      className={`h-11 w-full rounded-lg border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        fieldErrors.email
                          ? "border-destructive"
                          : "border-input"
                      }`}
                    />
                    {fieldErrors.email && (
                      <span
                        id="contact-email-error"
                        className="text-xs text-destructive"
                      >
                        {fieldErrors.email}
                      </span>
                    )}
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid min-w-0 gap-2 text-sm font-medium">
                    Company
                    <input
                      name="company"
                      type="text"
                      placeholder="Company or team"
                      className="h-11 w-full rounded-lg border border-input bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                  <label className="grid min-w-0 gap-2 text-sm font-medium">
                    Interested in
                    <select
                      name="interest"
                      required
                      defaultValue=""
                      onChange={(event) => {
                        clearFieldError("interest");
                        setFormDraft((prev) => ({
                          ...prev,
                          interest: event.target.value,
                        }));
                      }}
                      aria-invalid={Boolean(fieldErrors.interest)}
                      aria-describedby={
                        fieldErrors.interest
                          ? "contact-interest-error"
                          : undefined
                      }
                      className={`h-11 w-full rounded-lg border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        fieldErrors.interest
                          ? "border-destructive"
                          : "border-input"
                      }`}
                    >
                      <option value="" disabled>
                        Choose one
                      </option>
                      <option value="hire">Hiring for a role</option>
                      <option value="project">A project or contract</option>
                      <option value="collab">Collaboration</option>
                      <option value="other">Something else</option>
                    </select>
                    {fieldErrors.interest && (
                      <span
                        id="contact-interest-error"
                        className="text-xs text-destructive"
                      >
                        {fieldErrors.interest}
                      </span>
                    )}
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid min-w-0 gap-2 text-sm font-medium">
                    Budget range
                    <select
                      name="budget"
                      defaultValue=""
                      className="h-11 w-full rounded-lg border border-input bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="" disabled>
                        Select a range
                      </option>
                      <option value="less than 5k">Below $5k</option>
                      <option value="5k-15k">$5k - $15k</option>
                      <option value="15k-40k">$15k - $40k</option>
                      <option value="40k+">$40k+</option>
                      <option value="custom">Custom amount</option>
                    </select>
                  </label>
                  <label className="grid min-w-0 gap-2 text-sm font-medium">
                    Timeline
                    <select
                      name="timeline"
                      className="h-11 w-full rounded-lg border border-input bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-2-months">1-2 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </label>
                </div>

                <label className="grid min-w-0 gap-2 text-sm font-medium">
                  Message
                  <textarea
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
                    className={`w-full rounded-lg border bg-background/80 px-3 py-2 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      fieldErrors.message
                        ? "border-destructive"
                        : "border-input"
                    }`}
                  />
                  {fieldErrors.message && (
                    <span
                      id="contact-message-error"
                      className="text-xs text-destructive"
                    >
                      {fieldErrors.message}
                    </span>
                  )}
                  <span
                    className={`text-xs ${
                      formDraft.message.trim().length >= 20
                        ? "text-emerald-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formDraft.message.trim().length}/20 characters minimum
                  </span>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid min-w-0 gap-2 text-sm font-medium">
                    Preferred contact
                    <select
                      name="contact"
                      className="h-11 w-full rounded-lg border border-input bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="either">Either</option>
                    </select>
                  </label>
                  <label className="grid min-w-0 gap-2 text-sm font-medium">
                    Phone (optional)
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+1 000 000 0000"
                      className="h-11 w-full rounded-lg border border-input bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    className="h-11 px-6"
                    disabled={status === "loading" || !isFormValid}
                  >
                    {status === "loading"
                      ? "Sending..."
                      : isFormValid
                        ? "Send message"
                        : "Complete required fields"}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    By submitting, you agree to be contacted about your inquiry.
                  </span>
                </div>
                {!isFormValid && status !== "loading" && (
                  <p
                    className="text-xs text-muted-foreground"
                    aria-live="polite"
                  >
                    Missing or invalid: {missingFieldsText}
                  </p>
                )}
                <p
                  className={`text-sm ${
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
