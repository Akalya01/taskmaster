"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useToast } from "@/components/Toast";

interface User {
  name: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, tasksRes] = await Promise.all([
          api("/user/profile"),
          api("/tasks")
        ]);
        setProfile(profileRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error(err);
        showToast("Failed to sync dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Polling every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <AuthGuard>
      <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 flex items-center gap-3">
              Hello, {profile?.name}! <span className="animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </h1>
            <p className="text-slate-400 text-base font-medium">
              You have <span className="text-indigo-600 font-bold">{pendingTasks} tasks</span> to complete today.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3 text-xs text-slate-500 font-bold bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
              </svg>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="All Tasks" 
            value={tasks.length} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            } 
            trend="Total" 
            color="indigo" 
          />
          <StatCard 
            title="In Progress" 
            value={pendingTasks} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            } 
            trend="Active" 
            color="amber" 
          />
          <StatCard 
            title="Completed" 
            value={completedTasks} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } 
            trend="Finished" 
            color="emerald" 
          />
          <StatCard 
            title="Efficiency" 
            value={`${completionRate}%`} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            } 
            trend="Rate" 
            color="violet" 
          />
        </div>

        {/* Progress Bar Section */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 card-hover overflow-hidden relative">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Overall Progress</h2>
              <p className="text-slate-400 text-sm font-medium">You have completed {completedTasks} out of {tasks.length} tasks</p>
            </div>
            <div className="text-4xl font-black text-indigo-600">{completionRate}%</div>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative z-10">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000 ease-out rounded-full shadow-lg"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Tasks</h2>
                  <p className="text-slate-400 text-sm font-medium">Your latest updates</p>
                </div>
                <Link href="/tasks" className="text-indigo-600 hover:text-white font-bold text-xs bg-indigo-50 hover:bg-indigo-600 px-4 py-2 rounded-xl transition-all active:scale-95">View All</Link>
              </div>
              <div className="space-y-3">
                {tasks.slice(-4).reverse().map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all duration-300 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {task.completed ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(task.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold italic">No tasks found. Start by creating one!</p>
                  </div>
                )}
              </div>
            </section>

            {/* <section className="bg-gradient-main p-12 rounded-[3rem] shadow-indigo-glow text-white relative overflow-hidden group">
              <div className="relative z-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] mb-6">Pro Features</span>
                <h2 className="text-4xl font-black mb-4 tracking-tight leading-tight">Unlock Premium<br/>Experience Today</h2>
                <p className="text-indigo-100 mb-10 max-w-sm text-lg font-medium leading-relaxed opacity-90">Get advanced analytics, team collaboration, and priority 24/7 support.</p>
                <button className="bg-white text-indigo-700 px-10 py-4 rounded-2xl font-black hover:bg-slate-50 active:scale-95 transition-all duration-300 shadow-xl shadow-indigo-900/40">
                  Go Premium
                </button>
              </div>
              <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
              <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px]" />
            </section> */}
          </div>

          {/* Sidebar Area in Dashboard */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 card-hover">
              <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Quick Profile</h2>
              <div className="flex flex-col items-center text-center p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[2rem] bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-indigo-600/20 rounded-[2rem] blur-xl -z-0 animate-pulse" />
                </div>
                <h3 className="font-black text-slate-900 text-xl mt-6">{profile?.name}</h3>
                <p className="text-sm text-slate-400 font-bold mt-1">{profile?.email}</p>
              </div>
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Account Status</span>
                  <span className="font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full">Active</span>
                </div>
               
              </div>
            </section>

          
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  color: "indigo" | "emerald" | "violet" | "teal" | "amber";
}

function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
    teal: "bg-teal-50 text-teal-600 ring-teal-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-center mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${colors[color]}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-md ${color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-black mt-1 text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

interface NotificationItemProps {
  title: string;
  time: string;
  type: "update" | "alert";
}

function NotificationItem({ title, time, type }: NotificationItemProps) {
  return (
    <div className="flex gap-4 group cursor-pointer p-2 -m-2 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className={`w-2.5 h-2.5 rounded-full mt-2 transition-transform group-hover:scale-150 ${type === 'alert' ? 'bg-rose-500' : 'bg-indigo-500'}`} />
      <div>
        <p className="text-sm font-black text-slate-700 group-hover:text-indigo-600 transition-colors">{title}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{time}</p>
      </div>
    </div>
  );
}
