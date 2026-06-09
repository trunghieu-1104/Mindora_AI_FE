import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/organisms/Navbar'
import SpotifyPlayer from './components/organisms/SpotifyPlayer'
import HomePage from './pages/Home/HomePage'
import ChatPage from './pages/Chat/ChatPage'
import JournalPage from './pages/Journal/JournalPage'
import ExplorePage from './pages/Explore/ExplorePage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const initSession = useAppStore((s) => s.initSession)

  useEffect(() => {
    initSession()
  }, [initSession])

  return (
    <HashRouter>
      <div className="min-h-screen bg-bg flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/chat"      element={<ChatPage />} />
            <Route path="/journal"   element={<JournalPage />} />
            <Route path="/explore"   element={<ExplorePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
        <SpotifyPlayer />
      </div>
    </HashRouter>
  )
}
