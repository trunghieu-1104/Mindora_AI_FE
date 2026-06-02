import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Music, BookOpen, Trash2, Smile, ExternalLink } from 'lucide-react'
import Avatar from '../../components/atoms/Avatar'
import Button from '../../components/atoms/Button'
import { useAppStore } from '../../store/useAppStore'
import { QUICK_REPLIES, formatTime, MOODS } from '../../lib/utils'
import { askMia } from '../../lib/gemini'
import { cn } from '../../lib/utils'

const MIA_AVATAR = null
const MIA_NAME = 'Mia'

const INITIAL_MESSAGE = {
  id: 'init-msg',
  role: 'ai',
  text: 'Chào bạn! Mình là Mia\nHôm nay bạn đang cảm thấy thế nào? Mình luôn ở đây để lắng nghe bạn nhé.',
  time: new Date(),
}

function ChatBubble({ msg }) {
  const isAI = msg.role === 'ai'

  const renderMessageText = (text) => {
    if (!text) return ''
    
    // Tách văn bản bằng Regex tìm link URL
    const parts = text.split(/(https?:\/\/[^\s]+)/g)
    return parts.map((part, i) => {
      if (part.match(/^https?:\/\/[^\s]+/)) {
        const isSpotify = part.includes('spotify.com')
        
        return (
          <span 
            key={i} 
            className={cn(
              "inline-flex flex-col gap-1.5 my-1.5 p-2.5 rounded-2xl border w-full max-w-xs",
              isAI 
                ? "bg-primary/10 border-primary/20 text-text-main" 
                : "bg-white/10 border-white/20 text-white"
            )}
          >
            <a 
              href={part} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={cn(
                "hover:underline font-ui text-xs font-semibold flex items-center gap-1.5",
                isAI ? "text-secondary hover:text-secondary-dark" : "text-white hover:text-white/80"
              )}
            >
              <span>{isSpotify ? '🎵 Nghe trên Spotify' : '🔗 Mở liên kết'}</span>
              <ExternalLink size={12} />
            </a>
            {isSpotify && (
              <button
                onClick={() => {
                  const fakeItem = {
                    title: 'Nhạc đề xuất từ Mia',
                    artist: 'Chọn lọc từ cuộc trò chuyện',
                    spotifyUrl: part,
                    emoji: '🌸'
                  }
                  useAppStore.getState().setPlayingItem(fakeItem)
                  useAppStore.getState().setIsMinimized(false)
                }}
                className="px-3 py-1 bg-primary text-text-main rounded-full font-ui text-[10px] font-bold hover:bg-primary-dark cursor-pointer transition-colors shadow-sm w-fit active:scale-95"
              >
                Phát ngay ⚡
              </button>
            )}
          </span>
        )
      }
      return <span key={i} className="whitespace-pre-line">{part}</span>
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3 mb-4', isAI ? 'justify-start' : 'justify-end')}
    >
      {isAI && (
        <Avatar name={MIA_NAME} size="sm" className="mt-1 shrink-0 bg-primary" />
      )}
      <div className={cn('flex flex-col', isAI ? 'items-start' : 'items-end')}>
        {isAI && (
          <span className="font-ui text-xs text-text-sub mb-1 ml-1">{MIA_NAME}</span>
        )}
        <div className={isAI ? 'chat-bubble-ai' : 'chat-bubble-user'}>
          <div className="flex flex-col gap-1">{renderMessageText(msg.text)}</div>
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
      className="flex gap-3 mb-4"
    >
      <Avatar name={MIA_NAME} size="sm" className="mt-1 shrink-0 bg-primary" />
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
  const { messages, addMessage, clearMessages, journals, user } = useAppStore()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const getMiaReply = (userText) => {
    const text = userText.toLowerCase()
    if (text.includes('mệt') || text.includes('kiệt sức'))
      return 'Mình hiểu cảm giác mệt mỏi đó 🌙 Bạn có muốn nghe một bài nhạc nhẹ nhàng để thư giãn không? Hoặc kể mình nghe thêm nhé — điều gì đang khiến bạn mệt vậy?'
    if (text.includes('buồn') || text.includes('khóc'))
      return 'Buồn cũng được mà bạn ơi 🌧️ Đôi khi cho phép bản thân buồn là điều cần thiết. Mình ở đây lắng nghe bạn. Chuyện gì đã xảy ra vậy?'
    if (text.includes('stress') || text.includes('lo lắng') || text.includes('áp lực'))
      return 'Nghe có vẻ bạn đang chịu nhiều áp lực quá 😮‍💨 Thử thở sâu cùng mình nhé? Hít vào 4 giây... giữ 4 giây... thở ra 6 giây. Bạn cảm thấy thế nào sau khi thở?'
    if (text.includes('vui') || text.includes('hạnh phúc') || text.includes('ổn'))
      return 'Thật tuyệt khi nghe bạn ổn! 🌸 Điều gì làm bạn vui hôm nay vậy? Kể mình nghe với!'
    return 'Mình hiểu rồi 💙 Cảm ơn bạn đã chia sẻ với mình. Bạn có muốn nói thêm về điều này không, hay mình gợi ý một số bài nhạc phù hợp với tâm trạng của bạn?'
  }

  const handleSend = async (text = input.trim()) => {
    if (!text) return

    // Add user message to store (and sync with DB if logged in)
    await addMessage({ role: 'user', text, time: new Date() })
    setInput('')
    setIsTyping(true)

    // Call Gemini API and add response
    try {
      const aiReply = await askMia(text, messages)
      await addMessage({
        role: 'ai',
        text: aiReply,
        time: new Date(),
      })
    } catch (err) {
      console.warn('Gemini error, falling back to local handler:', err)
      // Robust offline fallback
      setTimeout(async () => {
        const localReply = getMiaReply(text)
        await addMessage({
          role: 'ai',
          text: localReply,
          time: new Date(),
        })
      }, 1000)
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
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện này không?')) {
      clearMessages()
    }
  }

  // Generate dynamic sidebar history from user's actual journal entries
  const sidebarHistory = journals.slice(0, 5).map((j) => {
    const moodObj = MOODS.find((m) => m.value === j.mood)
    return {
      date: new Date(j.date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' }),
      mood: moodObj?.emoji || '😊',
      preview: j.text,
    }
  })

  // Display initial instruction bubble if message history is empty
  const displayMessages = messages.length === 0 ? [INITIAL_MESSAGE] : messages

  const userDisplayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Bạn'
  const todayMood = useAppStore(s => s.todayMood)
  const todayMoodObj = MOODS.find(m => m.value === todayMood)

  return (
    <div className="flex h-[calc(100vh-96px)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-primary/20 overflow-y-auto">
        <div className="p-5 border-b border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
              🌸
            </div>
            <div>
              <p className="font-display font-semibold text-text-main">Mia</p>
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

        <div className="p-4 flex-1 flex flex-col min-h-0">
          <p className="font-ui text-xs text-text-sub uppercase tracking-wider mb-3">Nhật ký gần đây</p>
          <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-0">
            {sidebarHistory.length > 0 ? (
              sidebarHistory.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl text-left bg-primary/5 border border-transparent"
                >
                  <span className="text-lg shrink-0">{h.mood}</span>
                  <div className="min-w-0">
                    <p className="font-ui text-xs text-text-sub">{h.date}</p>
                    <p className="font-body text-sm text-text-main truncate">{h.preview}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center px-4">
                <p className="text-2xl mb-1">📝</p>
                <p className="font-ui text-xs text-text-sub leading-relaxed">
                  Chưa có nhật ký nào.<br />Hãy ghi nhật ký ở trang tiếp theo nhé!
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-bg">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-primary/20">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl shrink-0">
            🌸
          </div>
          <div>
            <p className="font-display font-semibold text-text-main">Mia</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="font-ui text-xs text-text-sub">Đang hoạt động</span>
            </div>
          </div>
          {messages.length > 0 && (
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
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
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

        {/* Quick replies */}
        <div className="px-4 md:px-8 pb-2">
          <div className="max-w-2xl mx-auto flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {QUICK_REPLIES.map((qr, i) => (
              <button
                key={i}
                onClick={() => handleSend(qr.value)}
                className="mood-chip bg-white border border-primary/40 text-text-sub hover:bg-primary/20 hover:border-primary hover:text-text-main whitespace-nowrap cursor-pointer"
              >
                {qr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action shortcuts */}
        <div className="px-4 md:px-8 pb-2">
          <div className="max-w-2xl mx-auto flex gap-2">
            <button
              onClick={() => handleSend('Gợi ý cho mình một bài nhạc phù hợp với tâm trạng nhé 🎵')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/60 text-text-main font-ui text-xs hover:bg-accent transition-colors duration-200 cursor-pointer"
            >
              <Music size={13} /> Gợi ý nhạc
            </button>
            <button
              onClick={() => handleSend('Mình muốn ghi nhật ký về hôm nay 📝')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/30 text-text-main font-ui text-xs hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
            >
              <BookOpen size={13} /> Ghi nhật ký
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="px-4 md:px-8 pb-4 pt-2 bg-white border-t border-primary/20">
          <div className="max-w-2xl mx-auto flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Nhập tin nhắn..."
                rows={1}
                className="input-field resize-none pr-10 min-h-[48px] max-h-32"
                style={{ height: 'auto' }}
                onInput={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
                }}
              />
              <button className="absolute right-3 bottom-3 text-text-sub hover:text-text-main transition-colors">
                <Smile size={18} />
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer',
                input.trim() && !isTyping
                  ? 'bg-primary text-text-main shadow-card hover:bg-primary-dark'
                  : 'bg-primary/30 text-text-sub cursor-not-allowed'
              )}
            >
              <Send size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
