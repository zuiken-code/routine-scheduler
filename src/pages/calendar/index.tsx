import { useState, useMemo } from "react"
import { useDataStore } from "../../stores/dataStore"
import { getMonthDates, getDayOfWeek, getDayLabel, getToday } from "../../lib/date"
import { getRecordByDate } from "../../features/records/utils"

export default function CalendarPage() {
  const records = useDataStore((s) => s.records)

  const today = getToday()
  const todayDate = new Date(today + "T00:00:00")

  const [year, setYear] = useState(todayDate.getFullYear())
  const [month, setMonth] = useState(todayDate.getMonth())

  const monthDates = useMemo(() => getMonthDates(year, month), [year, month])

  // 月の最初の日の曜日（カレンダーのオフセット用）
  const firstDayOfWeek = useMemo(() => {
    return getDayOfWeek(monthDates[0])
  }, [monthDates])

  // 連続100%達成日数を計算
  const streak = useMemo(() => {
    let count = 0
    const d = new Date(today + "T00:00:00")

    while (true) {
      const dateStr = d.toISOString().slice(0, 10)
      const record = getRecordByDate(records, dateStr)

      if (record && record.status === "complete") {
        count++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }
    return count
  }, [records, today])

  // 前月・次月
  const goPrev = () => {
    if (month === 0) {
      setYear(year - 1)
      setMonth(11)
    } else {
      setMonth(month - 1)
    }
  }

  const goNext = () => {
    if (month === 11) {
      setYear(year + 1)
      setMonth(0)
    } else {
      setMonth(month + 1)
    }
  }

  const goToday = () => {
    setYear(todayDate.getFullYear())
    setMonth(todayDate.getMonth())
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>カレンダー</h2>

      {/* ストリーク表示 */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 16,
          padding: "12px 0",
          background: streak > 0 ? "#e8f5e9" : "#f5f5f5",
          borderRadius: 8,
        }}
      >
        <span style={{ fontSize: 24 }}>🔥</span>
        <span style={{ fontSize: 20, fontWeight: "bold", marginLeft: 8 }}>
          {streak}日連続
        </span>
        <span style={{ fontSize: 14, color: "#888", marginLeft: 4 }}>
          100%達成中
        </span>
      </div>

      {/* 月のナビゲーション */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <button onClick={goPrev} style={{ padding: "4px 12px" }}>
          ◀
        </button>
        <div>
          <strong style={{ fontSize: 18 }}>
            {year}年{month + 1}月
          </strong>
          <button
            onClick={goToday}
            style={{
              marginLeft: 8,
              fontSize: 12,
              padding: "2px 8px",
            }}
          >
            今月
          </button>
        </div>
        <button onClick={goNext} style={{ padding: "4px 12px" }}>
          ▶
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((d) => (
          <div
            key={d}
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color:
                d === 0 ? "#e53935" : d === 6 ? "#1e88e5" : "#666",
              padding: "4px 0",
            }}
          >
            {getDayLabel(d)}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
        }}
      >
        {/* 月初の空白セル */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} style={{ padding: 8 }} />
        ))}

        {/* 各日 */}
        {monthDates.map((dateStr) => {
          const dayNum = new Date(dateStr + "T00:00:00").getDate()
          const record = getRecordByDate(records, dateStr)
          const isToday = dateStr === today

          // 達成状況の色
          let dotColor = "transparent"
          if (record) {
            if (record.status === "complete") dotColor = "#4caf50"
            else if (record.status === "partial") dotColor = "#ff9800"
            else dotColor = "#e0e0e0"
          }

          return (
            <div
              key={dateStr}
              style={{
                textAlign: "center",
                padding: "6px 0",
                borderRadius: 8,
                background: isToday ? "#e3f2fd" : "transparent",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: isToday ? "bold" : "normal",
                  color: isToday ? "#1565c0" : "#333",
                }}
              >
                {dayNum}
              </div>
              {/* 達成丸 */}
              {record && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: dotColor,
                    margin: "2px auto 0",
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* 凡例 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginTop: 16,
          fontSize: 12,
          color: "#888",
        }}
      >
        <span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#4caf50",
              marginRight: 4,
            }}
          />
          100%
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ff9800",
              marginRight: 4,
            }}
          />
          一部完了
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#e0e0e0",
              marginRight: 4,
            }}
          />
          未達成
        </span>
      </div>
    </div>
  )
}
