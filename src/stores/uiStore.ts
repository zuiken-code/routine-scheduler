import { create } from "zustand"
import { getToday } from "../lib/date"

type UIState = {
  currentContextId: string | null
  selectedDate: string
  currentDate: string

  setCurrentContext: (id: string) => void
  setSelectedDate: (date: string) => void
  updateCurrentDate: () => void
}

export const useUIStore = create<UIState>((set) => ({
  currentContextId: null,
  selectedDate: getToday(),
  currentDate: getToday(),

  setCurrentContext: (id) => set({ currentContextId: id }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  updateCurrentDate: () => {
    const today = getToday()
    set((state) => {
      if (state.currentDate !== today) {
        return { currentDate: today }
      }
      return state
    })
  },
}))