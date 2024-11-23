import { Task } from "../types/task";

export const StatusBadge: React.FC<{ status: Task['status'] }> = ({ status }) => (
    <span className={`
      inline-block px-2 py-1 whitespace-nowrap text-sm rounded-full
      ${status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
        status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
        'bg-green-100 text-green-800'}
    `}>
      {status}
    </span>
  );