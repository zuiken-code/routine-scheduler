import { useDataStore } from "../../stores/dataStore"
import { useUIStore } from "../../stores/uiStore"
import { formatDate, getDayOfWeek, getDayLabel } from "../../lib/date"

export default function Home() {
  const sets = useDataStore((s) => s.sets)
  const records = useDataStore((s) => s.records)
  const toggleHabit = useDataStore((s) => s.toggleHabit)
  const getTodayRecord = useDataStore((s) => s.getTodayRecord)
  const getSetForToday = useDataStore((s) => s.getSetForToday)
  const setOverride = useDataStore((s) => s.setOverride)
  const overrideSetId = useDataStore((s) => s.overrideSetId)
  const overrideDate = useDataStore((s) => s.overrideDate)

  const currentDate = useUIStore((s) => s.currentDate)
  const updateCurrentDate = useUIStore((s) => s.updateCurrentDate)

  const today = currentDate
  const dayOfWeek = getDayOfWeek(today)
  const todaySet = getSetForToday()

  // 今日のレコードを取得/作成
  if (todaySet) {
    getTodayRecord(todaySet.id)
  }

  const todayRecord = records.find((r) => r.date === today)

  // 上書きが有効か
  const isOverridden = overrideSetId !== null && overrideDate === today

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h2 style={{ margin: 0 }}>今日のやること</h2>
        <button
          onClick={updateCurrentDate}
          style={{
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 4,
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer"
          }}
        >
          日付を更新
        </button>
      </div>
      <p style={{ color: "#888", marginBottom: 8 }}>
        {formatDate(today)}（{getDayLabel(dayOfWeek)}曜日）
      </p>

      {/* パターン未設定 */}
      {!todaySet && (
        <div style={{ padding: 24, textAlign: "center", color: "#999" }}>
          <p>今日のスケジュールが設定されていません。</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>
            「週間」タブで曜日ごとのパターンを設定してください。
          </p>
        </div>
      )}

      {/* パターンあり */}
      {todaySet && (
        <>
          {/* パターン表示 + 変更 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 14, color: "#666" }}>
              パターン: <strong>{todaySet.name}</strong>
              {isOverridden && " (手動変更中)"}
            </span>
            {/* パターン変更セレクト */}
            <select
              value={todaySet.id}
              onChange={(e) => {
                const val = e.target.value
                setOverride(val === "" ? null : val)
              }}
              style={{ fontSize: 14, padding: "2px 6px" }}
            >
              {sets.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {isOverridden && (
              <button
                onClick={() => setOverride(null)}
                style={{ fontSize: 12, padding: "2px 8px" }}
              >
                元に戻す
              </button>
            )}
          </div>

          {/* 達成率 */}
          {todayRecord && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <strong style={{ fontSize: 24 }}>
                  {Math.round(todayRecord.achievementRate)}%
                </strong>
                <span style={{ fontSize: 14, color: "#888" }}>
                  ({todayRecord.completedHabits.length}/{todaySet.habits.length}
                  完了)
                </span>
              </div>
              {/* プログレスバー */}
              <div
                style={{
                  width: "100%",
                  height: 8,
                  background: "#e0e0e0",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${todayRecord.achievementRate}%`,
                    height: "100%",
                    background:
                      todayRecord.status === "complete"
                        ? "#4caf50"
                        : todayRecord.status === "partial"
                        ? "#ff9800"
                        : "#e0e0e0",
                    borderRadius: 4,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}

          {/* タスク一覧が空 */}
          {todaySet.habits.length === 0 && (
            <p style={{ color: "#999", fontSize: 14 }}>
              このパターンにはまだタスクがありません。「1日」タブでタスクを追加してください。
            </p>
          )}

          {/* Habit一覧 */}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {todaySet.habits.map((habit) => {
              const checked =
                todayRecord?.completedHabits.includes(habit.id) ?? false

              return (
                <li
                  key={habit.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      toggleHabit(
                        habit.id,
                        todaySet.habits.length,
                        todaySet.id
                      )
                    }
                    style={{
                      width: 20,
                      height: 20,
                      cursor: "pointer",
                    }}
                  />
                  <span
                    style={{
                      marginLeft: 12,
                      fontSize: 16,
                      textDecoration: checked ? "line-through" : "none",
                      color: checked ? "#aaa" : "#333",
                    }}
                  >
                    {habit.title}
                  </span>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}