import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/admin/ui/card";
import AnimatedNumber from "./AnimatedNumber";
import Sparkline from "./Sparkline";
import type { AdminStat } from "@/types/admin";
import { cn } from "@/lib/utils";

export default function StatCard({ stat }: { stat: AdminStat }) {
  const isPositive = stat.changePercent >= 0;

  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <stat.icon className="size-[18px]" aria-hidden="true" />
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive",
            )}
          >
            {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(stat.changePercent)}%
          </span>
        </div>

        <div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            <AnimatedNumber value={stat.value} format={stat.format} />
          </p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>

        <Sparkline data={stat.sparkline} positive={isPositive} />
      </CardContent>
    </Card>
  );
}
