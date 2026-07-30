"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import AdminSidebarNav from "./AdminSidebarNav";
import { TooltipProvider } from "@/components/admin/ui/tooltip";
import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-card transition-[width] duration-150 md:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className={cn("flex h-16 shrink-0 items-center border-b border-border px-4", collapsed && "justify-center px-0")}>
          <Link href="/admin/dashboard" className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              G
            </div>
            {!collapsed && <span className="truncate text-sm font-bold text-foreground">GradSeal Admin</span>}
          </Link>
        </div>

        <AdminSidebarNav collapsed={collapsed} />

        <div className="shrink-0 border-t border-border p-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggle}
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
