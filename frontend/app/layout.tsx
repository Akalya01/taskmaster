"use client";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ToastProvider } from "@/components/Toast";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isHomePage = pathname === "/";

  const showSidebar = !isAuthPage && !isHomePage;

  return (
    <html lang="en" className={`${jakarta.variable} font-sans`}>
      <body className="bg-[#f8fafc] min-h-screen text-slate-900 flex antialiased">
        <ToastProvider>
          {showSidebar && <Sidebar />}
          <div className={`flex-1 flex flex-col min-h-screen relative ${showSidebar ? 'pl-72' : ''}`}>
            <main className={`${showSidebar ? 'p-8 lg:p-12' : 'container mx-auto px-4 py-8'} flex-1`}>
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
