"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (!isAuthPage) return null;

  return (
    <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 px-8 py-5 flex justify-between items-center transition-all duration-300">
   <Link
  href="/"
  className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
>
  TaskMaster
</Link>

      <div className="flex gap-4 items-center">
        <Link 
          href="/login" 
          className={`px-6 py-2.5 rounded-2xl font-bold transition-all duration-300 ${
            pathname === "/login" 
              ? "text-indigo-600 bg-indigo-50 shadow-inner" 
              : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
          }`}
        >
          Login
        </Link>
        <Link 
          href="/register" 
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-indigo-100 active:scale-95"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
