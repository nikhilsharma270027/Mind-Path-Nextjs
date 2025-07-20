import Header from "@/components/Header";
import { NextAuthProvider } from "@/providers/NextAuthProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent w-full max-w-[100vw] overflow-x-hidden">
      <Header />
        {/* <Header /> */}
        {children}
    </div>
  );
}
