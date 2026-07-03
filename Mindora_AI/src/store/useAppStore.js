import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, getToken, setToken, removeToken } from '../lib/api'
import { askDora } from '../lib/gemini'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      currentConversationId: null,
      setUser: (user) => set({ user }),

      // Spotify Player State
      playingItem: null,
      setPlayingItem: (item) => set({ playingItem: item }),
      isMinimized: false,
      setIsMinimized: (min) => set({ isMinimized: min }),

      // Mood check-in hôm nay
      todayMood: null,
      setTodayMood: (mood) => set({ todayMood: mood }),

      // Chat — conversations + messages
      conversations: [],
      messages: [],

      loadConversations: async () => {
        try {
          const data = await api.get('/conversations')
          set({ conversations: data })
        } catch (e) {
          console.error('loadConversations error:', e)
        }
      },

      loadMessages: async (conversationId) => {
        if (!conversationId) return
        try {
          const data = await api.get(`/conversations/${conversationId}/messages?page=0&size=200`)
          // Backend trả PageResponse { content: [...], page, size, ... }
          const msgs = (data.content || []).map(m => ({
            id: m.id,
            role: m.role,       // 'user' | 'ai'
            text: m.content,    // map content → text cho UI
            time: m.createdAt,
            detectedEmotion: m.detectedEmotion,
            sentimentScore: m.sentimentScore,
          }))
          set({ messages: msgs })
        } catch (e) {
          console.error('loadMessages error:', e)
          set({ messages: [] })
        }
      },

      sendMessage: async (conversationId, text) => {
        if (!conversationId || !text) return

        // 1. Gửi user message lên backend
        const userMsg = await api.postAuth(`/conversations/${conversationId}/messages`, {
          role: 'user',
          content: text,
        })
        const userLocal = {
          id: userMsg.id,
          role: 'user',
          text: userMsg.content,
          time: userMsg.createdAt,
          detectedEmotion: userMsg.detectedEmotion,
          sentimentScore: userMsg.sentimentScore,
        }
        set((s) => ({ messages: [...s.messages, userLocal] }))

        // 2. Gọi AI reply (local keyword-match)
        const aiReplyText = await askDora(text, get().messages)

        // 3. Lưu AI reply lên backend
        const aiMsg = await api.postAuth(`/conversations/${conversationId}/messages`, {
          role: 'ai',
          content: aiReplyText,
        })
        const aiLocal = {
          id: aiMsg.id,
          role: 'ai',
          text: aiMsg.content,
          time: aiMsg.createdAt,
        }
        set((s) => ({ messages: [...s.messages, aiLocal] }))

        return aiLocal
      },

      clearMessages: async (conversationId) => {
        if (!conversationId) {
          set({ messages: [] })
          return
        }
        try {
          await api.delete(`/conversations/${conversationId}/messages`)
          set({ messages: [] })
        } catch (e) {
          console.error('clearMessages error:', e)
        }
      },

      createConversation: async (title) => {
        try {
          const conv = await api.postAuth('/conversations', { title })
          set((s) => ({
            conversations: [conv, ...s.conversations],
            currentConversationId: conv.id,
            messages: [],
          }))
          return conv
        } catch (e) {
          console.error('createConversation error:', e)
        }
      },

      // Journal entries
      journals: [],

      loadJournals: async () => {
        try {
          const data = await api.get('/journals?page=0&size=100')
          // Backend trả PageResponse
          const journals = (data.content || []).map(j => ({
            id: j.id,
            title: j.title,
            text: j.content,       // map content → text cho UI
            mood: j.moodValue,     // map moodValue → mood cho UI
            tags: j.tags || [],
            date: j.entryDate,     // map entryDate → date cho UI
            createdAt: j.createdAt,
            updatedAt: j.updatedAt,
          }))
          set({ journals })
        } catch (e) {
          console.error('loadJournals error:', e)
        }
      },

      addJournal: async (entry) => {
        const body = {
          title: entry.title || '',
          content: entry.text,         // UI text → backend content
          moodValue: entry.mood,       // UI mood → backend moodValue
          tags: entry.tags || [],
          entryDate: entry.date || new Date().toISOString().split('T')[0],
        }
        const data = await api.postAuth('/journals', body)
        const local = {
          id: data.id,
          title: data.title,
          text: data.content,
          mood: data.moodValue,
          tags: data.tags || [],
          date: data.entryDate,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
        set((s) => ({ journals: [local, ...s.journals] }))
        return local
      },

      updateJournal: async (id, updatedData) => {
        // Tìm journal cũ để merge
        const existing = get().journals.find(j => j.id === id)
        const body = {
          title: updatedData.title ?? existing?.title ?? '',
          content: updatedData.text ?? existing?.text ?? '',
          moodValue: updatedData.mood ?? existing?.mood ?? '',
          tags: updatedData.tags ?? existing?.tags ?? [],
          entryDate: updatedData.date ?? existing?.date ?? new Date().toISOString().split('T')[0],
        }
        const data = await api.put(`/journals/${id}`, body)
        const local = {
          id: data.id,
          title: data.title,
          text: data.content,
          mood: data.moodValue,
          tags: data.tags || [],
          date: data.entryDate,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
        set((s) => ({
          journals: s.journals.map(j => j.id === id ? local : j),
        }))
      },

      deleteJournal: async (id) => {
        await api.delete(`/journals/${id}`)
        set((s) => ({ journals: s.journals.filter(j => j.id !== id) }))
      },

      // Mood logs
      moodLogs: [],

      loadMoodWeek: async () => {
        try {
          const data = await api.get('/moods/week')
          set({ moodLogs: data })
        } catch (e) {
          console.error('loadMoodWeek error:', e)
        }
      },

      logMood: async (moodData) => {
        // moodData: { moodScore, moodEmoji, note, logDate }
        const data = await api.postAuth('/moods', {
          moodScore: moodData.moodScore,
          moodEmoji: moodData.moodEmoji || '',
          note: moodData.note || '',
          logDate: moodData.logDate || new Date().toISOString().split('T')[0],
        })
        set((s) => ({ moodLogs: [...s.moodLogs, data] }))
        return data
      },

      // UI state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Auth — kết nối Spring Boot backend
      login: async (email, password) => {
        const data = await api.post('/auth/login', { email, password })
        setToken(data.token)
        set({
          user: data.user,
          currentConversationId: data.conversationId ?? null,
        })
        return { data }
      },

      signup: async (email, password, displayName) => {
        const data = await api.post('/auth/register', { email, password, fullName: displayName })
        setToken(data.token)
        set({
          user: data.user,
          currentConversationId: data.conversationId ?? null,
        })
        return { data }
      },

      logout: async () => {
        removeToken()
        set({
          user: null,
          journals: [],
          messages: [],
          conversations: [],
          moodLogs: [],
          todayMood: null,
          currentConversationId: null,
        })
        return { success: true }
      },

      initSession: async () => {
        const token = getToken()
        if (!token) return
        try {
          const data = await api.get('/users/me')
          set({ user: data })
        } catch {
          removeToken()
          set({ user: null })
        }
      },
    }),
    {
      name: 'mindbuddy-storage',
      partialize: (s) => ({
        user: s.user,
        todayMood: s.todayMood,
        currentConversationId: s.currentConversationId,
      }),
    }
  )
)
