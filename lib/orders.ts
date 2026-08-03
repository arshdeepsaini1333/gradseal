import "server-only";
import { prisma } from "@/lib/prisma";
import type { PaymentStatus } from "@/generated/prisma/enums";

export type OrderSummary = {
  id: string;
  orderNumber: string;
  date: string;
  items: string[];
  total: number;
  status: PaymentStatus;
};

export async function getStudentOrders(studentId: string): Promise<OrderSummary[]> {
  const orders = await prisma.order.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { course: { select: { title: true } } } },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.createdAt.toISOString(),
    items: order.items.map((item) => item.course.title),
    total: Number(order.totalAmount),
    status: order.paymentStatus,
  }));
}
