import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Music, BookOpen, Trash2, Smile, Plus, MessageSquare, Menu, X, Play, Pause, Wind, Compass, LogIn, Edit2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../../components/atoms/Avatar'
import { useAppStore } from '../../store/useAppStore'
import { QUICK_REPLIES, formatTime, MOODS, cn } from '../../lib/utils'

const MIA_NAME = 'Dora'

// Mood do Gemini phân tích (happy|calm|sad|stress|sleep|energy) khác bộ mood dùng ở Journal
// (happy|neutral|sad|anxious|angry|loved) — map sang giá trị gần đúng nhất để prefill sẵn
// CircularMoodPicker khi điều hướng từ Chat sang Journal, đỡ bắt người dùng chọn lại từ đầu.
const CHAT_MOOD_TO_JOURNAL_MOOD = {
  happy: 'happy',
  sad: 'sad',
  stress: 'anxious',
  calm: 'neutral',
}

// content_library chỉ gắn nhãn mood trong 5 giá trị (happy|calm|sad|sleep|energy) — Gemini ở
// Chat thì có thêm "stress". Map "stress" sang "calm" (nội dung thư giãn) để link sang Explore
// vẫn ra kết quả thay vì trống trơn.
const CHAT_MOOD_TO_CONTENT_MOOD = {
  happy: 'happy', calm: 'calm', sad: 'sad', sleep: 'sleep', energy: 'energy', stress: 'calm',
}

const INITIAL_MESSAGE = {
  id: 'init-msg',
  role: 'ai',
  text: 'Chào bạn! Mình là Dora\nHôm nay bạn đang cảm thấy thế nào? Mình luôn ở đây để lắng nghe bạn nhé.',
  time: new Date(),
}

// Thẻ bài hát THẬT lấy từ content_library (field `songs` trong response chat), không phải AI
// tự chèn link. Áp dụng cho cả người đã đăng nhập (songs persist qua backend, xem msg.songs) lẫn
// khách (songs chỉ tồn tại tạm trong state của trang — xem handleSend nhánh guest bên dưới).
function SongCard({ song, isAI }) {
  const playingItem = useAppStore((s) => s.playingItem)
  const isPlaying = useAppStore((s) => s.isPlaying)

  if (!song?.youtubeId) return null

  const isCurrentPlaying = playingItem?.youtubeId === song.youtubeId && isPlaying

  const handleClick = () => {
    const isCurrent = playingItem?.youtubeId === song.youtubeId
    if (isCurrent) {
      useAppStore.getState().setIsPlaying(!isPlaying)
    } else {
      useAppStore.getState().setPlayingItem({
        title: song.title,
        artist: song.artist || 'Dora gợi ý cho bạn',
        youtubeId: song.youtubeId,
      })
      useAppStore.getState().setIsMinimized(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2.5 my-1.5 py-2 pl-2 pr-3.5 rounded-2xl border w-full max-w-xs text-left cursor-pointer transition-colors active:scale-[0.98]',
        isAI
          ? 'bg-primary/10 border-primary/20 hover:bg-primary/20'
          : 'bg-white/10 border-white/20 hover:bg-white/15'
      )}
    >
      <span
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
          isAI ? 'bg-primary/30 text-primary-dark' : 'bg-white/25 text-white'
        )}
      >
        {isCurrentPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn('block font-ui text-xs font-semibold truncate', isAI ? 'text-text-main' : 'text-white')}>
          {song.title}{song.artist ? ` — ${song.artist}` : ''}
        </span>
        <span className={cn('block font-ui text-[10px]', isAI ? 'text-text-sub' : 'text-white/60')}>
          {isCurrentPlaying ? 'Đang phát...' : 'Nhấn để phát ngay'}
        </span>
      </span>
    </button>
  )
}

// Khung chat hiển thị văn bản + thẻ nhạc gợi ý (nếu có) — không còn chip "Mở liên kết" hay link
// "Khám phá thêm" nữa, giữ giao diện gọn.
function ChatBubble({ msg }) {
  const isAI = msg.role === 'ai'
  const songs = msg.songs

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex items-start gap-3 mb-4', isAI ? 'justify-start' : 'justify-end')}
    >
      {isAI && (
        <Avatar name={MIA_NAME} src="/avatar.png" size="sm" className="mt-1 shrink-0" />
      )}
      <div className={cn('flex flex-col', isAI ? 'items-start' : 'items-end')}>
        {isAI && (
          <span className="font-ui text-xs text-text-sub mb-1 ml-1">{MIA_NAME}</span>
        )}
        <div className={isAI ? 'chat-bubble-ai' : 'chat-bubble-user'}>
          <div className="flex flex-col gap-1">
            <span className="whitespace-pre-line">{msg.text}</span>
            {isAI && songs?.map((song) => (
              <SongCard key={song.id || song.youtubeId} song={song} isAI={isAI} />
            ))}
          </div>
        </div>
        <span className="font-ui text-xs text-text-sub mt-1 mx-1">
          {formatTime(msg.time)}
        </span>
      </div>
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-start gap-3 mb-4"
    >
      <Avatar name={MIA_NAME} size="sm" className="mt-1 shrink-0" />
      <div className="chat-bubble-ai flex items-center gap-1.5 py-3 px-4">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 bg-text-sub rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function ChatPage() {
  const {
    messages, sendMessage, clearMessages, loadMessages,
    conversations, loadConversations, createConversation,
    sendGuestMessage, renameConversation,
    currentConversationId, user,
  } = useAppStore()

  // Chưa đăng nhập vẫn chat được với Dora, nhưng không có gì lưu vào DB — toàn bộ hội thoại chỉ
  // sống trong state của trang này (mất khi tải lại trang), khác với luồng đã đăng nhập dùng
  // messages/conversations từ store (được backend lưu lại).
  const isGuest = !user
  const [guestMessages, setGuestMessages] = useState([])

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const [ setLoaded] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  // Tâm trạng gần nhất Dora xác định được — dùng để tô sáng nút "Thở thư giãn" khi đang stress,
  // và prefill mood khi điều hướng sang Nhật ký/Khám phá.
  const [lastMood, setLastMood] = useState(null)
  // Hiển thị lỗi khi gọi API thất bại (mất mạng, backend lỗi, Gemini timeout...)
  const [sendError, setSendError] = useState(null)
  const navigate = useNavigate()

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const handleSaveRename = async (convId) => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== conversations.find(c => c.id === convId)?.title) {
      await renameConversation(convId, trimmed)
    }
    setEditingId(null)
  }

  const handleRenameKeyDown = (e, convId) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveRename(convId)
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  // Disable body scroll when ChatPage is active to prevent double scrollbars
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Load conversations + messages khi mount (chỉ khi đã đăng nhập — guest không có gì để tải)
  useEffect(() => {
    if (!user) return
    const load = async () => {
      await loadConversations()
      if (currentConversationId) {
        await loadMessages(currentConversationId)
      }
      setLoaded(true)
    }
    load()
  }, [user, currentConversationId])

  const activeMessages = isGuest ? guestMessages : messages

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages, isTyping])

  const handleSend = async (text = input.trim()) => {
    if (!text || isTyping) return
    setInput('')
    setIsTyping(true)
    setSendError(null)
    try {
      if (isGuest) {
        // Không có conversation/DB — gửi kèm lịch sử hiện có (chỉ trong state) để Dora vẫn hiểu
        // ngữ cảnh nhiều lượt, nhưng backend không lưu lại gì cả (xem GuestChatController).
        const historyForApi = guestMessages.map((m) => ({ role: m.role, content: m.text }))
        const userMsg = { id: `guest-${Date.now()}-u`, role: 'user', text, time: new Date() }
        setGuestMessages((prev) => [...prev, userMsg])

        const data = await sendGuestMessage(text, historyForApi)
        const aiMsg = {
          id: `guest-${Date.now()}-a`,
          role: 'ai',
          text: data?.reply || 'Xin lỗi, mình chưa nghe rõ. Bạn nói lại giúp mình nhé?',
          time: new Date(),
          songs: data?.songs || [],
        }
        setGuestMessages((prev) => [...prev, aiMsg])
        if (data?.mood) setLastMood(data.mood)
      } else {
        let convId = currentConversationId
        // Nếu chưa có conversation, tạo mới
        if (!convId) {
          const conv = await createConversation('Cuộc trò chuyện mới')
          convId = conv?.id
        }
        if (convId) {
          // sendMessage() chỉ gọi POST /api/conversations/{id}/chat — không có logic AI ở FE.
          const data = await sendMessage(convId, text)
          if (data?.mood) setLastMood(data.mood)
        }
      }
    } catch (e) {
      console.error('Send error:', e)
      setSendError('Không gửi được tin nhắn. Bạn kiểm tra kết nối mạng và thử lại nhé.')
    } finally {
      setIsTyping(false)
    }
    inputRef.current?.focus()
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClearChat = () => {
    if (isGuest) {
      if (window.confirm('Xoá đoạn hội thoại này? Lịch sử chat khách không được lưu nên sẽ mất hẳn.')) {
        setGuestMessages([])
      }
      return
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện này không?')) {
      clearMessages(currentConversationId)
    }
  }

  const handleSelectConversation = async (convId) => {
    useAppStore.setState({ currentConversationId: convId })
    await loadMessages(convId)
    setMobileSidebarOpen(false)
  }

  const handleNewConversation = async () => {
    await createConversation('Cuộc trò chuyện mới')
    setMobileSidebarOpen(false)
  }

  // Display initial instruction bubble if message history is empty
  const displayMessages = activeMessages.length === 0 ? [INITIAL_MESSAGE] : activeMessages

  const todayMood = useAppStore(s => s.todayMood)
  const todayMoodObj = MOODS.find(m => m.value === todayMood)

  return (
    <div className="fixed top-[65px] md:top-[97px] bottom-0 left-0 right-0 flex overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-[#16233D]/40 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 bottom-0 z-40 flex flex-col w-72 bg-white border-r border-primary/20 overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 lg:transform-none shadow-soft lg:shadow-none",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Close button for Mobile Sidebar */}
        <div className="lg:hidden absolute top-4 right-4 z-10">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 rounded-xl hover:bg-primary/10 text-text-sub transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 border-b border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-card">
              <img src="/avatar.png" alt="Dora" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-display font-semibold text-text-main">Dora</p>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="font-ui text-xs text-text-sub">Luôn trực tuyến</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-2xl">
            <span className="text-xl">{todayMoodObj?.emoji || '😌'}</span>
            <div>
              <p className="font-ui text-xs text-text-sub">Tâm trạng hôm nay</p>
              <p className="font-body text-sm text-text-main font-medium">{todayMoodObj?.label || 'Bình thường'}</p>
            </div>
          </div>
        </div>

        {isGuest ? (
          // Chưa đăng nhập — không có khái niệm "hội thoại đã lưu" vì backend không lưu gì cả.
          <div className="p-4 flex-1 flex flex-col min-h-0">
            <div className="flex flex-col items-center text-center gap-2 py-8 px-4 bg-primary/5 rounded-2xl border border-primary/10">
              <LogIn size={22} className="text-primary" />
              <p className="font-body text-sm text-text-main font-medium">Bạn đang chat với tư cách khách</p>
              <p className="font-ui text-xs text-text-sub leading-relaxed">
                Cuộc trò chuyện này sẽ không được lưu lại. Đăng nhập để Dora nhớ lịch sử và xem lại bất cứ lúc nào.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <p className="font-ui text-xs text-text-sub uppercase tracking-wider">Hội thoại</p>
              <button
                onClick={handleNewConversation}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-text-sub hover:text-primary transition-colors cursor-pointer"
                title="Tạo hội thoại mới"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-0">
              {conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={cn(
                      "group flex items-center justify-between gap-3 px-3 py-3 rounded-2xl border border-transparent transition-colors",
                      conv.id === currentConversationId
                        ? "bg-primary/15 border-primary/30"
                        : "bg-primary/5 hover:bg-primary/10"
                    )}
                  >
                    <div
                      onClick={() => handleSelectConversation(conv.id)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <MessageSquare size={16} className="text-text-sub shrink-0" />
                      <div className="min-w-0 flex-1">
                        {editingId === conv.id ? (
                          <input
                            autoFocus
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => handleSaveRename(conv.id)}
                            onKeyDown={(e) => handleRenameKeyDown(e, conv.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white border border-primary/40 rounded px-1.5 py-0.5 text-sm focus:outline-none focus:border-primary font-body text-text-main"
                          />
                        ) : (
                          <>
                            <p className="font-body text-sm text-text-main truncate">{conv.title || 'Cuộc trò chuyện'}</p>
                            <p className="font-ui text-[10px] text-text-sub">
                              {conv.updatedAt ? new Date(conv.updatedAt).toLocaleDateString('vi-VN') : ''}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {!isGuest && conv.id === currentConversationId && editingId !== conv.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingId(conv.id)
                          setEditTitle(conv.title || '')
                        }}
                        className="p-1 rounded hover:bg-primary/20 text-text-sub hover:text-primary transition-colors cursor-pointer shrink-0"
                        title="Đổi tên cuộc trò chuyện"
                      >
                        <Edit2 size={13} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center px-4">
                  <p className="text-2xl mb-1">💬</p>
                  <p className="font-ui text-xs text-text-sub leading-relaxed">
                    Chưa có hội thoại nào.<br />Hãy bắt đầu trò chuyện nhé!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-chat-blobs relative h-full">
        {/* Unified Light overlay for consistent background blending */}
        <div className="absolute inset-0 bg-[#FCFAF5]/50 backdrop-blur-[1px] pointer-events-none" />

        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-primary/20 z-10 shadow-sm">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-primary/10 text-text-main transition-colors cursor-pointer"
            title="Mở danh sách hội thoại"
          >
            <Menu size={20} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-card">
            <img src="/avatar.png" alt="Dora" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-display font-semibold text-text-main">Dora</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="font-ui text-xs text-text-sub">Đang hoạt động</span>
            </div>
          </div>
          {activeMessages.length > 0 && (
            <button
              onClick={handleClearChat}
              title="Xóa lịch sử hội thoại"
              className="ml-auto p-2 rounded-xl hover:bg-red-50 text-text-sub hover:text-red-600 transition-colors cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 z-10 bg-transparent chat-messages-container">
          <div className="max-w-2xl mx-auto">
            {displayMessages.map(msg => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
            <AnimatePresence>
              {isTyping && <TypingIndicator />}
            </AnimatePresence>
            <div ref={endRef} />
          </div>
        </div>

        {/* Bottom Floating Control Panel */}
        <div className="bg-transparent pt-3 px-4 md:px-8 z-10 pb-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
            {/* Error banner — hiển thị khi gọi API chat thất bại */}
            <AnimatePresence>
              {sendError && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 font-ui text-xs"
                >
                  <span>{sendError}</span>
                  <button
                    onClick={() => setSendError(null)}
                    className="shrink-0 hover:text-red-800 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick replies */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide select-none">
              {QUICK_REPLIES.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qr.value)}
                  className="mood-chip bg-white border border-primary/25 text-text-sub hover:bg-primary hover:text-white hover:border-primary whitespace-nowrap cursor-pointer text-xs py-1.5 px-4 shadow-sm active:scale-95 transition-all duration-200"
                >
                  {qr.label}
                </button>
              ))}
            </div>

            {/* Action shortcuts — cầu nối Chat sang các mục khác (Nhật ký, Thở, Khám phá) để Dora
                thực sự là người bạn đồng hành xuyên suốt app, không chỉ dừng lại trong khung chat */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => handleSend('Gợi ý cho mình một bài nhạc phù hợp với tâm trạng nhé 🎵')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent/15 hover:bg-accent/30 text-text-main font-ui text-xs hover:text-primary-dark transition-all duration-200 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
              >
                <Music size={13} className="text-primary" /> Gợi ý nhạc
              </button>
              <button
                onClick={() => navigate('/journal', {
                  state: { openWrite: true, mood: CHAT_MOOD_TO_JOURNAL_MOOD[lastMood] || '' },
                })}
                title="Mở trang Nhật ký, tự điền sẵn tâm trạng vừa trò chuyện"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary/15 hover:bg-secondary/35 text-text-main font-ui text-xs hover:text-[#9A7D18] transition-all duration-200 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
              >
                <BookOpen size={13} className="text-[#C9A227]" /> Ghi nhật ký
              </button>
              <button
                onClick={() => navigate('/explore?tab=breathing')}
                title="Bài tập thở 4-7-8 giúp bình tĩnh lại"
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-full font-ui text-xs transition-all duration-200 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap',
                  lastMood === 'stress'
                    ? 'bg-primary text-white hover:bg-primary-dark animate-pulse-soft'
                    : 'bg-primary/10 hover:bg-primary/20 text-text-main hover:text-primary-dark'
                )}
              >
                <Wind size={13} className={lastMood === 'stress' ? 'text-white' : 'text-primary'} /> Thở thư giãn
              </button>
              <button
                onClick={() => navigate(lastMood ? `/explore?mood=${CHAT_MOOD_TO_CONTENT_MOOD[lastMood] || lastMood}` : '/explore')}
                title="Khám phá thêm nhạc, podcast và bài tập thở"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/15 text-text-main font-ui text-xs hover:text-primary transition-all duration-200 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
              >
                <Compass size={13} className="text-secondary" /> Khám phá
              </button>
            </div>

            {/* Input box card */}
            <div className="flex gap-3 items-end bg-white border border-primary/20 rounded-[2rem] p-2.5 shadow-soft">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Nhập tin nhắn với Dora..."
                  rows={1}
                  className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none py-3.5 pl-4 pr-10 resize-none min-h-[44px] max-h-32 font-body text-text-main placeholder-text-sub/50 text-sm leading-relaxed"
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
                  }}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main transition-colors cursor-pointer">
                  <Smile size={18} />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className={cn(
                  'w-11 h-11 rounded-[1.25rem] flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer',
                  input.trim() && !isTyping
                    ? 'bg-primary text-white shadow-card hover:bg-primary-dark'
                    : 'bg-primary/20 text-text-sub/30 cursor-not-allowed'
                )}
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
