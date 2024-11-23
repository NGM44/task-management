import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Task } from "../types/task";
import { Calendar, CheckSquare, AlignLeft, Type } from "lucide-react";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  status: Yup.string()
    .oneOf(["Pending", "In Progress", "Completed"])
    .required(),
  dueDate: Yup.date().required("Due date is required"),
});

interface TaskFormProps {
  initialValues?: Partial<Task>;
  onSubmit: (values: Omit<Task, "id" | "createdAt">) => void;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      status: initialValues?.status || "Pending",
      dueDate: initialValues?.dueDate || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
  });

  return (
    <div className="max-w-md">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Type className="w-4 h-4" />
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter task title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            {...formik.getFieldProps("title")}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm animate-[fadeIn_0.2s_ease-in-out]">
              {formik.errors.title}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <AlignLeft className="w-4 h-4" />
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter task description"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 min-h-[100px] resize-y"
            {...formik.getFieldProps("description")}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="status"
            className="flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <CheckSquare className="w-4 h-4" />
            Status
          </label>
          <select
            id="status"
            role="combobox"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
            {...formik.getFieldProps("status")}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="dueDate"
            className="flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Calendar className="w-4 h-4" />
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            role="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            {...formik.getFieldProps("dueDate")}
          />
          {formik.touched.dueDate && formik.errors.dueDate && (
            <div className="text-red-500 text-sm animate-[fadeIn_0.2s_ease-in-out]">
              {formik.errors.dueDate}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
        {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            role="button"
            className="flex-1 whitespace-nowrap bg-[#BFA062] text-white px-6 py-2 rounded-md hover:bg-[#BFA062]/80 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {initialValues ? "Update Task" : "Create Task"}
          </button>
        
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
