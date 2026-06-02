import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Music, BookOpen, MoreHorizontal, Smile } from 'lucide-react'
import Avatar from '../../components/atoms/Avatar'
import Button from '../../components/atoms/Button'
import { useAppStore } from '../../store/useAppStore'
import { QUICK_REPLIES, formatTime } from '../../lib/utils'
import { cn } from '../../lib/utils'

const MIA_AVATAR = null
const MIA_NAME = 'Mia'

const INITIAL_MESSAGE = {
  id: 1,
  role: 'ai',
  text: 'Chào bạn! Mình là Mia\nHôm nay bạn đang cảm thấy thế nào? Mình luôn ở đây để lắng nghe bạn nhé.',
  time: new Date(),
}

const SIDEBAR_HISTORY = [
  { date: 'Hôm nay', mood: '😌', preview: 'Hôm nay mình hơi mệt...' },
  { date: 'Hôm qua', mood: '😊', preview: 'Ngày hôm qua khá vui!' },
  { date: '27/05', mood: '😔', preview: 'Nhiều chuyện xảy ra quá...' },
]

function ChatBubble({ msg }) {
  const isAI = msg.role === 'ai'
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
          <p className="whitespace-pre-line">{msg.text}</p>
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
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
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

  const handleSend = (text = input.trim()) => {
    if (!text) return

    const userMsg = { id: Date.now(), role: 'user', text, time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: getMiaReply(text),
        time: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
    }, 1200 + Math.random() * 600)

    inputRef.current?.focus()
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
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
            <span className="text-xl">😌</span>
            <div>
              <p className="font-ui text-xs text-text-sub">Tâm trạng hôm nay</p>
              <p className="font-body text-sm text-text-main font-medium">Bình thường</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="font-ui text-xs text-text-sub uppercase tracking-wider mb-3">Lịch sử</p>
          <div className="flex flex-col gap-1">
            {SIDEBAR_HISTORY.map((h, i) => (
              <button
                key={i}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-colors duration-200 hover:bg-primary/10',
                  i === 0 && 'bg-primary/20'
                )}
              >
                <span className="text-lg">{h.mood}</span>
                <div className="min-w-0">
                  <p className="font-ui text-xs text-text-sub">{h.date}</p>
                  <p className="font-body text-sm text-text-main truncate">{h.preview}</p>
                </div>
              </button>
            ))}
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
          <button className="ml-auto p-2 rounded-xl hover:bg-primary/10 transition-colors text-text-sub">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="max-w-2xl mx-auto">
            {messages.map(msg => (
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
                className="mood-chip bg-white border border-primary/40 text-text-sub hover:bg-primary/20 hover:border-primary hover:text-text-main whitespace-nowrap"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/60 text-text-main font-ui text-xs hover:bg-accent transition-colors duration-200"
            >
              <Music size={13} /> Gợi ý nhạc
            </button>
            <button
              onClick={() => handleSend('Mình muốn ghi nhật ký về hôm nay 📝')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/30 text-text-main font-ui text-xs hover:bg-secondary/50 transition-colors duration-200"
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
              disabled={!input.trim()}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200',
                input.trim()
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
