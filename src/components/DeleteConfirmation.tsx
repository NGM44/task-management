import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";

interface DeleteConfirmationProps {
  onDelete: (id: string) => void;
  onCancel: () => void;
  itemName?: string;
  id: string;
  confirmationText?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onDelete,
  onCancel,
  itemName = "this item",
  id,
  confirmationText = "delete",
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) setError(false);
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputValue.toLowerCase() === confirmationText.toLowerCase()) {
        onDelete(id);
        toast("Task Deleted Successfully",{
          type: "success",
          autoClose: 2000
        })
      } else {
        setError(true);
        setTimeout(() => setError(false), 2000);
      }
    },
    [inputValue, onDelete, confirmationText]
  );

  const isConfirmed =
    inputValue.toLowerCase() === confirmationText.toLowerCase();

  return (
    <div className="max-w-md w-full">
      <div className="space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          
          <p className="text-sm text-left text-gray-500">
            This action cannot be undone. To confirm deletion, please type{" "}
            <span className="font-mono font-bold">{confirmationText}</span>{" "}
            below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                ${
                  error
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              placeholder={`Type '${confirmationText}' to confirm`}
              aria-invalid={error}
              aria-describedby={error ? "error-message" : undefined}
            />
            {error && (
              <p
                id="error-message"
                className="text-sm text-red-500"
                role="alert"
              >
                Please type '{confirmationText}' to confirm
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  isConfirmed
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-200"
                    : "bg-red-400 cursor-not-allowed"
                }`}
              disabled={!isConfirmed}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
