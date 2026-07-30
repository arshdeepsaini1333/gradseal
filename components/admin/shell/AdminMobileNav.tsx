"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import AdminSidebarNav from "./AdminSidebarNav";
import { Button } from "@/components/admin/ui/button";
import { TooltipProvider } from "@/components/admin/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/admin/ui/sheet";

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>
            <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                G
              </div>
              GradSeal Admin
            </Link>
          </SheetTitle>
        </SheetHeader>
        <TooltipProvider>
          <AdminSidebarNav onNavigate={() => setOpen(false)} />
        </TooltipProvider>
      </SheetContent>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>
    </Sheet>
  );
}
