"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import { createCheckoutOrder, verifyCheckoutPayment, cancelCheckoutOrder } from "@/actions/checkout";

const CHECKOUT_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

function loadCheckoutScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay Checkout")));
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay Checkout"));
    document.body.appendChild(script);
  });
}

export default function RazorpayCheckoutButton({
  courseIds,
  label = "Buy Now",
  className,
  variant = "primary",
  successRedirect = "/student/my-learning",
}: {
  courseIds: string[];
  label?: string;
  className?: string;
  variant?: "primary" | "outline";
  successRedirect?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (courseIds.length === 0 || loading) return;
    setLoading(true);

    try {
      const order = await createCheckoutOrder(courseIds);
      await loadCheckoutScript();

      if (!window.Razorpay) {
        throw new Error("Payment gateway failed to load. Please try again.");
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "GradSeal",
        description: order.courseTitles.join(", "),
        order_id: order.razorpayOrderId,
        prefill: { name: order.name, email: order.email },
        theme: { color: "#2563EB" },
        handler: async (response: unknown) => {
          const payment = response as {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          };
          try {
            await verifyCheckoutPayment({
              orderId: order.orderId,
              razorpayOrderId: payment.razorpay_order_id,
              razorpayPaymentId: payment.razorpay_payment_id,
              razorpaySignature: payment.razorpay_signature,
            });
            toast.success("Payment successful! You're enrolled.");
            router.push(successRedirect);
            router.refresh();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            void cancelCheckoutOrder(order.orderId);
            setLoading(false);
          },
        },
      });

      rzp.on("payment.failed", () => {
        void cancelCheckoutOrder(order.orderId);
        toast.error("Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button variant={variant} className={className} loading={loading} onClick={handleClick}>
      {label}
    </Button>
  );
}
