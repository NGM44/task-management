import { act } from "react-dom/test-utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useTaskStore } from "../store/taskStore";
import { Task, TaskStatus } from "../types/task";

const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
const mockCrypto = {
    randomUUID: () => mockUUID,
} as unknown as Crypto;

const mockDate = '2024-01-01T00:00:00.000Z';

const waitForStateUpdate = () => new Promise(resolve => setTimeout(resolve, 0));

describe('TaskStore', () => {
  const originalCrypto = global.crypto;

  beforeEach(() => {
    localStorage.clear();
    useTaskStore.setState({ tasks: [] });
    global.crypto = mockCrypto;
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    global.crypto = originalCrypto;
  });

  const sampleTask: Omit<Task, 'id' | 'createdAt'> = {
    title: 'Test Task',
    description: 'Test Description',
    status: 'Pending',
    dueDate: '2024-12-31T23:59:59.999Z',
  };

  describe('addTask', () => {
    it('should add a new task with generated id and createdAt', async () => {
      useTaskStore.getState().addTask(sampleTask);
      await waitForStateUpdate();

      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0]).toEqual({
        ...sampleTask,
        id: mockUUID,
        createdAt: mockDate,
      });
    });

    it('should add task without optional description', async () => {
      const taskWithoutDescription: Omit<Task, 'id' | 'createdAt' | 'description'> = {
        title: 'Task without description',
        status: 'Pending',
        dueDate: '2024-12-31T23:59:59.999Z',
      };

      useTaskStore.getState().addTask(taskWithoutDescription);
      await waitForStateUpdate();

      const state = useTaskStore.getState();
      expect(state.tasks[0].description).toBeUndefined();
      expect(state.tasks[0].title).toBe('Task without description');
    });

    it('should maintain task order when adding multiple tasks', async () => {
      const task1 = { ...sampleTask, title: 'Task 1' };
      const task2 = { ...sampleTask, title: 'Task 2' };

      useTaskStore.getState().addTask(task1);
      await waitForStateUpdate();
      useTaskStore.getState().addTask(task2);
      await waitForStateUpdate();

      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(2);
      expect(state.tasks[0].title).toBe('Task 1');
      expect(state.tasks[1].title).toBe('Task 2');
    });
  });

  describe('updateTask', () => {
    it('should update task status', async () => {
      useTaskStore.getState().addTask(sampleTask);
      await waitForStateUpdate();

      useTaskStore.getState().updateTask(mockUUID, {
        status: 'In Progress',
      });
      await waitForStateUpdate();

      const state = useTaskStore.getState();
      expect(state.tasks[0].status).toBe('In Progress');
    });

    it('should update multiple fields simultaneously', async () => {
      useTaskStore.getState().addTask(sampleTask);
      await waitForStateUpdate();

      const updateData: Partial<Task> = {
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'Completed',
        dueDate: '2025-01-01T00:00:00.000Z',
      };

      useTaskStore.getState().updateTask(mockUUID, updateData);
      await waitForStateUpdate();

      const state = useTaskStore.getState();
      expect(state.tasks[0]).toEqual({
        ...updateData,
        id: mockUUID,
        createdAt: mockDate,
      });
    });

    it('should not modify createdAt when updating task', async () => {
      useTaskStore.getState().addTask(sampleTask);
      await waitForStateUpdate();

      useTaskStore.getState().updateTask(mockUUID, {
        title: 'Updated Title',
      });
      await waitForStateUpdate();

      const state = useTaskStore.getState();
      expect(state.tasks[0].createdAt).toBe(mockDate);
    });

    it('should not update task if id does not exist', async () => {
      useTaskStore.getState().addTask(sampleTask);
      await waitForStateUpdate();

      const initialState = useTaskStore.getState();

      useTaskStore.getState().updateTask('non-existent-id', {
        title: 'Updated Title',
      });
      await waitForStateUpdate();

      const finalState = useTaskStore.getState();
      expect(finalState.tasks).toEqual(initialState.tasks);
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', async () => {
      useTaskStore.getState().addTask(sampleTask);
      await waitForStateUpdate();

      expect(useTaskStore.getState().tasks).toHaveLength(1);

      useTaskStore.getState().deleteTask(mockUUID);
      await waitForStateUpdate();

      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });

    it('should not modify state if task id does not exist', async () => {
      useTaskStore.getState().addTask(sampleTask);
      await waitForStateUpdate();

      const initialState = useTaskStore.getState();

      useTaskStore.getState().deleteTask('non-existent-id');
      await waitForStateUpdate();

      expect(useTaskStore.getState().tasks).toEqual(initialState.tasks);
    });
  });

  describe('persistence', () => {
    it('should persist tasks to localStorage', async () => {
      useTaskStore.getState().addTask(sampleTask);
      await waitForStateUpdate();

      const persistedData = JSON.parse(
        localStorage.getItem('task-storage') || '{}'
      );

      expect(persistedData.state.tasks).toHaveLength(1);
      expect(persistedData.state.tasks[0]).toEqual({
        ...sampleTask,
        id: mockUUID,
        createdAt: mockDate,
      });
    });

    it('should hydrate state from localStorage', async () => {
      const initialState = {
        state: {
          tasks: [{
            ...sampleTask,
            id: mockUUID,
            createdAt: mockDate,
          }]
        },
        version: 0
      };
      
      localStorage.setItem('task-storage', JSON.stringify(initialState));

      const testStore = create(
        persist(
          (set) => ({
            tasks: [],
            addTask: (task: Omit<Task, 'id' | 'createdAt'>) =>
              set((state:any) => ({
                tasks: [
                  ...state.tasks,
                  {
                    ...task,
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                  },
                ],
              })),
            updateTask: (id: string, updatedTask: Partial<Task>) =>
              set((state:any) => ({
                tasks: state.tasks.map((task:any) =>
                  task.id === id ? { ...task, ...updatedTask } : task
                ),
              })),
            deleteTask: (id: string) =>
              set((state:any) => ({
                tasks: state.tasks.filter((task:any) => task.id !== id),
              })),
          }),
          {
            name: 'task-storage',
          }
        )
      );

      await waitForStateUpdate();

      const state:any = testStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0]).toEqual({
        ...sampleTask,
        id: mockUUID,
        createdAt: mockDate,
      });
    });

    it('should update localStorage when task is modified', async () => {
      useTaskStore.getState().addTask(sampleTask);
      await waitForStateUpdate();

      useTaskStore.getState().updateTask(mockUUID, {
        status: 'Completed',
      });
      await waitForStateUpdate();

      const persistedData = JSON.parse(
        localStorage.getItem('task-storage') || '{}'
      );
      expect(persistedData.state.tasks[0].status).toBe('Completed');
    });
  });
});