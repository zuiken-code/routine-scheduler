import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import BottomNav from "../components/BottomNav"
import { useUIStore } from "../stores/uiStore"

export default function Layout() {
  const updateCurrentDate = useUIStore((s) => s.updateCurrentDate)

  useEffect(() => {
    // 初回マウント時
    updateCurrentDate()

    // 画面の表示状態が変わった時（スリープ復帰、タブ切り替え時など）にチェック
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateCurrentDate()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // 1分ごとにチェック（アプリを開いたままでも日付が変わるように）
    const interval = setInterval(() => {
      updateCurrentDate()
    }, 60 * 1000)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearInterval(interval)
    }
  }, [updateCurrentDate])

  return (
    <div style={{ paddingBottom: 60 }}>
      <Outlet />
      <BottomNav />
    </div>
  )
}