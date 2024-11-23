import React, { useState } from "react";
import { format } from "date-fns";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
}

type TaskStatus = "Pending" | "In Progress" | "Completed";

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const COLUMNS: { [key in TaskStatus]: { title: string; color: string } } = {
  Pending: { title: "Pending", color: "bg-yellow-50/90" },
  "In Progress": { title: "In Progress", color: "bg-blue-50/90" },
  Completed: { title: "Completed", color: "bg-green-50/90" },
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
}) => {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask) {
      onUpdateTaskStatus(draggedTask, status);
      setDraggedTask(null);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <>
      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No tasks found. Create a new task to get started!
          </p>
        </div>
      ) : (
        <div className="flex gap-4 h-full min-h-screen p-4 overflow-x-auto">
          {Object.entries(COLUMNS).map(([status, column]) => (
            <div
              key={status}
              className="flex-1"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status as TaskStatus)}
            >
              <div className={`rounded-lg p-4 ${column.color} h-full`}>
                <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
                <div className="space-y-4">
                  {getTasksByStatus(status as TaskStatus).map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={`rounded-lg shadow-sm cursor-move
                    hover:shadow-md transition-shadow duration-200 ease-in-out
                    ${draggedTask === task.id ? "opacity-50" : "opacity-100"}`}
                    >
                      <TaskCard
                        task={task}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default KanbanBoard;
