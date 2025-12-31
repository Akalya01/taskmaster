"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else if (!authorized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthorized(true);
    }
  }, [router, authorized]);

  if (!authorized) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-indigo-glow animate-pulse">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="absolute inset-0 bg-indigo-600/20 rounded-2xl blur-xl -z-10" />
        </div>
        <p className="mt-6 text-slate-400 font-bold text-sm tracking-widest uppercase">Securing Session</p>
      </div>
    );
  }

  return <>{children}</>;
}
