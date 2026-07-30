import { UserPlus, ShoppingBag, Award, ClipboardCheck, Star, LogIn } from "lucide-react";
import { ScrollArea } from "@/components/admin/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/types/admin";

const ICONS: Record<ActivityItem["type"], typeof UserPlus> = {
  enrollment: UserPlus,
  purchase: ShoppingBag,
  certificate: Award,
  quiz: ClipboardCheck,
  review: Star,
  login: LogIn,
};

const TONES: Record<ActivityItem["type"], string> = {
  enrollment: "bg-primary/10 text-primary",
  purchase: "bg-emerald-500/10 text-emerald-600",
  certificate: "bg-amber-500/10 text-amber-600",
  quiz: "bg-violet-500/10 text-violet-600",
  review: "bg-pink-500/10 text-pink-600",
  login: "bg-slate-500/10 text-slate-500",
};

export default function RecentActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <ScrollArea className="h-80 pr-3">
      <ul className="flex flex-col gap-4">
        {items.map((item) => {
          const Icon = ICONS[item.type];
          return (
            <li key={item.id} className="flex items-start gap-3">
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", TONES[item.type])}>
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{item.actor}</span> {item.message}
                </p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
