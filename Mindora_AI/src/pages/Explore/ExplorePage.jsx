import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Headphones, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

const MOOD_FILTERS = [
  { emoji: '😌', label: 'Thư giãn',  value: 'calm' },
  { emoji: '😊', label: 'Vui vẻ',    value: 'happy' },
  { emoji: '😔', label: 'Buồn',       value: 'sad' },
  { emoji: '💪', label: 'Năng lượng', value: 'energy' },
  { emoji: '😴', label: 'Ngủ ngon',  value: 'sleep' },
]

const MUSIC = [
  { 
    title: 'V-Pop Lofi Chill',   
    artist: 'Spotify Editorial', 
    mood: 'calm',   
    color: 'bg-secondary/30',
    spotifyId: '37i9dQZF1DXa1r2D6luzgI', // V-Pop Lofi Chill Playlist
    desc: 'Những bài hát V-Pop quen thuộc được phối lại theo phong cách Lofi nhẹ nhàng, êm ái.'
  },
  { 
    title: 'V-Pop Thư Giãn (Không Lời)',  
    artist: 'Spotify Editorial', 
    mood: 'calm',  
    color: 'bg-accent/40',
    spotifyId: '37i9dQZF1DX8g9mC89tS0I', // V-Pop Instrumental Piano/Guitar Playlist
    desc: 'Tiếng đàn dương cầm và guitar acoustic mộc mạc, tĩnh tâm sâu sắc.'
  },
  { 
    title: 'V-Pop Acoustic',  
    artist: 'Spotify Editorial', 
    mood: 'happy',  
    color: 'bg-accent/60',
    spotifyId: '37i9dQZF1DX4Y7V7n6eGkG', // V-Pop Acoustic
    desc: 'Giai điệu V-Pop nhẹ nhàng mộc mạc, đem lại năng lượng bình yên, ấm áp.'
  },
  { 
    title: 'Sad Lofi Beats',   
    artist: 'Lofi Records',     
    mood: 'sad',    
    color: 'bg-secondary/40',
    spotifyId: '37i9dQZF1DX3OgoO7uL66r', // Sad Lofi Beats
    desc: 'Những khoảng lặng ấm áp cho ngày lòng trĩu nặng. Hãy để giai điệu ôm lấy bạn.'
  },
  { 
    title: 'Lofi Drive',   
    artist: 'Vibe Nation',     
    mood: 'energy', 
    color: 'bg-warning/30',
    spotifyId: '37i9dQZF1DX0SMICa2r2r2', // Lofi Drive Playlist
    desc: 'Nhịp điệu lofi năng động, tiếp thêm động lực cho ngày làm việc hứng khởi.'
  },
  { 
    title: 'Indie Việt Bình Yên',  
    artist: 'Spotify Editorial',   
    mood: 'sleep',  
    color: 'bg-primary/20',
    spotifyId: '37i9dQZF1DX7sQ49R4PUpu', // Indie Viet Playlist
    desc: 'Những bản nhạc Indie Việt mộc mạc, nhẹ nhàng vỗ về bạn đi vào giấc ngủ ngon.'
  },
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
  const [playingId, setPlayingId] = useState(null) // Holds active spotifyId

  const filtered = MUSIC.filter(m => m.mood === activeMood)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-text-main mb-1">Khám phá</h1>
        <p className="font-body text-text-sub">Nhạc thư giãn, thiền định và bài tập thở khoa học cho tâm trạng</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white rounded-2xl p-1.5 w-fit shadow-card">
        {[
          { key: 'music',    label: '🎵 Âm nhạc' },
          { key: 'breathing', label: '🌬️ Bài tập thở' },
          { key: 'podcast',  label: '🎙️ Lời khuyên & Podcast' },
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
        <div>
          {/* Mood filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {MOOD_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveMood(f.value)}
                className={cn(
                  'mood-chip whitespace-nowrap cursor-pointer',
                  activeMood === f.value
                    ? 'bg-primary text-text-main border-2 border-primary-dark shadow-sm scale-102'
                    : 'bg-white text-text-sub border-2 border-transparent hover:bg-primary/10'
                )}
              >
                {f.emoji} {f.label}
              </button>
            ))}
          </div>

          {/* Music Cards */}
          <motion.div layout className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((m) => {
              const isCurrentlyPlaying = playingId === m.spotifyId
              return (
                <motion.div
                  key={m.spotifyId}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    'card-hover overflow-hidden flex flex-col justify-between transition-all duration-300 relative',
                    m.color,
                    isCurrentlyPlaying && 'ring-2 ring-primary-dark/40 shadow-soft'
                  )}
                  style={{ minHeight: '360px' }}
                >
                  <AnimatePresence mode="wait">
                    {isCurrentlyPlaying ? (
                      // 1. If user clicks "Listen Now", load the real Spotify Iframe player!
                      <motion.div
                        key="spotify-player"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex flex-col h-full justify-between"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-ui text-xs font-semibold text-text-main flex items-center gap-1.5">
                            <Headphones size={14} className="animate-pulse text-primary-dark" />
                            Đang phát...
                          </span>
                          <button
                            onClick={() => setPlayingId(null)}
                            className="p-1.5 rounded-lg hover:bg-black/10 text-text-main transition-colors cursor-pointer"
                            title="Đóng trình phát"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="flex-1 rounded-2xl overflow-hidden bg-white/40">
                          <iframe
                            style={{ borderRadius: '16px', border: 'none' }}
                            src={`https://open.spotify.com/embed/playlist/${m.spotifyId}?utm_source=generator&theme=0`}
                            width="100%"
                            height="100%"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      // 2. Otherwise show standard beautiful preview card
                      <motion.div
                        key="preview-card"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col h-full justify-between"
                      >
                        <div>
                          <div className="w-full aspect-video rounded-2xl bg-white/50 flex items-center justify-center text-5xl mb-4 shadow-sm relative group overflow-hidden">
                            🎧
                            <div className="absolute inset-0 bg-primary-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Play size={32} className="text-text-main drop-shadow-md scale-90 group-hover:scale-100 transition-transform duration-300" />
                            </div>
                          </div>
                          <h4 className="font-display font-bold text-text-main text-lg mb-1 leading-tight">{m.title}</h4>
                          <p className="font-ui text-xs text-text-sub font-medium mb-3">{m.artist}</p>
                          <p className="font-body text-xs text-text-sub/90 leading-relaxed mb-4 flex gap-1.5 items-start">
                            <Info size={12} className="shrink-0 mt-0.5 text-text-sub/70" />
                            {m.desc}
                          </p>
                        </div>
                        <button
                          onClick={() => setPlayingId(m.spotifyId)}
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/70 hover:bg-white text-text-main rounded-full font-ui text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer active:scale-97"
                        >
                          <Play size={14} /> Nghe ngay
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {activeTab === 'breathing' && <BreathingExercise />}

      {activeTab === 'podcast' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'Tâm lý học dễ hiểu', ep: 'Tập 12: Kiểm soát lo âu', emoji: '🧠', spotifyId: 'show/7uG38F3wZ48kH32h5Q' },
            { title: 'Lo-fi Stories',       ep: 'Câu chuyện buổi tối thư giãn', emoji: '🌙', spotifyId: 'show/0Z1hP5jP69F82lG43' },
            { title: 'Thiền mỗi ngày',      ep: 'Thiền 10 phút buổi sáng lành mạnh', emoji: '🧘', spotifyId: 'show/3mY2e4jW6h8k5L321' },
            { title: 'Sống tích cực',       ep: 'Sắp xếp lại các ngăn suy nghĩ',     emoji: '✨', spotifyId: 'show/4w9j3kL2m8G5F3290' },
          ].map((p, i) => {
            const isPlaying = playingId === p.title
            return (
              <motion.div 
                key={i} 
                layout
                className={cn(
                  'card-hover flex flex-col justify-between transition-all duration-300',
                  isPlaying ? 'bg-primary/20 ring-2 ring-primary-dark/20' : 'bg-white'
                )}
                style={{ minHeight: isPlaying ? '320px' : 'auto' }}
              >
                {isPlaying ? (
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-ui text-xs font-semibold text-text-main flex items-center gap-1.5">
                        <Headphones size={14} className="animate-pulse text-primary-dark" />
                        Đang phát Podcast...
                      </span>
                      <button
                        onClick={() => setPlayingId(null)}
                        className="p-1 rounded-lg hover:bg-black/10 text-text-main transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex-1 rounded-xl overflow-hidden min-h-[220px]">
                      <iframe
                        style={{ borderRadius: '12px', border: 'none' }}
                        src="https://open.spotify.com/embed/show/4rOoJ62DNZ8864rQvjypMp?utm_source=generator&theme=0" // Standard highly popular psychology show
                        width="100%"
                        height="100%"
                        allowFullScreen=""
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/30 flex items-center justify-center text-3xl shrink-0">
                      {p.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold text-text-main text-sm leading-snug">{p.title}</p>
                      <p className="font-ui text-xs text-text-sub truncate mt-0.5">{p.ep}</p>
                    </div>
                    <button
                      onClick={() => setPlayingId(p.title)}
                      className="p-2.5 rounded-full bg-primary/10 hover:bg-primary text-text-main transition-all duration-200 cursor-pointer"
                      title="Nghe Podcast"
                    >
                      <Play size={16} />
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
