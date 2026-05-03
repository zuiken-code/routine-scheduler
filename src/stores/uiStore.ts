import { create } from "zustand"

type UIState = {
  currentContextId: string | null
  selectedDate: string

  setCurrentContext: (id: string) => void
  setSelectedDate: (date: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  currentContextId: null,
  selectedDate: new Date().toISOString().slice(0, 10),

  setCurrentContext: (id) => set({ currentContextId: id }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}))