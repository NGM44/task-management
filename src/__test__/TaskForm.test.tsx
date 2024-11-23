
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Task, TaskStatus } from '../types/task';
import TaskForm from '../components/TaskForms';


const renderForm = async (props: any) => {
  const result = render(<TaskForm {...props} />);
  await new Promise(resolve => setTimeout(resolve, 0));
  return result;
};

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const user = userEvent.setup({ delay: null });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  const sampleTask: Partial<Task> = {
    title: 'Test Task',
    description: 'Test Description',
    status: 'Pending' as TaskStatus,
    dueDate: '2024-12-31',
  };

  describe('Rendering', () => {
    it('should render all form fields', async () => {
      await renderForm({ onSubmit: mockOnSubmit });

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
    });

    it('should render cancel button when onCancel prop is provided', async () => {
      await renderForm({ onSubmit: mockOnSubmit, onCancel: mockOnCancel });
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should render with initial values when provided', async () => {
      await renderForm({ onSubmit: mockOnSubmit, initialValues: sampleTask });

      expect(screen.getByLabelText(/title/i)).toHaveValue(sampleTask.title);
      expect(screen.getByLabelText(/description/i)).toHaveValue(sampleTask.description);
      expect(screen.getByLabelText(/status/i)).toHaveValue(sampleTask.status);
      expect(screen.getByLabelText(/due date/i)).toHaveValue(sampleTask.dueDate);
    });
  });

  describe('Form Validation', () => {
    it('should show error message when title is empty', async () => {
      await renderForm({ onSubmit: mockOnSubmit });

      await user.click(screen.getByRole('button', { name: /create task/i }));

      expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    });

    it('should show error message when due date is empty', async () => {
      await renderForm({ onSubmit: mockOnSubmit });

      await user.click(screen.getByRole('button', { name: /create task/i }));

      expect(await screen.findByText(/due date is required/i)).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should handle title input change', async () => {
      await renderForm({ onSubmit: mockOnSubmit });

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'New Task');

      expect(titleInput).toHaveValue('New Task');
    });

    it('should handle description input change', async () => {
      await renderForm({ onSubmit: mockOnSubmit });

      const descriptionInput = screen.getByLabelText(/description/i);
      await user.type(descriptionInput, 'New Description');

      expect(descriptionInput).toHaveValue('New Description');
    });

    it('should handle status selection change', async () => {
      await renderForm({ onSubmit: mockOnSubmit });

      await user.selectOptions(screen.getByRole('combobox'), 'In Progress');

      expect(screen.getByRole('combobox')).toHaveValue('In Progress');
    });

    it('should handle due date input change', async () => {
      await renderForm({ onSubmit: mockOnSubmit });

      const dateInput = screen.getByRole('date');
      await user.type(dateInput, '2024-12-31');

      expect(dateInput).toHaveValue('2024-12-31');
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form values when form is valid', async () => {
      await renderForm({ onSubmit: mockOnSubmit });


      await user.type(screen.getByLabelText(/title/i), 'New Task');
      await user.type(screen.getByLabelText(/description/i), 'New Description');
      await user.selectOptions(screen.getByRole('combobox'), 'In Progress');
      await user.type(screen.getByRole('date'), '2024-12-31');

      await user.click(screen.getByRole('button', { name: /create task/i }));

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        status: 'In Progress',
        dueDate: '2024-12-31',
      });
    });

    it('should not call onSubmit when form is invalid', async () => {
      await renderForm({ onSubmit: mockOnSubmit });

      await user.click(screen.getByRole('button', { name: /create task/i }));

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should reset form after successful submission', async () => {
      await renderForm({ onSubmit: mockOnSubmit });


      await user.type(screen.getByLabelText(/title/i), 'New Task');
      await user.type(screen.getByLabelText(/description/i), 'New Description');
      await user.type(screen.getByRole('date'), '2024-12-31');
      await user.click(screen.getByRole('button', { name: /create task/i }));

      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
      expect(screen.getByRole('date')).toHaveValue('');
    });
  });

  describe('Cancel Button', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      await renderForm({ onSubmit: mockOnSubmit, onCancel: mockOnCancel });

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });
});