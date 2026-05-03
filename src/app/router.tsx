import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layout"

import Home from "../pages/home"
import Daily from "../pages/daily"
import Weekly from "../pages/weekly"
import Calendar from "../pages/calendar"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="daily" element={<Daily />} />
          <Route path="weekly" element={<Weekly />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}