import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { DailyRecord } from "../features/records/types"
import type { RoutineSet } from "../features/sets/types"
import type { Habit } from "../features/Habit/types"
import type { Schedule } from "../features/schedules/types"
import {
  getOrCreateRecord,
  toggleHabit as toggleHabitUtil,
} from "../features/records/utils"

import { getToday, getDayOfWeek } from "../lib/date"
import { generateId } from "../lib/id"

type DataState = {
  sets: RoutineSet[]
  schedules: Schedule[]
  records: DailyRecord[]

  // 今日だけのパターン上書き
  overrideSetId: string | null
  overrideDate: string | null

  // --- RoutineSet actions ---
  addSet: (newSet: RoutineSet) => void
  updateSet: (id: string, updated: Partial<Omit<RoutineSet, "id">>) => void
  deleteSet: (id: string) => void
  addHabitToSet: (setId: string, title: string) => void
  removeHabitFromSet: (setId: string, habitId: string) => void

  // --- Schedule actions ---
  addSchedule: (newSchedule: Schedule) => void
  setScheduleForDay: (dayOfWeek: number, routineSetId: string) => void
  clearScheduleForDay: (dayOfWeek: number) => void

  // --- Override actions ---
  setOverride: (setId: string | null) => void

  // --- Record actions ---
  getTodayRecord: (routineSetId: string) => DailyRecord
  toggleHabit: (
    habitId: string,
    totalHabits: number,
    routineSetId: string
  ) => void

  // --- Computed helpers ---
  getSetForToday: () => RoutineSet | null
  getSetForDay: (dayOfWeek: number) => RoutineSet | null
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      sets: [],
      schedules: [],
      records: [],
      overrideSetId: null,
      overrideDate: null,

      // === RoutineSet ===
      addSet: (newSet) =>
        set((state) => ({ sets: [...state.sets, newSet] })),

      updateSet: (id, updated) =>
        set((state) => ({
          sets: state.sets.map((s) =>
            s.id === id ? { ...s, ...updated } : s
          ),
        })),

      deleteSet: (id) =>
        set((state) => ({
          sets: state.sets.filter((s) => s.id !== id),
          // スケジュールからも削除
          schedules: state.schedules.filter((sc) => sc.routineSetId !== id),
        })),

      addHabitToSet: (setId, title) => {
        const habit: Habit = { id: generateId(), title }
        set((state) => ({
          sets: state.sets.map((s) =>
            s.id === setId
              ? { ...s, habits: [...s.habits, habit] }
              : s
          ),
        }))
      },

      removeHabitFromSet: (setId, habitId) =>
        set((state) => ({
          sets: state.sets.map((s) =>
            s.id === setId
              ? { ...s, habits: s.habits.filter((h) => h.id !== habitId) }
              : s
          ),
        })),

      // === Schedule ===
      addSchedule: (newSchedule) =>
        set((state) => ({ schedules: [...state.schedules, newSchedule] })),

      setScheduleForDay: (dayOfWeek, routineSetId) =>
        set((state) => {
          // 既存の同じ曜日のスケジュールを除去して置き換え
          const filtered = state.schedules.filter(
            (sc) => sc.dayOfWeek !== dayOfWeek
          )
          return {
            schedules: [
              ...filtered,
              { contextId: "", dayOfWeek, routineSetId },
            ],
          }
        }),

      clearScheduleForDay: (dayOfWeek) =>
        set((state) => ({
          schedules: state.schedules.filter(
            (sc) => sc.dayOfWeek !== dayOfWeek
          ),
        })),

      // === Override ===
      setOverride: (setId) => {
        const today = getToday()
        set({ overrideSetId: setId, overrideDate: today })
      },

      // === Record ===
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

      // === Computed helpers ===
      getSetForToday: () => {
        const { sets, schedules, overrideSetId, overrideDate } = get()
        const today = getToday()

        // 上書きが今日のものならそれを使う
        if (overrideSetId && overrideDate === today) {
          const override = sets.find((s) => s.id === overrideSetId)
          if (override) return override
        }

        // 日付が変わったら上書きをリセット
        if (overrideDate && overrideDate !== today) {
          set({ overrideSetId: null, overrideDate: null })
        }

        const dayOfWeek = getDayOfWeek()
        const schedule = schedules.find((sc) => sc.dayOfWeek === dayOfWeek)
        if (!schedule) return null

        return sets.find((s) => s.id === schedule.routineSetId) ?? null
      },

      getSetForDay: (dayOfWeek) => {
        const { sets, schedules } = get()
        const schedule = schedules.find((sc) => sc.dayOfWeek === dayOfWeek)
        if (!schedule) return null
        return sets.find((s) => s.id === schedule.routineSetId) ?? null
      },
    }),
    {
      name: "habit-app-storage",
    }
  )
)