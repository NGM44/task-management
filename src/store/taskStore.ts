import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task } from "../types/task";
import { investmentTasks } from "./dummyData";

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  addAllTask: (task: Task[]) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks:investmentTasks,
      addAllTask: (task) =>
        set((state) => ({
          tasks: task,
        })),
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: "task-storage",
    }
  )
);
