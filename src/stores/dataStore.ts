import { create } from "zustand"
import { persist } from "zustand/middleware"

type DataState = {
  sets: any[]
  contexts: any[]
  schedules: any[]
  records: any[]

  addRecord: (record: any) => void
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      sets: [],
      contexts: [],
      schedules: [],
      records: [],

      addRecord: (record) =>
        set((state) => ({
          records: [...state.records, record],
        })),
    }),
    {
      name: "habit-app",
    }
  )
)