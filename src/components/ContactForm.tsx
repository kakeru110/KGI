"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import { BUSINESS_INFO } from "@/lib/business-info";

export default function ContactForm({ dict }: { dict: Dictionary }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot - left blank by real visitors
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (company) {
      // Honeypot tripped - pretend success so bots don't learn to skip the field.
      setStatus("success");
      return;
    }
    setSubmitting(true);
    setStatus("idle");
    try {
      // FormSubmit relays this straight to BUSINESS_INFO.email - no backend
      // of our own needed. The recipient has to click the one-time
      // "activate this form" link FormSubmit emails on the very first
      // submission before delivery actually starts working.
      const res = await fetch(`https://formsubmit.co/ajax/${BUSINESS_INFO.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `【お問い合わせ】${name}様より`,
          _replyto: email,
          _captcha: "false",
          _template: "table",
        }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center">
        <p className="font-medium">{dict.contact.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">{dict.contact.name}</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-border px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">{dict.contact.email}</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-border px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">{dict.contact.message}</span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-lg border border-border px-3 py-2"
        />
      </label>
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {status === "error" && <p className="text-sm text-red-600">{dict.contact.errorGeneric}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-accent px-4 py-3 font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? dict.contact.submitting : dict.contact.submit}
      </button>
    </form>
  );
}
