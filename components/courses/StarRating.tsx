import { Star } from "lucide-react";

export default function StarRating({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}) {
  const starSize = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(rating) ? "text-amber-400 fill-current" : "text-slate-200 fill-current"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-[#0F172A]">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-[#94A3B8]">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
