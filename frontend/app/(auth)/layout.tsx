import "../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f8fafc] bg-[radial-gradient(at_top_left,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-emerald-50 flex items-center justify-center min-h-screen p-6">
      {children}
    </div>
  );
}
