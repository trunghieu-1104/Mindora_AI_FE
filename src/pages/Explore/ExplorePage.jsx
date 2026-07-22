import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'
import { api } from '../../lib/api'

// Các bộ lọc tâm trạng (Giữ lại vì đây là cấu hình UI, không phải dữ liệu động)
const MOOD_FILTERS = [
  { emoji: '😊', label: 'Vui vẻ',    value: 'happy' },
  { emoji: '😔', label: 'Buồn',       value: 'sad' },
  { emoji: '😌', label: 'Thư giãn',  value: 'calm' },
  { emoji: '💪', label: 'Năng lượng', value: 'energy' },
  { emoji: '😴', label: 'Ngủ ngon',  value: 'sleep' },
]

const MOOD_EMOJI = { happy: '😊', sad: '😔', calm: '😌', energy: '💪', sleep: '😴' }
const MOOD_COLOR = {
  happy: 'bg-yellow-100', sad: 'bg-indigo-100', calm: 'bg-emerald-100',
  energy: 'bg-orange-100', sleep: 'bg-blue-100',
}

function getCoverUrl(item) {
  if (!item) return null
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('/')) {
    return item.thumbnailUrl
  }
  if (item.youtubeId) {
    return `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
  }
  return item.thumbnailUrl
}

// Chuẩn hoá chuỗi để search tiếng Việt:
// "Thư Giãn" → "thu gian" | "VSTN" → "vstn" | "  hello  " → "hello"
// Cho phép gõ không dấu, sai hoa/thường, thừa khoảng trắng vẫn tìm được.
function normalize(str) {
  if (!str) return ''
  return str
    .normalize('NFD')                        // tách ký tự + dấu (e.g. ệ → e + combining)
    .replace(/[\u0300-\u036f]/g, '')         // xoá toàn bộ dấu combining
    .replace(/[đĐ]/g, 'd')                   // đ/Đ không có trong NFD, xử lý riêng
    .toLowerCase()
    .replace(/\s+/g, ' ')                    // collapse nhiều khoảng trắng
    .trim()
}

// Kiểm tra query có khớp với target không (từng từ trong query đều phải xuất hiện)
function matchSearch(target, query) {
  if (!query.trim()) return true
  const nTarget = normalize(target)
  const words = normalize(query).split(' ').filter(Boolean)
  return words.every((w) => nTarget.includes(w))
}

// Title trong content_library có dạng "Tên bài — Nghệ sĩ" — tách ra để hiển thị đẹp hơn.
function splitTitleArtist(rawTitle) {
  const parts = rawTitle.split('—')
  if (parts.length >= 2) {
    return { title: parts[0].trim(), artist: parts.slice(1).join('—').trim() }
  }
  return { title: rawTitle, artist: 'Nhạc Việt' }
}

function BreathingExercise() {
  const [phase, setPhase] = useState('idle')
  const [count, setCount] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const runPhase = (name, duration, onDone) => {
    setPhase(name)
    setCount(duration)
    let c = duration
    const tick = () => {
      c -= 1
      setCount(c)
      if (c > 0) {
        timerRef.current = setTimeout(tick, 1000)
      } else {
        onDone()
      }
    }
    timerRef.current = setTimeout(tick, 1000)
  }

  const start = () => {
    clearTimeout(timerRef.current)
    const cycle = () =>
      runPhase('inhale', 4, () =>
        runPhase('hold', 7, () =>
          runPhase('exhale', 8, cycle)
        )
      )
    cycle()
  }

  const stop = () => {
    clearTimeout(timerRef.current)
    setPhase('idle')
    setCount(0)
  }

  const phaseLabel = {
    idle:   'Nhấn để bắt đầu',
    inhale: `Hít vào... ${count}`,
    hold:   `Giữ... ${count}`,
    exhale: `Thở ra... ${count}`,
  }

  const phaseColor = {
    idle:   'bg-primary/30 hover:bg-primary/50',
    inhale: 'bg-primary/50 animate-breathe',
    hold:   'bg-secondary/60 animate-pulse-soft',
    exhale: 'bg-primary/30 animate-breathe',
  }

  return (
    <div className="card text-center py-12">
      <h3 className="font-display text-2xl text-text-main mb-2">Bài tập thở 4-7-8</h3>
      <p className="font-body text-text-sub text-sm mb-10">Giảm căng thẳng ngay lập tức</p>

      <div className="relative flex items-center justify-center mb-8">
        <div
          className={cn(
            'w-36 h-36 rounded-full flex items-center justify-center cursor-pointer transition-all duration-1000',
            phaseColor[phase]
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

      {phase !== 'idle' && (
        <button
          onClick={stop}
          className="font-ui text-xs text-text-sub hover:text-danger transition-colors cursor-pointer mb-4"
        >
          Dừng lại
        </button>
      )}

      <p className="font-body text-text-sub text-sm">Kỹ thuật 4-7-8 giúp hệ thần kinh bình tĩnh lại</p>
    </div>
  )
}

// Emoji và màu nền cho từng mood — dùng cho cả music lẫn podcast
const PODCAST_MOOD_EMOJI = { happy: '😄', sad: '🥺', calm: '🍃', energy: '⚡', sleep: '🌙' }
const PODCAST_MOOD_COLOR = {
  happy: 'bg-yellow-50', sad: 'bg-indigo-50', calm: 'bg-emerald-50',
  energy: 'bg-orange-50', sleep: 'bg-blue-50',
}

// Nhận dữ liệu thật thông qua props (musicList); podcast tự fetch từ API.
export default function ExplorePage({ musicList = [], podcastList = [] }) {
  const [searchParams] = useSearchParams()
  const [activeMood, setActiveMood] = useState(() => searchParams.get('mood') || 'all')
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'music')
  const [musicSearch, setMusicSearch] = useState('')
  const [podcastSearch, setPodcastSearch] = useState('')
  const [podcastMoodFilter, setPodcastMoodFilter] = useState(() => searchParams.get('mood') || 'all')

  const playingItem = useAppStore((s) => s.playingItem)
  const setPlayingItem = useAppStore((s) => s.setPlayingItem)
  const setIsMinimized = useAppStore((s) => s.setIsMinimized)

  // Đến từ Chat với Dora (vd "Xem thêm nhạc cho tâm trạng này" hoặc "Thử bài tập thở") —
  // đọc lại tab/mood mỗi khi query string đổi (không chỉ lúc mount), để bấm link nhiều lần từ
  // Chat vẫn cập nhật đúng filter thay vì bị kẹt ở lần đầu.
  useEffect(() => {
    const tab = searchParams.get('tab')
    const mood = searchParams.get('mood')
    if (tab && ['music', 'breathing', 'podcast'].includes(tab)) setActiveTab(tab)
    if (mood) {
      setActiveMood(mood)
      setPodcastMoodFilter(mood)
    }
  }, [searchParams])
  
  // Fetch toàn bộ nhạc 1 lần (không filter mood) — để search được cross-mood.
  // Mood filter được xử lý client-side: khi search → tìm tất cả; không search → lọc theo mood.
  const [fetchedMusic, setFetchedMusic] = useState([])
  const [loadingMusic, setLoadingMusic] = useState(false)

  useEffect(() => {
    if (activeTab !== 'music' || musicList.length > 0) return
    let cancelled = false
    setLoadingMusic(true)
    api.get('/contents?contentType=music&size=200')
      .then((res) => {
        if (cancelled) return
        const mapped = (res.content || [])
          .filter((c) => c.youtubeId)
          .map((c) => {
            const { title, artist } = splitTitleArtist(c.title)
            return {
              id: c.id,
              title,
              artist,
              mood: c.moodTag,
              youtubeId: c.youtubeId,
              emoji: MOOD_EMOJI[c.moodTag] || '🎵',
              color: MOOD_COLOR[c.moodTag] || 'bg-primary/10',
              thumbnailUrl: c.thumbnailUrl || null,
            }
          })
        setFetchedMusic(mapped)
      })
      .catch(() => setFetchedMusic([]))
      .finally(() => !cancelled && setLoadingMusic(false))
    return () => { cancelled = true }
  }, [activeTab, musicList.length])  // không phụ thuộc activeMood nữa

  // ---------- Podcast: tự fetch từ API khi tab podcast active ----------
  const [fetchedPodcasts, setFetchedPodcasts] = useState([])
  const [loadingPodcasts, setLoadingPodcasts] = useState(false)

  useEffect(() => {
    // Dùng prop nếu có (tương thích ngược), không thì tự fetch
    if (activeTab !== 'podcast' || podcastList.length > 0) return
    let cancelled = false
    setLoadingPodcasts(true)
    api.get('/contents?contentType=podcast&size=20')
      .then((res) => {
        if (cancelled) return
        const mapped = (res.content || []).map((c) => ({
          id: c.id,
          title: c.title,
          ep: c.description || '',
          youtubeId: c.youtubeId,
          mood: c.moodTag,
          duration: c.durationMinutes,
          emoji: PODCAST_MOOD_EMOJI[c.moodTag] || '🎙️',
          color: PODCAST_MOOD_COLOR[c.moodTag] || 'bg-primary/10',
          thumbnailUrl: c.thumbnailUrl || null,
        }))
        setFetchedPodcasts(mapped)
      })
      .catch(() => setFetchedPodcasts([]))
      .finally(() => !cancelled && setLoadingPodcasts(false))
    return () => { cancelled = true }
  }, [activeTab, podcastList.length])

  const sourceMusicList = musicList.length > 0 ? musicList : fetchedMusic
  const filtered = sourceMusicList.filter((m) => {
    const hit = matchSearch(`${m.title} ${m.artist || ''}`, musicSearch)
    // 'all' hoặc đang search → không filter mood
    if (activeMood === 'all' || musicSearch.trim()) return hit
    return m.mood === activeMood && hit
  })

  // Lọc podcast: mood + search chuẩn hoá tiếng Việt
  const allPodcasts = podcastList.length > 0 ? podcastList : fetchedPodcasts
  const filteredPodcasts = allPodcasts.filter((p) => {
    const hit = matchSearch(`${p.title} ${p.ep || ''}`, podcastSearch)
    const matchMood = podcastMoodFilter === 'all' || p.mood === podcastMoodFilter
    return hit && matchMood
  })

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

          {/* Search box */}
          <div className="relative mb-4">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm bài hát hoặc nghệ sĩ..."
              value={musicSearch}
              onChange={(e) => setMusicSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-primary/20 bg-white font-ui text-sm text-text-main placeholder:text-text-sub/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {musicSearch && (
              <button
                onClick={() => setMusicSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          {/* Mood filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
            {[
              { emoji: '🎶', label: 'Tất cả', value: 'all' },
              ...MOOD_FILTERS,
            ].map(f => (
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

          {loadingMusic && (
            <p className="font-ui text-sm text-text-sub mb-4">Đang tải nhạc...</p>
          )}

          {!loadingMusic && sourceMusicList.length > 0 && filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-ui text-text-sub text-sm">
                Không tìm thấy bài hát nào
                {musicSearch && <span> cho "<strong>{musicSearch}</strong>"</span>}
              </p>
              <button
                onClick={() => setMusicSearch('')}
                className="mt-3 font-ui text-xs text-primary hover:underline cursor-pointer"
              >
                Xoá tìm kiếm
              </button>
            </div>
          )}

          <motion.div layout className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((m, i) => {

              const isCurrentPlaying = playingItem && playingItem.youtubeId === m.youtubeId
              return (
                <motion.div
                  key={m.id || m.youtubeId || i}
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
                    <div className="w-full aspect-square rounded-2xl bg-white/50 overflow-hidden mb-4 shadow-inner relative select-none">
                      {getCoverUrl(m) ? (
                        <img src={getCoverUrl(m)} alt={m.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          {m.emoji}
                        </div>
                      )}
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
        <div className="animate-fade-in">

          {/* Search box */}
          <div className="relative mb-4">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm podcast..."
              value={podcastSearch}
              onChange={(e) => setPodcastSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-primary/20 bg-white font-ui text-sm text-text-main placeholder:text-text-sub/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {podcastSearch && (
              <button
                onClick={() => setPodcastSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          {/* Mood filter tags */}
          <div className="flex gap-2 flex-wrap mb-6">
            {[
              { value: 'all', label: 'Tất cả', emoji: '🎙️' },
              { value: 'calm', label: 'Chill', emoji: '🍃' },
              { value: 'sad', label: 'Chữa lành', emoji: '🥺' },
              { value: 'happy', label: 'Hài hước', emoji: '😄' },
              { value: 'sleep', label: 'Ngủ ngon', emoji: '🌙' },
            ].map((tag) => (
              <button
                key={tag.value}
                onClick={() => setPodcastMoodFilter(tag.value)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full font-ui text-xs font-medium transition-all duration-200 cursor-pointer border',
                  podcastMoodFilter === tag.value
                    ? 'bg-primary border-primary text-primary-dark shadow-sm scale-105'
                    : 'bg-white border-primary/20 text-text-sub hover:border-primary/50 hover:text-text-main'
                )}
              >
                <span>{tag.emoji}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>

          {loadingPodcasts && (
            <p className="font-ui text-sm text-text-sub mb-4">Đang tải podcast...</p>
          )}

          {!loadingPodcasts && allPodcasts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🎙️</p>
              <p className="font-ui text-text-sub text-sm">Chưa có podcast nào.</p>
            </div>
          )}

          {!loadingPodcasts && allPodcasts.length > 0 && filteredPodcasts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-ui text-text-sub text-sm">
                Không tìm thấy podcast nào
                {podcastSearch && <span> cho "<strong>{podcastSearch}</strong>"</span>}
              </p>
              <button
                onClick={() => { setPodcastSearch(''); setPodcastMoodFilter('all') }}
                className="mt-3 font-ui text-xs text-primary hover:underline cursor-pointer"
              >
                Xoá bộ lọc
              </button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {filteredPodcasts.map((p, i) => {

              const isCurrentPlaying = playingItem && (
                (p.youtubeId && playingItem.youtubeId === p.youtubeId) ||
                (p.id && playingItem.id === p.id)
              )
              return (
                <div
                  key={p.id || p.youtubeId || i}
                  className={cn(
                    'card-hover flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer',
                    isCurrentPlaying
                      ? 'border-primary bg-primary/10 shadow-card'
                      : `border-primary/20 ${p.color || 'bg-white'}`
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
                  {/* Cover or Emoji */}
                  {getCoverUrl(p) ? (
                    <div className={cn(
                      'w-14 h-14 rounded-2xl overflow-hidden shrink-0 select-none shadow-sm relative',
                      isCurrentPlaying ? 'ring-2 ring-primary' : ''
                    )}>
                      <img src={getCoverUrl(p)} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 select-none shadow-sm',
                      isCurrentPlaying ? 'bg-primary/20' : 'bg-white/70'
                    )}>
                      {p.emoji || '🎙️'}
                    </div>
                  )}

                  {/* Nội dung */}
                  <div className="min-w-0 flex-1">
                    <p className="font-body font-semibold text-text-main text-sm leading-snug mb-1">
                      {p.title}
                    </p>
                    <p className="font-ui text-xs text-text-sub line-clamp-2 mb-2">{p.ep}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {p.duration && (
                        <span className="font-ui text-xs text-text-sub/70 bg-white/60 rounded-full px-2 py-0.5">
                          ⏱ {p.duration} phút
                        </span>
                      )}
                      {isCurrentPlaying && (
                        <span className="font-ui text-xs text-primary font-medium animate-pulse">
                          ▶ Đang phát
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nút play/pause */}
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
                    className={cn(
                      'p-2.5 rounded-full shrink-0 transition-all duration-200 cursor-pointer',
                      isCurrentPlaying
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-white/70 text-text-sub hover:bg-white hover:text-text-main'
                    )}
                  >
                    {isCurrentPlaying
                      ? <Pause size={16} />
                      : <Play size={16} />}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}


    </div>
  )
}