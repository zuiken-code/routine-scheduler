import type { DateString, ID } from "../common/types"

export type RecordStatus = "none" | "partial" | "complete"

export type DailyRecord = {
  date: DateString
  routineSetId: ID
  completedHabits: ID[]

  status: RecordStatus
  achievementRate: number
}