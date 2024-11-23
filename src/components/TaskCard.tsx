// import { useState } from "react";
import { useState } from "react";
import { Task } from "../types/task";
import { StatusBadge } from "./StatusBodge";
import { Calendar, Edit2, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 leading-tight">
              {task.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>
          </div>
          <StatusBadge status={task.status} />
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={14} className="mr-2" />
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>

        <div
          className={`
            absolute right-4 bottom-4
            hidden group-hover:flex gap-2
            md:hidden md:group-hover:flex
            touch:flex
          `}
        >
          <button
            onClick={() => onEdit(task)}
            className="flex items-center p-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 active:bg-blue-200 touch-manipulation"
            aria-label="Edit task"
          >
            <Edit2 className="mr-2" size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="flex items-center p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 active:bg-red-200 touch-manipulation"
            aria-label="Delete task"
          >
            <Trash2 className="mr-2" size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
