import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react'
import Navbar from './components/organisms/Navbar'
import HomePage from './pages/Home/HomePage'
import ChatPage from './pages/Chat/ChatPage'
import JournalPage from './pages/Journal/JournalPage'
import ExplorePage from './pages/Explore/ExplorePage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import { useAppStore } from './store/useAppStore'
import { parseSpotifyUrl } from './lib/utils'

export default function App() {
  const initSession = useAppStore((s) => s.initSession)
  const playingItem = useAppStore((s) => s.playingItem)
  const setPlayingItem = useAppStore((s) => s.setPlayingItem)
  const isMinimized = useAppStore((s) => s.isMinimized)
  const setIsMinimized = useAppStore((s) => s.setIsMinimized)

  useEffect(() => {
    initSession()
  }, [initSession])

  const parsedPlayer = playingItem ? parseSpotifyUrl(playingItem.spotifyUrl) : null
  const embedUrl = parsedPlayer 
    ? `https://open.spotify.com/embed/${parsedPlayer.type}/${parsedPlayer.id}?utm_source=generator&theme=0`
    : ''

  return (
    <HashRouter>
      <div className="min-h-screen bg-bg flex flex-col relative">
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

        {/* Global Floating Glassmorphism Spotify Player Panel */}
        <AnimatePresence>
          {playingItem && (
            <>
              {isMinimized ? (
                /* Minimized Floating Disk Player */
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.8 }}
                  className="fixed bottom-6 right-6 z-50 bg-secondary/95 backdrop-blur-md border border-white/10 rounded-full py-2.5 pl-4 pr-3 shadow-soft flex items-center gap-3 text-white max-w-[280px]"
                >
                  <div className="relative w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden shadow-md animate-spin select-none" style={{ animationDuration: '6s' }}>
                    <span className="text-base">📀</span>
                  </div>
                  
                  <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setIsMinimized(false)}>
                    <p className="text-[10px] font-ui font-semibold text-primary truncate">Đang phát nhạc</p>
                    <p className="text-[11px] font-body text-white/80 truncate font-medium">{playingItem.title}</p>
                  </div>
                  
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => setIsMinimized(false)}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/70 hover:text-white"
                      title="Mở rộng"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => setPlayingItem(null)}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/70 hover:text-danger"
                      title="Đóng"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Maximized Embedded Spotify Player Panel */
                <motion.div
                  initial={{ opacity: 0, y: 100, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100, scale: 0.95 }}
                  className="fixed bottom-6 right-6 z-50 bg-[#121212]/98 backdrop-blur-md border border-white/10 rounded-3xl p-3 shadow-2xl w-[300px] max-w-[90vw]"
                >
                  {/* Inline custom styles for soundwave animation */}
                  <style>{`
                    @keyframes soundwave {
                      0%, 100% { height: 4px; }
                      50% { height: 18px; }
                    }
                    .soundwave-bar-1 { animation: soundwave 0.8s ease-in-out infinite; }
                    .soundwave-bar-2 { animation: soundwave 0.5s ease-in-out infinite; animation-delay: 0.15s; }
                    .soundwave-bar-3 { animation: soundwave 0.7s ease-in-out infinite; animation-delay: 0.3s; }
                    .soundwave-bar-4 { animation: soundwave 0.6s ease-in-out infinite; animation-delay: 0.05s; }
                  `}</style>

                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Glowing live soundwave */}
                      <div className="flex items-end gap-0.5 h-4 w-5 shrink-0 select-none">
                        <div className="w-0.5 bg-primary rounded-full soundwave-bar-1" />
                        <div className="w-0.5 bg-primary rounded-full soundwave-bar-2" />
                        <div className="w-0.5 bg-primary rounded-full soundwave-bar-3" />
                        <div className="w-0.5 bg-primary rounded-full soundwave-bar-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-display font-bold text-xs text-white truncate pr-1">
                          {playingItem.title}
                        </h4>
                        <p className="font-ui text-[9px] text-white/60 truncate">
                          {playingItem.artist}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-0.5 shrink-0">
                      <a
                        href={playingItem.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                        title="Mở bằng Spotify app"
                      >
                        <ExternalLink size={12} />
                      </a>
                      <button
                        onClick={() => setIsMinimized(true)}
                        className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                        title="Thu nhỏ"
                      >
                        <ChevronDown size={12} />
                      </button>
                      <button
                        onClick={() => setPlayingItem(null)}
                        className="p-1 text-white/60 hover:text-danger hover:bg-danger/10 rounded-full transition-all cursor-pointer"
                        title="Đóng"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Spotify Embed Iframe */}
                  {parsedPlayer ? (
                    <div className="overflow-hidden rounded-2xl bg-black shadow-inner">
                      <iframe
                        style={{ borderRadius: '12px', border: 'none', display: 'block' }}
                        src={embedUrl}
                        width="100%"
                        height={parsedPlayer.type === 'track' || parsedPlayer.type === 'episode' ? '152' : '352'}
                        frameBorder="0"
                        allowFullScreen=""
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title="Spotify Player"
                      />
                    </div>
                  ) : (
                    <div className="py-6 text-center text-white/60 text-xs">
                      Không thể phát bài nhạc này
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </HashRouter>
  )
}
