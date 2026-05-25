import { useDataStore } from "../../stores/dataStore"
import { getDayLabel } from "../../lib/date"

const DAYS = [1, 2, 3, 4, 5, 6, 0] as const // 月〜土、日

export default function Weekly() {
  const sets = useDataStore((s) => s.sets)
  const schedules = useDataStore((s) => s.schedules)
  const setScheduleForDay = useDataStore((s) => s.setScheduleForDay)
  const clearScheduleForDay = useDataStore((s) => s.clearScheduleForDay)

  const getScheduleForDay = (day: number) =>
    schedules.find((sc) => sc.dayOfWeek === day)

  return (
    <div style={{ padding: 16 }}>
      <h2>週間スケジュール</h2>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 16 }}>
        各曜日にどのパターンを使うかを設定してください。
      </p>

      {sets.length === 0 && (
        <p style={{ textAlign: "center", color: "#999" }}>
          パターンがまだありません。先に「1日」タブでパターンを作成してください。
        </p>
      )}

      {sets.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DAYS.map((day) => {
            const schedule = getScheduleForDay(day)
            const currentSetId = schedule?.routineSetId ?? ""

            return (
              <div
                key={day}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  background: day === 0 || day === 6 ? "#fafafa" : "#fff",
                }}
              >
                {/* 曜日ラベル */}
                <span
                  style={{
                    width: 32,
                    fontWeight: "bold",
                    fontSize: 16,
                    color:
                      day === 0
                        ? "#e53935"
                        : day === 6
                        ? "#1e88e5"
                        : "#333",
                  }}
                >
                  {getDayLabel(day)}
                </span>

                {/* パターン選択 */}
                <select
                  value={currentSetId}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === "") {
                      clearScheduleForDay(day)
                    } else {
                      setScheduleForDay(day, val)
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    fontSize: 14,
                  }}
                >
                  <option value="">未設定</option>
                  {sets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}（{s.habits.length}個）
                    </option>
                  ))}
                </select>

                {/* 現在の割り当て表示 */}
                {schedule && (
                  <span style={{ fontSize: 12, color: "#4caf50" }}>✓</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
