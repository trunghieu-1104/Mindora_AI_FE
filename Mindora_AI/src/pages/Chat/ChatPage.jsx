import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Music, BookOpen, Trash2, Smile, ExternalLink, Plus, MessageSquare, Menu, X } from 'lucide-react'
import Avatar from '../../components/atoms/Avatar'
import { useAppStore } from '../../store/useAppStore'
import { QUICK_REPLIES, formatTime, MOODS, cn } from '../../lib/utils'

const MIA_NAME = 'Dora'

const INITIAL_MESSAGE = {
  id: 'init-msg',
  role: 'ai',
  text: 'Chào bạn! Mình là Dora\nHôm nay bạn đang cảm thấy thế nào? Mình luôn ở đây để lắng nghe bạn nhé.',
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
              <span>{isSpotify ? 'Nghe trên Spotify' : 'Mở liên kết'}</span>
              <ExternalLink size={12} />
            </a>
            {isSpotify && (
              <button
                onClick={() => {
                  const fakeItem = {
                    title: 'Nhạc đề xuất từ Dora',
                    artist: 'Chọn lọc từ cuộc trò chuyện',
                    spotifyUrl: part,
                    
                  }
                  useAppStore.getState().setPlayingItem(fakeItem)
                  useAppStore.getState().setIsMinimized(false)
                }}
                className="px-3 py-1 bg-primary text-text-main rounded-full font-ui text-[10px] font-bold hover:bg-primary-dark cursor-pointer transition-colors shadow-sm w-fit active:scale-95"
              >
                Phát ngay
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
      className={cn('flex items-start gap-3 mb-4', isAI ? 'justify-start' : 'justify-end')}
    >
      {isAI && (
        <Avatar name={MIA_NAME} size="sm" className="mt-1 shrink-0" />
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
    currentConversationId, user,
  } = useAppStore()

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Load conversations + messages khi mount
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

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (text = input.trim()) => {
    if (!text || isTyping) return
    setInput('')
    setIsTyping(true)
    try {
      let convId = currentConversationId
      // Nếu chưa có conversation, tạo mới
      if (!convId) {
        const conv = await createConversation('Cuộc trò chuyện mới')
        convId = conv?.id
      }
      if (convId) {
        await sendMessage(convId, text)
      }
    } catch (e) {
      console.error('Send error:', e)
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
  const displayMessages = messages.length === 0 ? [INITIAL_MESSAGE] : messages

  const todayMood = useAppStore(s => s.todayMood)
  const todayMoodObj = MOODS.find(m => m.value === todayMood)

  return (
    <div className="flex h-[calc(100vh-96px)] relative overflow-hidden">
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
              🌸
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
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-2xl text-left border border-transparent transition-colors cursor-pointer",
                    conv.id === currentConversationId
                      ? "bg-primary/15 border-primary/30"
                      : "bg-primary/5 hover:bg-primary/10"
                  )}
                >
                  <MessageSquare size={16} className="text-text-sub shrink-0" />
                  <div className="min-w-0">
                    <p className="font-body text-sm text-text-main truncate">{conv.title || 'Cuộc trò chuyện'}</p>
                    <p className="font-ui text-[10px] text-text-sub">
                      {conv.updatedAt ? new Date(conv.updatedAt).toLocaleDateString('vi-VN') : ''}
                    </p>
                  </div>
                </button>
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
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-chat-blobs relative h-full">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-primary/20 z-10 shadow-sm">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-primary/10 text-text-main transition-colors cursor-pointer"
            title="Mở danh sách hội thoại"
          >
            <Menu size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl shrink-0">
            🌸
          </div>
          <div>
            <p className="font-display font-semibold text-text-main">Dora</p>
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
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 bg-[#FCFAF5]/95 backdrop-blur-[1px]">
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
        <div className="bg-gradient-to-t from-[#FCFAF5] via-[#FCFAF5]/98 to-transparent pt-3 pb-6 px-4 md:px-8 border-t border-primary/5 z-10">
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
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

            {/* Action shortcuts */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSend('Gợi ý cho mình một bài nhạc phù hợp với tâm trạng nhé 🎵')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent/15 hover:bg-accent/30 text-text-main font-ui text-xs hover:text-primary-dark transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              >
                <Music size={13} className="text-primary" /> Gợi ý nhạc
              </button>
              <button
                onClick={() => handleSend('Mình muốn ghi nhật ký về hôm nay 📝')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary/15 hover:bg-secondary/35 text-text-main font-ui text-xs hover:text-[#9A7D18] transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              >
                <BookOpen size={13} className="text-[#C9A227]" /> Ghi nhật ký
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
