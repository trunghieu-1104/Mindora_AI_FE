import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Music, X, Check, AlertCircle } from 'lucide-react'
import { cn, parseSpotifyUrl } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'

const MOOD_FILTERS = [
  { emoji: '😊', label: 'Vui vẻ',    value: 'happy' },
  { emoji: '😔', label: 'Buồn',       value: 'sad' },
  { emoji: '😌', label: 'Thư giãn',  value: 'calm' },
  { emoji: '💪', label: 'Năng lượng', value: 'energy' },
  { emoji: '😴', label: 'Ngủ ngon',  value: 'sleep' },
]

const MUSIC = [
  { 
    title: 'Rainy Café Lofi (Radio)', 
    artist: 'Lofi Girl / Lofi Beats', 
    mood: 'calm', 
    color: 'bg-secondary/20 border border-secondary/10', 
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn',
    emoji: '🎧'
  },
  { 
    title: 'Acoustic Chill', 
    artist: 'Spotify Playlist', 
    mood: 'calm', 
    color: 'bg-primary/20 border border-primary/10', 
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
    emoji: '🎸'
  },
  { 
    title: 'Happy', 
    artist: 'Pharrell Williams', 
    mood: 'happy', 
    color: 'bg-accent/30 border border-accent/20', 
    spotifyUrl: 'https://open.spotify.com/track/60nZcImVbB7a1x5V42W0gM',
    emoji: '😊'
  },
  { 
    title: 'Can\'t Stop the Feeling!', 
    artist: 'Justin Timberlake', 
    mood: 'happy', 
    color: 'bg-primary/30 border border-primary/20', 
    spotifyUrl: 'https://open.spotify.com/track/6ZazHq6s5M9jJbJ8zV6VqT',
    emoji: '🕺'
  },
  { 
    title: 'Happy Beats', 
    artist: 'Spotify Playlist', 
    mood: 'happy', 
    color: 'bg-secondary/10 border border-secondary/5', 
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX7KNKjV01gT9',
    emoji: '✨'
  },
  { 
    title: 'Death Bed (Lofi)', 
    artist: 'Powfu', 
    mood: 'sad', 
    color: 'bg-secondary/20 border border-secondary/10', 
    spotifyUrl: 'https://open.spotify.com/track/7eJMw1KGmr626JUfJui3X1',
    emoji: '☕'
  },
  { 
    title: 'Someone Like You', 
    artist: 'Adele', 
    mood: 'sad', 
    color: 'bg-secondary/10 border border-secondary/5', 
    spotifyUrl: 'https://open.spotify.com/track/1f3yA150c2L6W97495sP81',
    emoji: '💔'
  },
  { 
    title: 'Sad Crying Playlist', 
    artist: 'Spotify Playlist', 
    mood: 'sad', 
    color: 'bg-primary/20 border border-primary/10', 
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX3YSRcHn6w73',
    emoji: '🌧️'
  },
  { 
    title: 'Wake Me Up', 
    artist: 'Avicii', 
    mood: 'energy', 
    color: 'bg-warning/20 border border-warning/10', 
    spotifyUrl: 'https://open.spotify.com/track/0nrRP2bk19rNc0orkWPQk2',
    emoji: '☀️'
  },
  { 
    title: 'Levels', 
    artist: 'Avicii', 
    mood: 'energy', 
    color: 'bg-accent/30 border border-accent/20', 
    spotifyUrl: 'https://open.spotify.com/track/5UqCQaDshqbIk3pkhy4Pjg',
    emoji: '⚡'
  },
  { 
    title: 'EDM Chill', 
    artist: 'Spotify Playlist', 
    mood: 'energy', 
    color: 'bg-secondary/20 border border-secondary/10', 
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX3tGo72M651H',
    emoji: '🔥'
  },
  { 
    title: 'Clair de Lune', 
    artist: 'Claude Debussy', 
    mood: 'sleep', 
    color: 'bg-primary/20 border border-primary/10', 
    spotifyUrl: 'https://open.spotify.com/track/5u5aV2U4KzXoVwQGzQf45X',
    emoji: '🌙'
  },
  { 
    title: 'Deep Sleep Waves', 
    artist: 'Sleep Sounds', 
    mood: 'sleep', 
    color: 'bg-secondary/20 border border-secondary/10', 
    spotifyUrl: 'https://open.spotify.com/track/7GZ3F4b4yQZscL3qW2u21t',
    emoji: '🌊'
  },
  { 
    title: 'Sleep Lofi', 
    artist: 'Spotify Playlist', 
    mood: 'sleep', 
    color: 'bg-accent/20 border border-accent/10', 
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS',
    emoji: '💤'
  }
]




function BreathingExercise() {
  const [phase, setPhase] = useState('idle')
  const [count, setCount] = useState(0)

  const start = () => {
    setPhase('inhale')
    setCount(4)
    let c = 4
    const tick = setInterval(() => {
      c -= 1
      setCount(c)
      if (c === 0) clearInterval(tick)
    }, 1000)
  }

  const phaseLabel = {
    idle:   'Nhấn để bắt đầu',
    inhale: `Hít vào... ${count}`,
    hold:   `Giữ... ${count}`,
    exhale: `Thở ra... ${count}`,
  }

  return (
    <div className="card text-center py-12">
      <h3 className="font-display text-2xl text-text-main mb-2">Bài tập thở 4-7-8</h3>
      <p className="font-body text-text-sub text-sm mb-10">Giảm căng thẳng ngay lập tức</p>

      <div className="relative flex items-center justify-center mb-8">
        <div className={cn(
          'w-36 h-36 rounded-full flex items-center justify-center cursor-pointer transition-all duration-1000',
          phase === 'idle'
            ? 'bg-primary/30 hover:bg-primary/50'
            : 'bg-primary/50 animate-breathe'
        )}
          onClick={phase === 'idle' ? start : undefined}
        >
          <div className="w-24 h-24 rounded-full bg-primary/60 flex items-center justify-center">
            <p className="font-ui text-text-main text-sm font-medium text-center px-2">
              {phaseLabel[phase]}
            </p>
          </div>
        </div>
      </div>
      <p className="font-body text-text-sub text-sm">Kỹ thuật 4-7-8 giúp hệ thần kinh bình tĩnh lại</p>
    </div>
  )
}

export default function ExplorePage() {
  const [activeMood, setActiveMood] = useState('calm')
  const [activeTab, setActiveTab] = useState('music')
  const playingItem = useAppStore((s) => s.playingItem)
  const setPlayingItem = useAppStore((s) => s.setPlayingItem)
  const setIsMinimized = useAppStore((s) => s.setIsMinimized)
  const [customUrl, setCustomUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState(false)

  const filtered = MUSIC.filter(m => m.mood === activeMood)

  const handlePlayCustom = (e) => {
    e.preventDefault()
    const parsed = parseSpotifyUrl(customUrl)
    if (parsed) {
      const typeLabel = parsed.type === 'track' ? 'Bài hát' : parsed.type === 'playlist' ? 'Playlist' : parsed.type === 'album' ? 'Album' : 'Nội dung'
      const fakeSongItem = {
        title: `${typeLabel} tùy chọn`,
        artist: 'Nhạc cá nhân của bạn',
        spotifyUrl: customUrl,
        emoji: parsed.type === 'playlist' ? '✨' : '🎵'
      }
      setPlayingItem(fakeSongItem)
      setIsMinimized(false)
      setErrorMsg('')
      setSuccessMsg(true)
      setTimeout(() => setSuccessMsg(false), 2000)
    } else {
      setErrorMsg('Đường dẫn không hợp lệ! Vui lòng dán đúng link bài hát/playlist từ Spotify.')
    }
  }



  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-text-main mb-1">Khám phá</h1>
        <p className="font-body text-text-sub">Nhạc, thiền định và bài tập thở cho tâm trạng của bạn</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white rounded-2xl p-1.5 w-fit shadow-card">
        {[
          { key: 'music',    label: '🎵 Âm nhạc' },
          { key: 'breathing', label: '🌬️ Thở' },
          { key: 'podcast',  label: '🎙️ Podcast' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-5 py-2 rounded-xl font-ui text-sm font-medium transition-all duration-200 cursor-pointer',
              activeTab === tab.key
                ? 'bg-primary text-text-main shadow-card'
                : 'text-text-sub hover:text-text-main'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'music' && (
        <div className="animate-fade-in">
          {/* Custom Spotify URL Input */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-card mb-8 border border-primary/10">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark shrink-0">
                <Music size={16} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-text-main">Tự phát nhạc của riêng bạn</h3>
                <p className="font-body text-xs text-text-sub">Dán link Bài hát, Playlist, Album từ Spotify để thưởng thức ngay</p>
              </div>
            </div>
            
            <form onSubmit={handlePlayCustom} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ví dụ: https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO"
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value)
                    if (errorMsg) setErrorMsg('')
                  }}
                  className="input-field pr-10 pl-4 py-3 bg-white"
                />
                {customUrl && (
                  <button
                    type="button"
                    onClick={() => setCustomUrl('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!customUrl}
                className={cn(
                  "btn-primary py-3 px-6 sm:w-auto w-full flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap",
                  !customUrl && "opacity-50 cursor-not-allowed hover:bg-primary"
                )}
              >
                {successMsg ? <Check size={16} className="animate-scale-in" /> : <Play size={16} />}
                {successMsg ? 'Đã tải!' : 'Phát nhạc'}
              </button>
            </form>
            
            {errorMsg && (
              <div className="mt-2.5 flex items-center gap-2 text-danger text-xs font-ui animate-fade-up">
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Mood filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
            {MOOD_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveMood(f.value)}
                className={cn(
                  'mood-chip whitespace-nowrap cursor-pointer',
                  activeMood === f.value
                    ? 'bg-primary text-text-main border-2 border-primary-dark shadow-sm'
                    : 'bg-white text-text-sub border-2 border-transparent hover:bg-primary/10'
                )}
              >
                {f.emoji} {f.label}
              </button>
            ))}
          </div>

          <motion.div layout className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(filtered.length ? filtered : MUSIC.slice(0, 3)).map((m, i) => {
              const isCurrentPlaying = playingItem && playingItem.spotifyUrl === m.spotifyUrl
              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn('card-hover flex flex-col justify-between', m.color)}
                  onClick={() => {
                    if (isCurrentPlaying) {
                      setPlayingItem(null)
                    } else {
                      setPlayingItem(m)
                      setIsMinimized(false)
                    }
                  }}
                >
                  <div>
                    <div className="w-full aspect-square rounded-2xl bg-white/50 flex items-center justify-center text-5xl mb-4 shadow-inner select-none">
                      {m.emoji}
                    </div>
                    <h4 className="font-body font-bold text-text-main text-base mb-0.5">{m.title}</h4>
                    <p className="font-ui text-xs text-text-sub mb-4">{m.artist}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isCurrentPlaying) {
                        setPlayingItem(null)
                      } else {
                        setPlayingItem(m)
                        setIsMinimized(false)
                      }
                    }}
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-ui text-sm transition-all duration-200 cursor-pointer shadow-sm w-fit",
                      isCurrentPlaying 
                        ? "bg-primary text-text-main hover:bg-primary-dark font-medium" 
                        : "bg-white/75 text-text-main hover:bg-white"
                    )}
                  >
                    {isCurrentPlaying ? <Pause size={14} /> : <Play size={14} />}
                    {isCurrentPlaying ? 'Đang phát' : 'Nghe ngay'}
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      )}

      {activeTab === 'breathing' && <BreathingExercise />}

      {activeTab === 'podcast' && (
        <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
          {[
            { title: 'Tâm lý học dễ hiểu', ep: 'Tập 12: Kiểm soát lo âu', emoji: '🧠', spotifyUrl: 'https://open.spotify.com/episode/5ZgqB8F2e4vUjQ6K7k7Hn3' },
            { title: 'Lo-fi Stories',       ep: 'Câu chuyện buổi tối',     emoji: '🌙', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS' },
            { title: 'Thiền mỗi ngày',      ep: 'Thiền 10 phút buổi sáng', emoji: '🧘', spotifyUrl: 'https://open.spotify.com/playlist/46L5oW3F1VdF4S1r7y8k2S' },
            { title: 'Sống tích cực',       ep: 'Sắp xếp lại tâm trí',     emoji: '✨', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS' },
          ].map((p, i) => {
            const isCurrentPlaying = playingItem && playingItem.spotifyUrl === p.spotifyUrl
            return (
              <div 
                key={i} 
                className={cn(
                  "card-hover flex items-center gap-4 border transition-all duration-200", 
                  isCurrentPlaying ? "border-primary bg-primary/10" : "border-primary/20 bg-white"
                )}
                onClick={() => {
                  if (isCurrentPlaying) {
                    setPlayingItem(null)
                  } else {
                    setPlayingItem(p)
                    setIsMinimized(false)
                  }
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary/30 flex items-center justify-center text-3xl shrink-0 select-none">
                  {p.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body font-semibold text-text-main text-sm">{p.title}</p>
                  <p className="font-ui text-xs text-text-sub truncate">{p.ep}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isCurrentPlaying) {
                      setPlayingItem(null)
                    } else {
                      setPlayingItem(p)
                      setIsMinimized(false)
                    }
                  }}
                  className="p-2 rounded-full hover:bg-black/5 text-text-sub hover:text-text-main transition-colors cursor-pointer"
                >
                  {isCurrentPlaying ? <Pause size={18} className="text-primary-dark" /> : <Play size={18} />}
                </button>
              </div>
            )
          })}
        </div>
      )}


    </div>
  )
}

