import { useNavigate } from "react-router-dom"
import "../index.css"

export default function BottomNav() {
  const navigate = useNavigate()

  return (
    <div className="bottom-nav">
      <button onClick={() => navigate("/")}>ホーム</button>
      <button onClick={() => navigate("/daily")}>1日</button>
      <button onClick={() => navigate("/weekly")}>週間</button>
      <button onClick={() => navigate("/calendar")}>カレンダー</button>
    </div>
  )
}