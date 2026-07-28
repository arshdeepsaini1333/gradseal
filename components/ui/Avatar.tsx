"use client";

import { useState } from "react";

interface AvatarProps {
  src: string | null | undefined;
  name: string;
  email?: string;
  className?: string;
}

function getInitials(name: string, email?: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (initials) return initials;
  return email?.trim() ? email.trim()[0].toUpperCase() : "";
}

// Renders a profile photo, falling back to name/email initials both when no
// photo is set and when the photo URL fails to load (e.g. an expired Google
// `picture` URL) — without this, a broken `src` shows the browser's broken-
// image icon instead of falling back gracefully.
export default function Avatar({ src, name, email, className = "" }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = !!src && !errored;

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} onError={() => setErrored(true)} className={className} />
    );
  }

  return <span aria-hidden="true">{getInitials(name, email)}</span>;
}
