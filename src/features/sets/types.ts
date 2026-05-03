import type { Habit } from "../Habit/types"
import type { ID } from "../common/types"

export type RoutineSet = {
  id: ID
  name: string
  habits: Habit[]
}