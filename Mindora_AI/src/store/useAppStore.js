import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),

      // Mood check-in hôm nay
      todayMood: null,
      setTodayMood: (mood) => set({ todayMood: mood }),

      // Chat messages
      messages: [],
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      clearMessages: () => set({ messages: [] }),

      // Journal entries
      journals: [],
      addJournal: (entry) => set((s) => ({ journals: [entry, ...s.journals] })),
      updateJournal: (id, data) =>
        set((s) => ({
          journals: s.journals.map((j) => (j.id === id ? { ...j, ...data } : j)),
        })),
      deleteJournal: (id) =>
        set((s) => ({ journals: s.journals.filter((j) => j.id !== id) })),

      // UI state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
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
