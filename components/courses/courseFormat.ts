import type { CatalogCourse } from "@/lib/courses";

export const levelLabel: Record<CatalogCourse["level"], "Beginner" | "Intermediate" | "Advanced"> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export function formatPrice(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatCount(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  return String(value);
}

export function discountPercent(price: number, originalPrice: number): number {
  if (originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
