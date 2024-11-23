import { useCallback, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { Task, TaskStatus } from "../types/task";
import { toast } from "react-toastify";
import { Dialog } from "../components/DailogBox";
import TaskForm from "../components/TaskForms";
import DeleteConfirmation from "../components/DeleteConfirmation";
import { TaskFilter } from "../components/TaskFilters";
import { TaskList } from "../components/TaskList";
import { SearchBar } from "../components/Searchbar";
import KanbanBoard from "../components/KanbanBoard";
import { TaskTable } from "../components/TableView";

export default function DashboardPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "All">("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteId, setIsDeleteId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesSearch = searchQuery
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          )
        : true;

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const comparison =
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTaskSubmit = (values: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
      setEditingTask(null);
      toast("Task updated sucessfully", {
        type: "success",
        autoClose: 2000,
      });
      setIsDialogOpen(false);
    } else {
      toast("New Task Added sucessfully", {
        type: "success",
        autoClose: 2000,
      });
      addTask(values);
      setIsDialogOpen(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const deleteItem = (id: string) => {
    deleteTask(id);
    setIsDeleteId("");
    setIsDeleteDialogOpen(false);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const selectedTask = tasks.find((task) => task.id === taskId);
    updateTask(taskId, {
      ...selectedTask,
      status: newStatus,
    });

    toast("Task updated sucessfully", {
      type: "success",
      autoClose: 2000,
    });
  };
  const [viewMode, setViewMode] = useState("list");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-[#BFA062] pb-4">
        <div className="flex sm:flex-row flex-col sm:items-center items-start sm:space-x-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Premji Invest
            </h1>
            <img
              className="w-6 h-6 ml-2"
              src="data:image/jpeg;base64,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"
            />
          </div>

          <div className="sm:block hidden h-8 w-px bg-gray-200"></div>

          <p className="text-gray-600 font-medium">Task Management Dashboard</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center px-5 py-2.5 bg-[#BFA062] text-white rounded-lg hover:bg-[#BFA062]/90 transition-all shadow-sm hover:shadow-md"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Task
        </button>
      </div>

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm
          initialValues={editingTask || undefined}
          onSubmit={handleTaskSubmit}
          onCancel={handleCloseDialog}
        />
      </Dialog>
      <Dialog
        isOpen={isDeleteDialogOpen && !!isDeleteId}
        onClose={() => {
          setIsDeleteDialogOpen(false);
        }}
        title={"Delete this item"}
      >
        <DeleteConfirmation
          id={isDeleteId}
          onDelete={deleteItem}
          onCancel={() => {
            setIsDeleteDialogOpen(false);
            setIsDeleteId("");
          }}
        />
      </Dialog>

      <div className="mb-6 space-y-4"></div>

      <div>
        <div className="w-full bg-white border-b">
          <div className="block md:hidden p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg font-semibold">Task Board</h1>
                <p className="text-sm text-gray-600">
                  {filteredAndSortedTasks.length}{" "}
                  {filteredAndSortedTasks.length === 1 ? "task" : "tasks"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="text-sm border rounded-lg px-2 py-1 bg-gray-100"
                >
                  <option value="list">List</option>
                  <option value="table">Table</option>
                  <option value="kanban">Kanban</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <SearchBar onSearch={handleSearch} className="w-full" />
              <TaskFilter
                status={statusFilter}
                sortOrder={sortOrder}
                onStatusChange={setStatusFilter}
                onSortChange={setSortOrder}
              />
            </div>
          </div>

          <div className="hidden md:block lg:hidden p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-xl font-semibold">Task Board</h1>
                <p className="text-sm text-gray-600">
                  {filteredAndSortedTasks.length}{" "}
                  {filteredAndSortedTasks.length === 1 ? "task" : "tasks"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <SearchBar onSearch={handleSearch} className="w-64" />
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {["list", "table", "kanban"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors
                    ${
                      viewMode === mode
                        ? "bg-[#BFA062] text-white font-medium shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <TaskFilter
              status={statusFilter}
              sortOrder={sortOrder}
              onStatusChange={setStatusFilter}
              onSortChange={setSortOrder}
            />
          </div>

          <div className="hidden lg:flex justify-between items-center px-6 py-4">
            <div>
              <h1 className="text-xl font-semibold">Task Board</h1>
              <p className="text-sm text-gray-600">
                {filteredAndSortedTasks.length}{" "}
                {filteredAndSortedTasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <TaskFilter
                status={statusFilter}
                sortOrder={sortOrder}
                onStatusChange={setStatusFilter}
                onSortChange={setSortOrder}
              />
              <SearchBar onSearch={handleSearch} className="w-72" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View as:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {["list", "table", "kanban"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors
                    ${
                      viewMode === mode
                        ? "bg-[#BFA062] text-white font-medium shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {viewMode === "list" ? (
          <TaskList
            tasks={filteredAndSortedTasks}
            onEditTask={handleEditTask}
            onDeleteTask={(id: string) => {
              setIsDeleteId(id);
              setIsDeleteDialogOpen(true);
              // deleteTask
            }}
          />
        ) : viewMode === "table" ? (
          <TaskTable
            tasks={filteredAndSortedTasks}
            onEditTask={handleEditTask}
            onDeleteTask={(id: string) => {
              setIsDeleteId(id);
              setIsDeleteDialogOpen(true);
            }}
          />
        ) : (
          <KanbanBoard
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={(id: string) => {
              setIsDeleteId(id);
              setIsDeleteDialogOpen(true);
            }}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}
      </div>
    </div>
  );
}
