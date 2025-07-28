import Header from "@/components/Header";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* <PostHogPageView /> */}

      <Header />
      <div className="mt-22">

      {children}
      </div>
    </div>
  );
}
