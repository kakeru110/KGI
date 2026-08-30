"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function GuestRegistrationForm({
  bookingId,
  dict,
}: {
  bookingId: number;
  dict: Dictionary;
}) {
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [hasJapanAddress, setHasJapanAddress] = useState(true);
  const [nationality, setNationality] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/guest-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, address, occupation, hasJapanAddress, nationality, passportNumber }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "done") {
    return <p className="text-sm text-muted">{dict.guestRegistration.success}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-border p-5 text-left">
      <div>
        <h2 className="font-semibold">{dict.guestRegistration.heading}</h2>
        <p className="mt-1 text-sm text-muted">{dict.guestRegistration.intro}</p>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">{dict.guestRegistration.addressLabel}</span>
        <input
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="rounded-lg border border-border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">{dict.guestRegistration.occupationLabel}</span>
        <input
          required
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          className="rounded-lg border border-border px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={hasJapanAddress}
          onChange={(e) => setHasJapanAddress(e.target.checked)}
        />
        {dict.guestRegistration.hasJapanAddressLabel}
      </label>

      {!hasJapanAddress && (
        <>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">{dict.guestRegistration.nationalityLabel}</span>
            <input
              required
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="rounded-lg border border-border px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">{dict.guestRegistration.passportNumberLabel}</span>
            <input
              required
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
              className="rounded-lg border border-border px-3 py-2"
            />
          </label>
        </>
      )}

      {status === "error" && <p className="text-sm text-red-600">{dict.guestRegistration.errorGeneric}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-accent px-4 py-3 font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? dict.guestRegistration.submitting : dict.guestRegistration.submit}
      </button>
    </form>
  );
}
