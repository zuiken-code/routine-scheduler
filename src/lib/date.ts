export function getToday() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/** 曜日番号を取得 (0=日, 1=月, ...6=土) */
export function getDayOfWeek(date?: string): number {
  const d = date ? new Date(date + "T00:00:00") : new Date()
  return d.getDay()
}

/** 曜日番号 → 表示用ラベル */
const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"] as const

export function getDayLabel(dayOfWeek: number): string {
  return DAY_LABELS[dayOfWeek] ?? ""
}

/** 月のすべての日付を "YYYY-MM-DD" で返す */
export function getMonthDates(year: number, month: number): string[] {
  const dates: string[] = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const y = year
    const m = String(month + 1).padStart(2, "0")
    const dStr = String(day).padStart(2, "0")
    dates.push(`${y}-${m}-${dStr}`)
  }
  return dates
}

/** Date文字列 → "M月D日(曜)" */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  const m = d.getMonth() + 1
  const day = d.getDate()
  const dow = getDayLabel(d.getDay())
  return `${m}月${day}日(${dow})`
}