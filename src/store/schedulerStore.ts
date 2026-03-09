import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useExecutionStore } from './executionStore';

export interface Schedule {
  id: string;
  name: string;
  cronExpression: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  graphId: string;
  bulkConfig?: {
    iterations: number;
    delay: number;
  };
}

interface SchedulerState {
  schedules: Schedule[];
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  removeSchedule: (id: string) => void;
  toggleSchedule: (id: string) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
}

export const useSchedulerStore = create<SchedulerState>()(
  persist(
    (set) => ({
      schedules: [],
      addSchedule: (schedule) =>
        set((state) => ({
          schedules: [...state.schedules, { ...schedule, id: Math.random().toString() }],
        })),
      removeSchedule: (id) =>
        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== id),
        })),
      toggleSchedule: (id) =>
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
          ),
        })),
      updateSchedule: (id, updates) =>
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
    }),
    {
      name: 'scheduler-storage',
    }
  )
);