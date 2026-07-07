import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GradSeal – Learn. Get Certified. Build Your Fitness Career.",
  description:
    "GradSeal is a professional certification platform for gym trainers, personal trainers, fitness coaches, nutrition coaches, yoga instructors, and sports professionals.",
  keywords: [
    "fitness certification",
    "personal trainer course",
    "gym trainer certificate",
    "nutrition coach",
    "yoga instructor",
    "online certification",
    "GradSeal",
  ],
  openGraph: {
    title: "GradSeal – Professional Fitness Certifications",
    description:
      "Earn industry-recognized certifications in fitness, nutrition, and wellness. Self-paced online courses with digital certificates.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
