"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-[#f8fafc] z-[100]">
      <div className="relative">
        <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-emerald-glow animate-bounce">
          <h1 className="text-white text-3xl font-black tracking-tighter">T</h1>
        </div>
        <div className="absolute inset-0 bg-emerald-600/20 rounded-[2.5rem] blur-2xl animate-pulse -z-10" />
      </div>
      <div className="mt-12 flex flex-col items-center">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Initializing</h2>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
