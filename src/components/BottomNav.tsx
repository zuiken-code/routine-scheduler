import { useNavigate, useLocation } from "react-router-dom"
import "../index.css"

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="bottom-nav">
      <button className={location.pathname === "/" ? "active" : ""} onClick={() => navigate("/")}>ホーム</button>
      <button className={location.pathname === "/daily" ? "active" : ""} onClick={() => navigate("/daily")}>1日</button>
      <button className={location.pathname === "/weekly" ? "active" : ""} onClick={() => navigate("/weekly")}>週間</button>
      <button className={location.pathname === "/calendar" ? "active" : ""} onClick={() => navigate("/calendar")}>カレンダー</button>
    </div>
  )
}