import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudentLoginForm from "@/components/forms/StudentLoginForm";

export const metadata: Metadata = { title: "Student Login – GradSeal" };

interface StudentLoginPageProps {
  searchParams: Promise<{ verified?: string }>;
}

export default async function StudentLoginPage({ searchParams }: StudentLoginPageProps) {
  const { verified } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#F8FAFC] pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <StudentLoginForm justVerified={verified === "1"} />
        </div>
      </main>
      <Footer />
    </>
  );
}
