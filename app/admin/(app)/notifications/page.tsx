import type { Metadata } from "next";
import { Inbox, Mail } from "lucide-react";

import { Card, CardContent } from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";
import { getSupportTickets, markAllSupportTicketsRead } from "@/lib/support";
import { formatRelativeTime } from "@/lib/format";

export const metadata: Metadata = { title: "Notifications – GradSeal Admin" };

export default async function AdminNotificationsPage() {
  const tickets = await getSupportTickets();
  await markAllSupportTicketsRead();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground">Support requests submitted by students.</p>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Inbox className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">No support requests yet</p>
              <p className="text-sm text-muted-foreground">
                Messages students send from the Support page will show up here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardContent className="flex flex-col gap-2 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Mail className="size-4 text-muted-foreground" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{ticket.studentName}</p>
                      <p className="text-xs text-muted-foreground">{ticket.studentEmail}</p>
                    </div>
                    {!ticket.isRead && (
                      <span className="size-2 rounded-full bg-destructive" aria-label="Unread" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(ticket.createdAt)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{ticket.subject}</p>
                  {ticket.orderId && <Badge variant="secondary">Order: {ticket.orderId}</Badge>}
                </div>

                <p className="whitespace-pre-line text-sm text-muted-foreground">{ticket.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
