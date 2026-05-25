import { useState } from "react"
import { useDataStore } from "../../stores/dataStore"
import { generateId } from "../../lib/id"

export default function Daily() {
  const sets = useDataStore((s) => s.sets)
  const addSet = useDataStore((s) => s.addSet)
  const updateSet = useDataStore((s) => s.updateSet)
  const deleteSet = useDataStore((s) => s.deleteSet)
  const addHabitToSet = useDataStore((s) => s.addHabitToSet)
  const removeHabitFromSet = useDataStore((s) => s.removeHabitFromSet)

  const [newSetName, setNewSetName] = useState("")
  const [newHabitTexts, setNewHabitTexts] = useState<Record<string, string>>({})
  const [editingSetId, setEditingSetId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  // 新規パターン作成
  const handleCreateSet = () => {
    const name = newSetName.trim()
    if (!name) return
    addSet({ id: generateId(), name, habits: [] })
    setNewSetName("")
  }

  // パターン名の編集開始
  const startEditName = (id: string, currentName: string) => {
    setEditingSetId(id)
    setEditingName(currentName)
  }

  // パターン名の編集確定
  const confirmEditName = (id: string) => {
    const name = editingName.trim()
    if (name) {
      updateSet(id, { name })
    }
    setEditingSetId(null)
    setEditingName("")
  }

  // タスク追加
  const handleAddHabit = (setId: string) => {
    const text = (newHabitTexts[setId] ?? "").trim()
    if (!text) return
    addHabitToSet(setId, text)
    setNewHabitTexts((prev) => ({ ...prev, [setId]: "" }))
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>1日のパターン管理</h2>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 16 }}>
        「平日」「休日」などのパターンを作って、それぞれにやることを追加してください。
      </p>

      {/* 新規パターン作成 */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
        }}
      >
        <input
          type="text"
          value={newSetName}
          onChange={(e) => setNewSetName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateSet()}
          placeholder="新しいパターン名（例：平日）"
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: 6,
            fontSize: 14,
          }}
        />
        <button
          onClick={handleCreateSet}
          style={{
            padding: "8px 16px",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          作成
        </button>
      </div>

      {/* パターン無し */}
      {sets.length === 0 && (
        <p style={{ textAlign: "center", color: "#999" }}>
          パターンがまだありません。上のフォームから作成してください。
        </p>
      )}

      {/* パターン一覧 */}
      {sets.map((routineSet) => (
        <div
          key={routineSet.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        >
          {/* パターンヘッダー */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            {editingSetId === routineSet.id ? (
              <div style={{ display: "flex", gap: 4, flex: 1 }}>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && confirmEditName(routineSet.id)
                  }
                  style={{
                    flex: 1,
                    padding: "4px 8px",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    fontSize: 16,
                  }}
                  autoFocus
                />
                <button
                  onClick={() => confirmEditName(routineSet.id)}
                  style={{ fontSize: 12, padding: "4px 8px" }}
                >
                  保存
                </button>
                <button
                  onClick={() => setEditingSetId(null)}
                  style={{ fontSize: 12, padding: "4px 8px" }}
                >
                  取消
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ margin: 0, fontSize: 18 }}>
                  {routineSet.name}
                  <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>
                    ({routineSet.habits.length}個のタスク)
                  </span>
                </h3>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={() =>
                      startEditName(routineSet.id, routineSet.name)
                    }
                    style={{ fontSize: 12, padding: "4px 8px" }}
                  >
                    名前変更
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `「${routineSet.name}」を削除しますか？`
                        )
                      ) {
                        deleteSet(routineSet.id)
                      }
                    }}
                    style={{
                      fontSize: 12,
                      padding: "4px 8px",
                      color: "#e53935",
                    }}
                  >
                    削除
                  </button>
                </div>
              </>
            )}
          </div>

          {/* タスク一覧 */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {routineSet.habits.map((habit) => (
              <li
                key={habit.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <span>{habit.title}</span>
                <button
                  onClick={() => removeHabitFromSet(routineSet.id, habit.id)}
                  style={{
                    fontSize: 12,
                    padding: "2px 8px",
                    color: "#e53935",
                    background: "none",
                    border: "1px solid #e53935",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>

          {/* タスク追加 */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              type="text"
              value={newHabitTexts[routineSet.id] ?? ""}
              onChange={(e) =>
                setNewHabitTexts((prev) => ({
                  ...prev,
                  [routineSet.id]: e.target.value,
                }))
              }
              onKeyDown={(e) =>
                e.key === "Enter" && handleAddHabit(routineSet.id)
              }
              placeholder="新しいタスク名"
              style={{
                flex: 1,
                padding: "6px 10px",
                border: "1px solid #ccc",
                borderRadius: 4,
                fontSize: 14,
              }}
            />
            <button
              onClick={() => handleAddHabit(routineSet.id)}
              style={{
                padding: "6px 12px",
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              追加
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
