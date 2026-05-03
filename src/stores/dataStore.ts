import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { DailyRecord } from "../features/records/types"
import type { RoutineSet } from "../features/sets/types"
import type { Schedule } from "../features/schedules/types"
import {
  getOrCreateRecord,
  toggleHabit as toggleHabitUtil,
} from "../features/records/utils"

import { getToday } from "../lib/date"

type DataState = {
  sets: RoutineSet[]
  schedules: Schedule[]
  records: DailyRecord[]

  // actions
  addSet: (newSet: RoutineSet) => void
  addSchedule: (newSchedule: Schedule) => void
  getTodayRecord: (routineSetId: string) => DailyRecord
  toggleHabit: (
    habitId: string,
    totalHabits: number,
    routineSetId: string
  ) => void
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      sets: [],
      schedules: [],
      records: [],

      addSet: (newSet) =>
        set((state) => ({ sets: [...state.sets, newSet] })),
      addSchedule: (newSchedule) =>
        set((state) => ({ schedules: [...state.schedules, newSchedule] })),

      // 🧠 今日のrecord取得 or 作成
      getTodayRecord: (routineSetId) => {
        const date = getToday()
        const { records } = get()

        const record = getOrCreateRecord(records, date, routineSetId)

        // まだ存在してなかったら追加
        if (!records.find((r) => r.date === date)) {
          set({
            records: [...records, record],
          })
        }

        return record
      },

      // 🔥 Habitチェック切り替え
      toggleHabit: (habitId, totalHabits, routineSetId) => {
        const date = getToday()
        const { records } = get()

        const record = getOrCreateRecord(records, date, routineSetId)

        const updated = toggleHabitUtil(
          record,
          habitId,
          totalHabits
        )

        set({
          records: [
            ...records.filter((r) => r.date !== date),
            updated,
          ],
        })
      },
    }),
    {
      name: "habit-app-storage",
    }
  )
)