import type { DailyRecord, RecordStatus } from "./types"

export function createEmptyRecord(
  date: string,
  routineSetId: string
): DailyRecord {
  return {
    date,
    routineSetId,
    completedHabits: [],
    status: "none",
    achievementRate: 0,
  }
}

export function calcAchievement(total: number, done: number) {
  const rate = total === 0 ? 0 : (done / total) * 100

  if (done === 0) return { rate, status: "none" }
  if (done === total) return { rate, status: "complete" }
  return { rate, status: "partial" }
}

export function toggleHabit(
  record: DailyRecord,
  habitId: string,
  totalHabits: number
): DailyRecord {
  const exists = record.completedHabits.includes(habitId)

  const updatedHabits = exists
    ? record.completedHabits.filter((id) => id !== habitId)
    : [...record.completedHabits, habitId]

  const { rate, status: state } = calcAchievement(
    totalHabits,
    updatedHabits.length
  ) as { rate: number; status: RecordStatus }

  return {
    ...record,
    completedHabits: updatedHabits,
    achievementRate: rate,
    status: state,
  }
}

export function getOrCreateRecord(
  records: DailyRecord[],
  date: string,
  routineSetId: string
): DailyRecord {
  const existing = records.find((r) => r.date === date)

  if (existing) return existing

  return createEmptyRecord(date, routineSetId)
}

/** 特定の日付のレコードを取得（なければ undefined） */
export function getRecordByDate(
  records: DailyRecord[],
  date: string
): DailyRecord | undefined {
  return records.find((r) => r.date === date)
}
