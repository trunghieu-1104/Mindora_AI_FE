import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minimize2, Maximize2, X, Disc, Play, Pause } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

function formatDuration(sec) {
  if (!sec || Number.isNaN(sec) || !Number.isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Tải script YouTube IFrame API đúng 1 lần cho toàn bộ app, dù component
// SpotifyPlayer có mount/unmount nhiều lần (chuyển trang...).
let ytApiPromise = null
function loadYoutubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (ytApiPromise) return ytApiPromise

  ytApiPromise = new Promise((resolve) => {
    const prevCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevCallback === 'function') prevCallback()
      resolve(window.YT)
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
  return ytApiPromise
}

/**
 * Player nhạc duy nhất của app — chỉ dùng YouTube làm nguồn âm thanh (bài hát THẬT, có lời,
 * free, không cần đăng nhập bất kỳ tài khoản nào). Video có kích thước thật (300x300) nhưng bị
 * khung UI đè lên che khuất hoàn toàn (KHÔNG dùng opacity:0/1x1 — xem comment ở JSX bên dưới,
 * cách đó khiến Chrome chặn autoplay âm thanh). UI hiển thị vẫn là đĩa nhạc xoay + nút play/pause
 * + thanh tua quen thuộc, điều khiển qua YouTube IFrame Player API (postMessage), không phải
 * thẻ <audio> thật nhưng trải nghiệm giống hệt.
 */
export default function SpotifyPlayer() {
  const { playingItem, setPlayingItem, isMinimized, setIsMinimized, isPlaying, setIsPlaying } = useAppStore()
  const containerRef = useRef(null)        // wrapper div cố định — không bao giờ bị YT API thay thế trực tiếp
  const playerRef = useRef(null)
  const pollRef = useRef(null)
  const watchdogRef = useRef(null)         // timer "đơ quá lâu → tự khôi phục"
  const readyRef = useRef(false)           // bản sao dạng ref của `ready`, đọc được ngay trong callback async
  const loadedIdRef = useRef(null)         // id đang được yêu cầu phát, dùng để watchdog biết cần khôi phục bài nào
  const recoveredIdsRef = useRef(new Set()) // tránh tự khôi phục lặp vô hạn cho cùng 1 bài bị lỗi thật
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [ready, setReady] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const youtubeId = playingItem?.youtubeId || null

  const getCoverUrl = (item) => {
    if (!item) return null
    if (item.thumbnailUrl && item.thumbnailUrl.startsWith('/')) {
      return item.thumbnailUrl
    }
    if (item.youtubeId) {
      return `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
    }
    return item.thumbnailUrl
  }

  const clearWatchdog = () => {
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current)
      watchdogRef.current = null
    }
  }

  /**
   * Trước đây khi đổi bài nhanh, player có thể bị "đơ" (cầu nối postMessage giữa page và iframe
   * YouTube không phản hồi) — không lỗi, không phát, phải F5 cả trang mới hết. Nguyên nhân chính:
   * gọi loadVideoById() trên player CHƯA sẵn sàng (chưa bắn onReady lần đầu), hoặc mạng chập chờn
   * khiến bài mới không bao giờ vào state "playing". Watchdog này tự phát hiện và khôi phục — phá
   * hủy + tạo lại player (chỉ phần player, không cần tải lại trang) — thay cho việc người dùng phải F5.
   */
  const armWatchdog = (id) => {
    clearWatchdog()
    watchdogRef.current = setTimeout(() => {
      if (recoveredIdsRef.current.has(id)) {
        // Đã tự khôi phục 1 lần cho bài này mà vẫn không phát được → dừng lại, báo lỗi thay vì lặp vô hạn.
        setErrorMsg('Không phát được bài này, thử chọn bài khác nhé')
        setIsPlaying(false)
        clearWatchdog()
        return
      }
      recoveredIdsRef.current.add(id)
      console.warn('[YouTube Player] Phát bị treo quá lâu — tự khởi động lại player cho', id)
      attachPlayer(null, id) // null → tự lấy lại YT từ loadYoutubeApi() bên trong
    }, 8000)
  }

  /** Tạo (hoặc tạo lại) player cho đúng 1 bài — dùng chung cho lần đầu, đổi bài khi chưa sẵn sàng, và khôi phục. */
  const attachPlayer = (YT, id) => {
    const build = (ytApi) => {
      // Dọn player cũ (nếu có) trước khi tạo mới — an toàn dù player cũ đang dở dang hay đã lỗi.
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch { /* player có thể đang ở trạng thái lỗi, bỏ qua */ }
        playerRef.current = null
      }
      // Luôn tạo mount point MỚI thay vì tái dùng node cũ — YT API thay hẳn element được truyền vào
      // bằng iframe, tái dùng ref cũ sau destroy() có thể trỏ vào node đã bị gỡ khỏi DOM.
      if (containerRef.current) containerRef.current.innerHTML = ''
      const mountEl = document.createElement('div')
      containerRef.current?.appendChild(mountEl)

      loadedIdRef.current = id
      readyRef.current = false
      setReady(false)
      setErrorMsg(null)

      playerRef.current = new ytApi.Player(mountEl, {
        videoId: id,
        width: 300,
        height: 300,
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, playsinline: 1, mute: 0 },
        events: {
          onReady: () => {
            readyRef.current = true
            setReady(true)
            setDuration(playerRef.current.getDuration() || 0)
            playerRef.current.unMute()
            playerRef.current.playVideo()
          },
          onStateChange: (e) => {
            if (e.data === 1) {
              setIsPlaying(true)
              setDuration(playerRef.current.getDuration() || 0)
              clearWatchdog()
              recoveredIdsRef.current.delete(loadedIdRef.current)
            }
            if (e.data === 2 || e.data === 0) { setIsPlaying(false); clearWatchdog() }
          },
          onError: (e) => {
            const code = e.data
            const msg = code === 101 || code === 150
              ? 'Video này không cho phép phát nhúng'
              : code === 100
              ? 'Video không tồn tại hoặc đã bị xóa'
              : `Không phát được (lỗi ${code})`
            console.error('[YouTube Player]', msg, loadedIdRef.current)
            setErrorMsg(msg)
            setIsPlaying(false)
            clearWatchdog()
          },
        },
      })

      armWatchdog(id)
    }

    if (YT) build(YT)
    else loadYoutubeApi().then(build)
  }

  // Khởi tạo YT.Player đúng 1 lần, rồi mỗi lần đổi bài chỉ cần loadVideoById (nhanh hơn tạo lại).
  useEffect(() => {
    if (!youtubeId) return
    let cancelled = false

    loadYoutubeApi().then((YT) => {
      if (cancelled) return

      if (!playerRef.current || !readyRef.current) {
        // Chưa có player, hoặc player đang dở dang (chưa từng bắn onReady) — build thẳng cho bài
        // mới thay vì gọi loadVideoById trên player chưa sẵn sàng (chính là gốc rễ hay gây treo).
        attachPlayer(YT, youtubeId)
      } else {
        // Player đã sẵn sàng từ trước — chỉ cần load bài mới, nhanh và mượt hơn tạo lại từ đầu.
        setProgress(0)
        setErrorMsg(null)
        loadedIdRef.current = youtubeId
        playerRef.current.loadVideoById(youtubeId)
        armWatchdog(youtubeId)
      }
    })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId])

  // Đồng bộ nút play/pause (bấm ở ChatPage/Explore/player) với YT.Player thật.
  useEffect(() => {
    if (!ready || !playerRef.current || !youtubeId) return
    if (isPlaying) {
      playerRef.current.playVideo()
    } else {
      playerRef.current.pauseVideo()
    }
  }, [isPlaying, ready, youtubeId])

  // Poll tiến độ phát mỗi 500ms trong lúc đang phát (YT API không có sự kiện timeupdate).
  useEffect(() => {
    clearInterval(pollRef.current)
    if (isPlaying && ready) {
      pollRef.current = setInterval(() => {
        if (playerRef.current?.getCurrentTime) {
          setProgress(playerRef.current.getCurrentTime())
        }
      }, 500)
    }
    return () => clearInterval(pollRef.current)
  }, [isPlaying, ready])

  // Dọn dẹp player khi component unmount hẳn (rời toàn bộ app).
  useEffect(() => {
    return () => {
      clearInterval(pollRef.current)
      clearWatchdog()
      try { playerRef.current?.destroy?.() } catch { /* ignore */ }
      playerRef.current = null
    }
  }, [])

  if (!playingItem || !youtubeId) return null

  const handleClose = () => {
    playerRef.current?.pauseVideo?.()
    setPlayingItem(null)
  }

  const handleSeek = (e) => {
    const val = Number(e.target.value)
    playerRef.current?.seekTo?.(val, true)
    setProgress(val)
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
        {/*
          YouTube player thật — dùng để phát audio nền, không cần xem video.
          QUAN TRỌNG: KHÔNG được ẩn kiểu opacity:0 + kích thước 1x1 + đưa ra ngoài màn hình —
          Chrome coi đó là dấu hiệu "autoplay lén" (sneaky autoplay) và sẽ CHẶN ÂM THANH hoàn
          toàn dù UI vẫn hiển thị bình thường (không báo lỗi gì, trông như đang phát nhưng câm).
          Thay vào đó: để iframe có kích thước thật, nằm trong khung nhìn (position:absolute,
          inset:0, lấp đầy đúng khung của widget này) — chỉ đơn giản bị khung player (nền đặc,
          vẽ sau nó trong DOM) che phủ hoàn toàn lên trên, nên mắt người dùng vẫn không thấy gì.
        */}
        <div
          style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 24, pointerEvents: 'none' }}
        >
          <div ref={containerRef} />
        </div>

        {isMinimized ? (
          /* Minimized pill state */
          <motion.div
            layoutId="youtube-player-container"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-3 bg-secondary-dark/95 backdrop-blur-md text-white px-5 py-3.5 rounded-full shadow-soft border border-white/10 cursor-pointer hover:bg-secondary-dark transition-colors max-w-xs sm:max-w-sm"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsPlaying(!isPlaying)
              }}
              className="w-8 h-8 shrink-0 rounded-full bg-primary/25 hover:bg-primary/40 flex items-center justify-center text-primary transition-colors"
              title={isPlaying ? 'Tạm dừng' : 'Phát'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate leading-none mb-0.5">
                {playingItem.title}
              </p>
              <p className="text-[10px] text-white/50 truncate leading-none">
                {playingItem.artist || 'Đang phát'}
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
            layoutId="youtube-player-container"
            className="w-64 bg-secondary-dark/95 backdrop-blur-md text-white rounded-3xl overflow-hidden shadow-soft border border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="min-w-0">
                <h4 className="text-[11px] font-bold truncate leading-tight">{playingItem.title}</h4>
                <p className="text-[9px] text-white/60 truncate leading-none">{playingItem.artist}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
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

            {/* Chỉ nghe, không hiện video */}
            <div className="p-5 flex flex-col items-center gap-4">
              {errorMsg ? (
                <div className="w-full text-center py-3 px-3 bg-red-500/20 rounded-2xl">
                  <p className="text-[11px] text-red-300 font-ui">{errorMsg}</p>
                  <p className="text-[10px] text-white/40 mt-1">Thử chọn podcast khác</p>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-primary/15 flex items-center justify-center shadow-inner relative select-none">
                  {getCoverUrl(playingItem) ? (
                    <img src={getCoverUrl(playingItem)} alt={playingItem.title} className="w-full h-full object-cover" />
                  ) : playingItem?.emoji ? (
                    <span style={{ fontSize: 40 }}>{playingItem.emoji}</span>
                  ) : (
                    <Disc
                      className="w-10 h-10 text-primary"
                      style={isPlaying ? { animation: 'spin 3s linear infinite' } : undefined}
                    />
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={!!errorMsg}
                className="w-14 h-14 rounded-full bg-primary text-text-main flex items-center justify-center shadow-card hover:bg-primary-dark transition-colors cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                title={isPlaying ? 'Tạm dừng' : 'Phát'}
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
              </button>

              {!errorMsg && (
                <div className="w-full flex flex-col gap-1.5">
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={Math.min(progress, duration || 0)}
                    onChange={handleSeek}
                    className="w-full h-1.5 accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/50 font-ui">
                    <span>{formatDuration(progress)}</span>
                    <span>{formatDuration(duration)}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
