import "server-only";
import { prisma } from "@/lib/prisma";

export async function createSupportTicket(input: {
  studentId: string;
  subject: string;
  orderId?: string | null;
  message: string;
}): Promise<void> {
  await prisma.supportTicket.create({
    data: {
      studentId: input.studentId,
      subject: input.subject,
      orderId: input.orderId || null,
      message: input.message,
    },
  });
}

export type SupportTicket = {
  id: string;
  subject: string;
  orderId: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
  studentName: string;
  studentEmail: string;
};

export async function getSupportTickets(): Promise<SupportTicket[]> {
  const tickets = await prisma.supportTicket.findMany({
    orderBy: { createdAt: "desc" },
    include: { student: { select: { firstName: true, lastName: true, email: true } } },
  });

  return tickets.map((ticket) => ({
    id: ticket.id,
    subject: ticket.subject,
    orderId: ticket.orderId,
    message: ticket.message,
    isRead: ticket.isRead,
    createdAt: ticket.createdAt,
    studentName: `${ticket.student.firstName} ${ticket.student.lastName}`,
    studentEmail: ticket.student.email,
  }));
}

export async function getUnreadSupportTicketCount(): Promise<number> {
  return prisma.supportTicket.count({ where: { isRead: false } });
}

export async function markAllSupportTicketsRead(): Promise<void> {
  await prisma.supportTicket.updateMany({ where: { isRead: false }, data: { isRead: true } });
}
