import { ApiError } from "../utils/ApiError.js";
import { cache } from "../config/cache.js";

/**
 * In-memory tasks (POC only)
 */
export const tasks = [];

const getCacheKey = (userId) => `tasks_${userId}`;

export const getTasks = (req, res) => {
  const userId = req.user.id;
  const cacheKey = getCacheKey(userId);

  // Check cache
  const cachedTasks = cache.get(cacheKey);
  if (cachedTasks) {
    return res.json({ success: true, data: cachedTasks, cached: true });
  }

  const userTasks = tasks.filter((t) => t.userId === userId);
  
  // Set cache
  cache.set(cacheKey, userTasks);
  
  res.json({ success: true, data: userTasks, cached: false });
};

export const createTask = (req, res) => {
  const userId = req.user.id;
  const { title } = req.body;

  if (!title) throw new ApiError(400, "Title is required");

  const newTask = {
    id: Date.now().toString(),
    userId,
    title,
    completed: false,
    createdAt: new Date()
  };

  tasks.push(newTask);
  
  // Invalidate cache
  cache.del(getCacheKey(userId));
  
  res.status(201).json({ success: true, data: newTask });
};

export const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const userId = req.user.id;

  const taskIndex = tasks.findIndex((t) => t.id === id && t.userId === userId);
  if (taskIndex === -1) throw new ApiError(404, "Task not found");

  if (title !== undefined) tasks[taskIndex].title = title;
  if (completed !== undefined) tasks[taskIndex].completed = completed;

  // Invalidate cache
  cache.del(getCacheKey(userId));

  res.json({ success: true, data: tasks[taskIndex] });
};

export const deleteTask = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const taskIndex = tasks.findIndex((t) => t.id === id && t.userId === userId);
  if (taskIndex === -1) throw new ApiError(404, "Task not found");

  tasks.splice(taskIndex, 1);
  
  // Invalidate cache
  cache.del(getCacheKey(userId));
  
  res.json({ success: true, message: "Task deleted successfully" });
};
