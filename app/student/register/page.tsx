import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudentSignupForm from "@/components/forms/StudentSignupForm";
import { getStudentSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Student Register – GradSeal" };

export default async function StudentRegisterPage() {
  const student = await getStudentSession();
  if (student) {
    redirect("/student/dashboard");
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#F8FAFC] pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-[#0F172A] sm:text-4xl">
              Create Your Account
            </h1>
            <p className="mt-3 text-[#64748B]">
              Join GradSeal and start your professional fitness certification journey.
            </p>
          </div>
          <StudentSignupForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
