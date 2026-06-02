import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      setUser: (user) => set({ user }),

      // Spotify Player State
      playingItem: null,
      setPlayingItem: (item) => set({ playingItem: item }),
      isMinimized: false,
      setIsMinimized: (min) => set({ isMinimized: min }),

      // Mood check-in hôm nay
      todayMood: null,
      setTodayMood: (mood) => set({ todayMood: mood }),

      // Chat messages
      messages: [],
      addMessage: async (msg) => {
        const user = get().user
        if (user) {
          // Sync to Supabase
          const { data, error } = await supabase
            .from('chat_messages')
            .insert({
              user_id: user.id,
              role: msg.role,
              text: msg.text,
              created_at: msg.time || new Date()
            })
            .select()
            .single()

          if (!error && data) {
            const formattedMsg = {
              id: data.id,
              role: data.role,
              text: data.text,
              time: new Date(data.created_at)
            }
            set((s) => ({ messages: [...s.messages, formattedMsg] }))
            return formattedMsg
          }
        }
        
        // Guest mode fallback
        const localMsg = { ...msg, id: msg.id || Date.now(), time: msg.time || new Date() }
        set((s) => ({ messages: [...s.messages, localMsg] }))
        return localMsg
      },
      
      clearMessages: async () => {
        const user = get().user
        if (user) {
          await supabase.from('chat_messages').delete().eq('user_id', user.id)
        }
        set({ messages: [] })
      },

      // Journal entries
      journals: [],
      
      addJournal: async (entry) => {
        const user = get().user
        if (user) {
          const { data, error } = await supabase
            .from('journals')
            .insert({
              user_id: user.id,
              date: entry.date || new Date().toISOString().split('T')[0],
              mood: entry.mood,
              text: entry.text,
              tags: entry.tags || []
            })
            .select()
            .single()

          if (!error && data) {
            const newJournal = {
              id: data.id,
              date: new Date(data.date),
              mood: data.mood,
              text: data.text,
              tags: data.tags
            }
            set((s) => ({ journals: [newJournal, ...s.journals] }))
            return
          }
        }
        
        // Guest mode fallback
        const localJournal = { ...entry, id: entry.id || Date.now(), date: entry.date || new Date() }
        set((s) => ({ journals: [localJournal, ...s.journals] }))
      },
      
      updateJournal: async (id, updatedData) => {
        const user = get().user
        if (user) {
          const { error } = await supabase
            .from('journals')
            .update({
              mood: updatedData.mood,
              text: updatedData.text,
              tags: updatedData.tags
            })
            .eq('id', id)
            .eq('user_id', user.id)

          if (!error) {
            set((s) => ({
              journals: s.journals.map((j) => (j.id === id ? { ...j, ...updatedData } : j)),
            }))
            return
          }
        }

        // Guest mode fallback
        set((s) => ({
          journals: s.journals.map((j) => (j.id === id ? { ...j, ...updatedData } : j)),
        }))
      },
      
      deleteJournal: async (id) => {
        const user = get().user
        if (user) {
          const { error } = await supabase
            .from('journals')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

          if (!error) {
            set((s) => ({ journals: s.journals.filter((j) => j.id !== id) }))
            return
          }
        }

        // Guest mode fallback
        set((s) => ({ journals: s.journals.filter((j) => j.id !== id) }))
      },

      // UI state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Sync Database Data
      fetchUserData: async () => {
        const user = get().user
        if (!user) return

        // 1. Fetch Journals
        const { data: journalData, error: journalError } = await supabase
          .from('journals')
          .select('*')
          .order('date', { ascending: false })

        if (!journalError && journalData) {
          const formattedJournals = journalData.map(j => ({
            id: j.id,
            date: new Date(j.date),
            mood: j.mood,
            text: j.text,
            tags: j.tags
          }))
          set({ journals: formattedJournals })
        }

        // 2. Fetch Chat history
        const { data: chatData, error: chatError } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true })

        if (!chatError && chatData) {
          const formattedMessages = chatData.map(msg => ({
            id: msg.id,
            role: msg.role,
            text: msg.text,
            time: new Date(msg.created_at)
          }))
          set({ messages: formattedMessages })
        }
      },

      // Auth Operations
      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return { error }
        set({ user: data.user })
        await get().fetchUserData()
        return { data }
      },

      signup: async (email, password, displayName) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            }
          }
        })
        if (error) return { error }
        set({ user: data.user })
        await get().fetchUserData()
        return { data }
      },

      logout: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) return { error }
        set({ user: null, journals: [], messages: [], todayMood: null })
        return { success: true }
      },

      initSession: async () => {
        // Fetch current active session
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          set({ user: session.user })
          await get().fetchUserData()
        }

        // Listen for Auth changes in realtime
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            set({ user: session.user })
            await get().fetchUserData()
          } else {
            set({ user: null, journals: [], messages: [], todayMood: null })
          }
        })
      }
    }),
    {
      name: 'mindbuddy-storage',
      partialize: (s) => ({
        user: s.user,
        journals: s.journals,
        todayMood: s.todayMood,
      }),
    }
  )
)
