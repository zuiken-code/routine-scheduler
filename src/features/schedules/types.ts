import type { ID } from "../common/types"

export type Schedule = {
  contextId: ID
  dayOfWeek: number
  routineSetId: ID
}