import { useEffect } from "react"
import { useDataStore } from "../../stores/dataStore"

export default function Home() {
  const getTodayRecord = useDataStore((s) => s.getTodayRecord)
  const toggleHabit = useDataStore((s) => s.toggleHabit)
  const records = useDataStore((s) => s.records)

  // 🧪 仮のRoutineSet
  const routineSet = {
    id: "default-set",
    habits: [
      { id: "h1", title: "腕立て" },
      { id: "h2", title: "英単語" },
      { id: "h3", title: "ストレッチ" },
    ],
  }

  // 🧠 初回ロードでrecord生成
  useEffect(() => {
    getTodayRecord(routineSet.id)
  }, [])

  const todayRecord = records.find(
    (r) => r.date === new Date().toISOString().slice(0, 10)
  )

  if (!todayRecord) return <div>loading...</div>

  return (
    <div style={{ padding: 16 }}>
      <h2>今日のやること</h2>

      {/* 📊 達成率 */}
      <div style={{ marginBottom: 16 }}>
        <strong>{Math.round(todayRecord.achievementRate)}%</strong>
        <span>（{todayRecord.status}）</span>
      </div>

      {/* 📋 Habit一覧 */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {routineSet.habits.map((habit) => {
          const checked = todayRecord.completedHabits.includes(habit.id)

          return (
            <li
              key={habit.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  toggleHabit(
                    habit.id,
                    routineSet.habits.length,
                    routineSet.id
                  )
                }
              />
              <span
                style={{
                  marginLeft: 8,
                  textDecoration: checked ? "line-through" : "none",
                }}
              >
                {habit.title}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}