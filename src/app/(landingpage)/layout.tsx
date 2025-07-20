import Header from "@/components/Header";

export default function LandingPageLayout({ children } : {
    children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-[#EFE9D5] w-full max-w-[100vw] overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
