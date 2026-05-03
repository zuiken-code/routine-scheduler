import { useNavigate } from "react-router-dom"

export default function BottomNav() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: 60,
        display: "flex",
        justifyContent: "space-around",
        borderTop: "1px solid #ccc",
        background: "#fff",
      }}
    >
      <button onClick={() => navigate("/")}>ホーム</button>
      <button onClick={() => navigate("/daily")}>1日</button>
      <button onClick={() => navigate("/weekly")}>週間</button>
      <button onClick={() => navigate("/calendar")}>カレンダー</button>
    </div>
  )
}