"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";
import { useToast } from "@/components/Toast";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const { showToast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
        showToast("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, [showToast]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const res = await api("/tasks", "POST", { title: newTaskTitle });
      setTasks([...tasks, res.data]);
      setNewTaskTitle("");
      showToast("Task created successfully", "success");
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message);
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      const res = await api(`/tasks/${id}`, "PUT", { completed: !completed });
      setTasks(tasks.map(t => t.id === id ? res.data : t));
      showToast(completed ? "Task marked as active" : "Task completed!", "success");
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api(`/tasks/${id}`, "DELETE");
      setTasks(tasks.filter(t => t.id !== id));
      showToast("Task deleted", "success");
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Tasks</h1>
            <p className="text-slate-400 text-base font-medium">Organize your workflow and stay productive.</p>
          </div>
        </header>

        <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-soft border border-slate-100 card-hover">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Daily List</h2>
            
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {(["all", "active", "completed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    filter === f 
                      ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              {tasks.filter(t => !t.completed).length} Tasks Remaining
            </div>
          </div>
          
          <form onSubmit={handleCreateTask} className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-7 py-5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-300 bg-slate-50/50 font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 shadow-indigo-glow active:scale-95"
            >
              Add Task
            </button>
          </form>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-24 bg-slate-50/30 rounded-[2.5rem] border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-soft">
                  {filter === "completed" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                <p className="text-slate-400 font-bold text-lg">
                  {filter === "all" ? "Your list is empty. Add a task to start!" : 
                   filter === "active" ? "No active tasks. Good job!" : 
                   "No completed tasks yet."}
                </p>
              </div>
            ) : (
              filteredTasks.slice().reverse().map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-soft transition-all duration-300 bg-slate-50/50 group"
                >
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => handleToggleTask(task.id, task.completed)}
                      className={`relative w-8 h-8 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                        task.completed 
                          ? 'bg-indigo-600 border-indigo-600 shadow-indigo-200 shadow-lg scale-110' 
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div>
                      <span className={`text-lg font-bold transition-all duration-300 ${
                        task.completed ? 'line-through text-slate-300' : 'text-slate-700'
                      }`}>
                        {task.title}
                      </span>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
                        Created {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-4 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:rotate-12"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
