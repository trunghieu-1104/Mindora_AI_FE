import { useState } from 'react'
import { motion } from 'framer-motion'
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
    title: 'Lofi Beats',   
    artist: 'Spotify Editorial', 
    mood: 'calm',   
    color: 'bg-secondary/30',
    spotifyId: '37i9dQZF1DX8UebhpiaHg6', // Verified global playlist
    desc: 'Những giai điệu lofi nhẹ nhàng nhất giúp bạn tập trung và thư thái tâm trí.'
  },
  { 
    title: 'Chill Lofi Study',  
    artist: 'Spotify Editorial', 
    mood: 'happy',  
    color: 'bg-accent/60',
    spotifyId: '37i9dQZF1DXcBWIGmq5Z69', // Verified global playlist
    desc: 'Giai điệu lofi vui tươi, ấm áp để học tập và làm việc có năng lượng.'
  },
  { 
    title: 'Sad Lofi Beats',   
    artist: 'Spotify Editorial',     
    mood: 'sad',    
    color: 'bg-secondary/40',
    spotifyId: '37i9dQZF1DX3OgoO7uL66r', // Verified global playlist
    desc: 'Khoảng lặng êm đềm cho những ngày lòng trĩu nặng. Hãy để âm nhạc ôm lấy bạn.'
  },
  { 
    title: 'Lofi Drive',   
    artist: 'Spotify Editorial',     
    mood: 'energy', 
    color: 'bg-warning/30',
    spotifyId: '37i9dQZF1DX0SMICa2r2r2', // Verified global playlist
    desc: 'Tiết tấu năng động tiếp thêm nguồn động lực tích cực cho ngày dài học tập.'
  },
  { 
    title: 'Lofi Sleep',  
    artist: 'Spotify Editorial',   
    mood: 'sleep',  
    color: 'bg-primary/20',
    spotifyId: '37i9dQZF1DX8WY4x56mJEh', // Verified global playlist
    desc: 'Không gian yên bình vỗ về tâm trí, đưa bạn vào giấc ngủ sâu và êm ấm.'
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
  const [playingId, setPlayingId] = useState(null) // Active spotifyId

  const filtered = MUSIC.filter(m => m.mood === activeMood)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-text-main mb-1">Khám phá</h1>
        <p className="font-body text-text-sub">Nhạc thư giãn, thiền định và bài tập thở khoa học cho tâm trạng của bạn</p>
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
                    ? 'bg-primary text-text-main border-2 border-primary-dark shadow-sm'
                    : 'bg-white text-text-sub border-2 border-transparent hover:bg-primary/10'
                )}
              >
                {f.emoji} {f.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((m, i) => {
              const isSelected = playingId === m.spotifyId
              return (
                <div
                  key={i}
                  className={cn(
                    'card flex flex-col justify-between overflow-hidden relative transition-all duration-200 shadow-card hover:shadow-soft border border-primary/20',
                    m.color,
                    isSelected && 'p-4 min-h-[400px]'
                  )}
                  style={{ minHeight: isSelected ? '400px' : '320px' }}
                >
                  {isSelected ? (
                    // Static render without layout animations to prevent iframe loading issues
                    <div className="flex flex-col h-full justify-between w-full">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-ui text-xs font-bold text-text-main flex items-center gap-1.5">
                          <Headphones size={14} className="animate-pulse text-primary-dark" />
                          Đang phát...
                        </span>
                        <button
                          onClick={() => setPlayingId(null)}
                          className="p-1 rounded-lg hover:bg-black/10 text-text-main transition-colors cursor-pointer"
                          title="Đóng trình phát"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex-1 rounded-2xl overflow-hidden bg-white/50 h-[320px]">
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
                    </div>
                  ) : (
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center text-2xl mb-4 shadow-sm">
                          🎵
                        </div>
                        <h4 className="font-display font-bold text-lg text-text-main mb-1 leading-tight">{m.title}</h4>
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
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'breathing' && <BreathingExercise />}

      {activeTab === 'podcast' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'Tâm lý học dễ hiểu', ep: 'Tập 12: Kiểm soát lo âu', emoji: '🧠', spotifyId: 'show/4rOoJ62DNZ8864rQvjypMp' },
            { title: 'Lo-fi Stories',       ep: 'Câu chuyện buổi tối thư giãn', emoji: '🌙', spotifyId: 'show/4rOoJ62DNZ8864rQvjypMp' },
            { title: 'Thiền mỗi ngày',      ep: 'Thiền 10 phút tĩnh tâm', emoji: '🧘', spotifyId: 'show/4rOoJ62DNZ8864rQvjypMp' },
            { title: 'Sống tích cực',       ep: 'Sắp xếp lại tâm trí',     emoji: '✨', spotifyId: 'show/4rOoJ62DNZ8864rQvjypMp' },
          ].map((p, i) => {
            const isSelected = playingId === p.title
            return (
              <div 
                key={i} 
                className={cn(
                  'card flex flex-col justify-between transition-all duration-200 border border-primary/20',
                  isSelected ? 'p-4 min-h-[360px]' : 'items-center flex-row p-6'
                )}
                style={{ minHeight: isSelected ? '360px' : 'auto' }}
              >
                {isSelected ? (
                  <div className="flex flex-col h-full justify-between w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-ui text-xs font-bold text-text-main flex items-center gap-1.5">
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
                    <div className="flex-1 rounded-xl overflow-hidden min-h-[280px]">
                      <iframe
                        style={{ borderRadius: '12px', border: 'none' }}
                        src={`https://open.spotify.com/embed/show/${p.spotifyId}?utm_source=generator&theme=0`}
                        width="100%"
                        height="100%"
                        allowFullScreen=""
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-secondary/30 flex items-center justify-center text-3xl shrink-0">
                        {p.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-body font-bold text-text-main text-sm">{p.title}</p>
                        <p className="font-ui text-xs text-text-sub truncate mt-0.5">{p.ep}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPlayingId(p.title)}
                      className="p-2.5 rounded-full bg-primary/10 hover:bg-primary text-text-main transition-all duration-200 cursor-pointer ml-4 shrink-0"
                      title="Nghe Podcast"
                    >
                      <Play size={16} />
                    </button>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
