"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { adminSidebarLinks } from "@/lib/admin-nav";
import { logoutAdmin } from "@/actions/admin-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/admin/ui/tooltip";
import { cn } from "@/lib/utils";

interface AdminSidebarNavProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export default function AdminSidebarNav({ collapsed = false, onNavigate }: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
      {adminSidebarLinks.map((link) => {
        const isActive =
          link.href === "/admin/dashboard"
            ? pathname === link.href
            : pathname?.startsWith(link.href);

        const linkEl = (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              collapsed && "justify-center px-2",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <link.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            {!collapsed && <span className="truncate">{link.label}</span>}
          </Link>
        );

        if (!collapsed) return linkEl;

        return (
          <Tooltip key={link.href}>
            <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
            <TooltipContent side="right">{link.label}</TooltipContent>
          </Tooltip>
        );
      })}

      <div className="mt-auto pt-2">
        <form action={logoutAdmin}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          ) : (
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              Logout
            </button>
          )}
        </form>
      </div>
    </nav>
  );
}
