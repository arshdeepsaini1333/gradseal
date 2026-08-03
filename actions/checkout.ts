"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/auth/session";
import { getRazorpayClient, verifyRazorpayPaymentSignature } from "@/lib/razorpay";

async function requireStudent() {
  const session = await getStudentSession();
  if (!session) redirect("/student/login");
  return session;
}

async function uniqueOrderNumber(): Promise<string> {
  for (;;) {
    const candidate = `GS-${Date.now().toString(36).toUpperCase()}${randomBytes(2)
      .toString("hex")
      .toUpperCase()}`;
    const existing = await prisma.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
}

export type CheckoutOrderPayload = {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  name: string;
  email: string;
  courseTitles: string[];
};

/** Creates a local (PENDING) Order + matching Razorpay order for the given courses. */
export async function createCheckoutOrder(courseIds: string[]): Promise<CheckoutOrderPayload> {
  const session = await requireStudent();

  const uniqueCourseIds = Array.from(new Set(courseIds));
  if (uniqueCourseIds.length === 0) {
    throw new Error("No courses selected for checkout.");
  }

  const courses = await prisma.course.findMany({
    where: { id: { in: uniqueCourseIds }, isPublished: true },
    select: { id: true, title: true, price: true, discountedPrice: true },
  });
  if (courses.length !== uniqueCourseIds.length) {
    throw new Error("One or more selected courses are no longer available.");
  }

  const existingEnrollments = await prisma.enrollment.findMany({
    where: { studentId: session.id, courseId: { in: uniqueCourseIds } },
    select: { id: true },
  });
  if (existingEnrollments.length > 0) {
    throw new Error("You're already enrolled in one or more of these courses.");
  }

  const lineItems = courses.map((course) => ({
    courseId: course.id,
    price: course.discountedPrice ?? course.price,
  }));
  const totalAmount = lineItems.reduce((sum, item) => sum + Number(item.price), 0);
  if (totalAmount <= 0) {
    throw new Error("Invalid order total.");
  }

  const orderNumber = await uniqueOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      studentId: session.id,
      totalAmount,
      paymentMethod: "razorpay",
      paymentStatus: "PENDING",
      items: {
        create: lineItems.map((item) => ({ courseId: item.courseId, price: item.price })),
      },
    },
  });

  const amountInPaise = Math.round(totalAmount * 100);
  const razorpay = getRazorpayClient();
  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: orderNumber,
    notes: { orderId: order.id, studentId: session.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { razorpayOrderId: razorpayOrder.id },
  });

  return {
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID!,
    name: `${session.firstName} ${session.lastName}`.trim(),
    email: session.email,
    courseTitles: courses.map((c) => c.title),
  };
}

/** Verifies the Checkout callback signature, marks the order PAID, and enrolls the student. */
export async function verifyCheckoutPayment(input: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<{ success: true }> {
  const session = await requireStudent();

  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    include: { items: true },
  });
  if (!order || order.studentId !== session.id) {
    throw new Error("Order not found.");
  }
  if (order.razorpayOrderId !== input.razorpayOrderId) {
    throw new Error("Order mismatch.");
  }
  if (order.paymentStatus === "PAID") {
    return { success: true };
  }

  const valid = verifyRazorpayPaymentSignature({
    razorpayOrderId: input.razorpayOrderId,
    razorpayPaymentId: input.razorpayPaymentId,
    razorpaySignature: input.razorpaySignature,
  });

  if (!valid) {
    await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "FAILED" } });
    throw new Error("Payment verification failed.");
  }

  const courseIds = order.items.map((item) => item.courseId);

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PAID", transactionId: input.razorpayPaymentId },
    }),
    ...order.items.map((item) =>
      prisma.enrollment.upsert({
        where: { studentId_courseId: { studentId: session.id, courseId: item.courseId } },
        create: { studentId: session.id, courseId: item.courseId },
        update: {},
      })
    ),
    prisma.cartItem.deleteMany({
      where: { studentId: session.id, courseId: { in: courseIds } },
    }),
  ]);

  revalidatePath("/student", "layout");
  revalidatePath("/student/my-learning");
  revalidatePath("/student/orders");
  revalidatePath("/student/cart");

  return { success: true };
}

/** Marks a still-pending order as failed, e.g. when the student closes the Checkout modal. */
export async function cancelCheckoutOrder(orderId: string): Promise<void> {
  const session = await requireStudent();
  await prisma.order.updateMany({
    where: { id: orderId, studentId: session.id, paymentStatus: "PENDING" },
    data: { paymentStatus: "FAILED" },
  });
}
