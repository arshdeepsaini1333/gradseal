export interface PasswordStrength {
  score: number; // 0-4
  label: "Very weak" | "Weak" | "Fair" | "Good" | "Strong";
  color: string;
}

const LABELS: PasswordStrength["label"][] = [
  "Very weak",
  "Weak",
  "Fair",
  "Good",
  "Strong",
];

const COLORS = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"];

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const clamped = Math.min(score, 4);

  return {
    score: clamped,
    label: LABELS[clamped],
    color: COLORS[clamped],
  };
}
