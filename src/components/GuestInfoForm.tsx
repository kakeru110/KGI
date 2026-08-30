"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function GuestInfoForm({
  locale,
  dict,
  checkIn,
  checkOut,
  adults,
  childrenCount,
}: {
  locale: Locale;
  dict: Dictionary;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenCount: number;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError(dict.guestInfo.errorAgreeRequired);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          checkIn,
          checkOut,
          adults,
          children: childrenCount,
          firstName,
          lastName,
          email,
          phone,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error === "unavailable" ? dict.guestInfo.errorUnavailable : dict.guestInfo.errorGeneric);
        setSubmitting(false);
        return;
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setError(dict.guestInfo.errorGeneric);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">{dict.guestInfo.lastName}</span>
        <input
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="rounded-lg border border-border px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">{dict.guestInfo.firstName}</span>
        <input
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="rounded-lg border border-border px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="text-muted">{dict.guestInfo.email}</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-border px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="text-muted">{dict.guestInfo.phone}</span>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-lg border border-border px-3 py-2"
        />
      </label>

      <label className="flex items-start gap-2 text-sm sm:col-span-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
        />
        <span>
          {dict.guestInfo.agreePrefix}
          <Link href={`/${locale}/policy`} target="_blank" className="text-accent underline">
            {dict.guestInfo.agreeLinkText}
          </Link>
          {dict.guestInfo.agreeSuffix}
        </span>
      </label>

      <p className="text-xs text-muted sm:col-span-2">
        {dict.guestInfo.privacyPrefix}
        <Link href={`/${locale}/privacy`} target="_blank" className="text-accent underline">
          {dict.guestInfo.privacyLinkText}
        </Link>
        {dict.guestInfo.privacySuffix}
      </p>

      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-accent px-4 py-3 font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
      >
        {submitting ? dict.guestInfo.submitting : dict.guestInfo.submit}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted sm:col-span-2">
        <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
        {dict.guestInfo.securePaymentNote}
      </p>
    </form>
  );
}
