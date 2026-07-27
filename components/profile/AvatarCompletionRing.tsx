import type { ReactNode } from "react";

interface AvatarCompletionRingProps {
  percent: number;
  size: number;
  strokeWidth?: number;
  className?: string;
  children: ReactNode;
}

function getRingColorClass(percent: number): string {
  if (percent >= 80) return "stroke-emerald-500";
  if (percent >= 50) return "stroke-amber-500";
  return "stroke-red-500";
}

// Wraps an avatar with a circular progress ring showing profile completion —
// the same visual language as ProfileCompletionMeter, just around the DP
// instead of a horizontal bar, so it's visible wherever the avatar appears.
export default function AvatarCompletionRing({
  percent,
  size,
  strokeWidth = 3,
  className = "",
  children,
}: AvatarCompletionRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="pointer-events-none absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="stroke-slate-200" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${getRingColorClass(percent)} transition-[stroke-dashoffset] duration-500`}
        />
      </svg>
      <div className="relative" style={{ padding: strokeWidth + 2 }}>
        {children}
      </div>
    </div>
  );
}
