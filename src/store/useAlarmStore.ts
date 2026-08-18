import { create } from 'zustand'
import type { AlarmRecord } from '@/types'
import { mockAlarms } from '@/services/mock/data'

interface AlarmStore {
  alarms: AlarmRecord[]
  selectedAlarmId: string | null
  setSelectedAlarm: (id: string | null) => void
  markAsResolved: (id: string) => void
  deleteAlarm: (id: string) => void
  getAlarmById: (id: string) => AlarmRecord | undefined
}

export const useAlarmStore = create<AlarmStore>((set, get) => ({
  alarms: mockAlarms,
  selectedAlarmId: null,

  setSelectedAlarm: (id) => set({ selectedAlarmId: id }),

  markAsResolved: (id) =>
    set((state) => ({
      alarms: state.alarms.map((a) =>
        a.id === id ? { ...a, status: 'resolved' as const } : a,
      ),
    })),

  deleteAlarm: (id) =>
    set((state) => ({
      alarms: state.alarms.filter((a) => a.id !== id),
    })),

  getAlarmById: (id) => get().alarms.find((a) => a.id === id),
}))
