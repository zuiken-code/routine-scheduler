import { Outlet } from "react-router-dom"
import BottomNav from "../components/BottomNav"

export default function Layout() {
  return (
    <div style={{ paddingBottom: 60 }}>
      <Outlet />
      <BottomNav />
    </div>
  )
}