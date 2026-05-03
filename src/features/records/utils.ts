export function calcAchievement(total: number, done: number) {
  const rate = total === 0 ? 0 : (done / total) * 100

  if (done === 0) return { rate, status: "none" }
  if (done === total) return { rate, status: "complete" }
  return { rate, status: "partial" }
}