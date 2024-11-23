import { TaskStatus } from "../types/task";

interface TaskFilterProps {
  status: TaskStatus | "All";
  sortOrder: "asc" | "desc";
  onStatusChange: (status: TaskStatus | "All") => void;
  onSortChange: (order: "asc" | "desc") => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  status,
  sortOrder,
  onStatusChange,
  onSortChange,
}) => {
  return (
    <div className="flex gap-4">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as TaskStatus | "All")}
        className="p-2 py-1 border text-sm rounded"
      >
        <option value="All">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <button
        onClick={() => onSortChange(sortOrder === "asc" ? "desc" : "asc")}
        className="flex items-center space-x-1 px-4 py-1 border rounded"
      >
        <span className="text-sm whitespace-nowrap">Due Date</span>
        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
      </button>
    </div>
  );
};
