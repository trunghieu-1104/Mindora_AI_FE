import { motion, AnimatePresence } from 'framer-motion'
import { Minimize2, Maximize2, X, Music, Disc } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { parseSpotifyUrl } from '../../lib/utils'

export default function SpotifyPlayer() {
  const { playingItem, setPlayingItem, isMinimized, setIsMinimized } = useAppStore()

  if (!playingItem) return null

  const parsed = parseSpotifyUrl(playingItem.spotifyUrl)
  if (!parsed) return null

  // Generate the official Spotify Embed URL
  const embedUrl = `https://open.spotify.com/embed/${parsed.type}/${parsed.id}?utm_source=generator&theme=0`

  const handleClose = () => {
    setPlayingItem(null)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="fixed bottom-28 right-6 z-50 flex flex-col font-ui"
      >
        {isMinimized ? (
          /* Minimized pill state */
          <motion.div
            layoutId="spotify-player-container"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-3 bg-secondary-dark/95 backdrop-blur-md text-white px-5 py-3.5 rounded-full shadow-soft border border-white/10 cursor-pointer hover:bg-secondary-dark transition-colors max-w-xs sm:max-w-sm"
          >
            <Disc className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: '4s' }} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate leading-none mb-0.5">
                {playingItem.title}
              </p>
              <p className="text-[10px] text-white/50 truncate leading-none">
                {playingItem.artist || 'Spotify'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMinimized(false)
                }}
                className="p-1 hover:bg-white/10 rounded-full text-white/80 transition-colors"
                title="Phóng to"
              >
                <Maximize2 size={13} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClose()
                }}
                className="p-1 hover:bg-white/10 rounded-full text-red-400 transition-colors"
                title="Đóng"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Maximized Player State */
          <motion.div
            layoutId="spotify-player-container"
            className="w-64 bg-secondary-dark/95 backdrop-blur-md text-white rounded-3xl overflow-hidden shadow-soft border border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Music className="w-3.5 h-3.5 text-primary shrink-0 animate-pulse" />
                <div className="min-w-0">
                  <h4 className="text-[11px] font-bold truncate leading-tight">{playingItem.title}</h4>
                  <p className="text-[9px] text-white/60 truncate leading-none">{playingItem.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <a
                  href={playingItem.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded text-[9px] font-semibold transition-colors flex items-center gap-0.5 cursor-pointer"
                  title="Mở trong ứng dụng Spotify"
                >
                  Mở Spotify 🔗
                </a>
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/80 transition-colors"
                  title="Thu nhỏ"
                >
                  <Minimize2 size={12} />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1 hover:bg-red-950/40 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                  title="Đóng"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Embedded Spotify IFrame (Height 352px to show list) */}
            <div className="bg-[#121212] h-[352px] w-full relative">
              <iframe
                title="Spotify Embed"
                src={embedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="border-0"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
