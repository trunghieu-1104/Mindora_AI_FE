import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, getToken, setToken, removeToken } from '../lib/api';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ==========================================
      // Auth State
      // ==========================================
      user: null,
      currentConversationId: null,
      setUser: (user) => set({ user }),

      login: async (email, password) => {
        const data = await api.post('/auth/login', { email, password });
        setToken(data.token);
        set({
          user: data.user,
          currentConversationId: data.conversationId ?? null,
        });
        return { data };
      },

      signup: async (email, password, displayName) => {
        const data = await api.post('/auth/register', { email, password, fullName: displayName });
        setToken(data.token);
        set({
          user: data.user,
          currentConversationId: data.conversationId ?? null,
        });
        return { data };
      },

      logout: async () => {
        removeToken();
        set({
          user: null,
          journals: [],
          messages: [],
          conversations: [],
          moodLogs: [],
          moodHistory: [],
          todayMood: null,
          currentConversationId: null,
          dailyInsight: null,
          achievements: [],
          weeklySummary: null,
        });
        return { success: true };
      },

      initSession: async () => {
        const token = getToken();
        if (!token) return;
        try {
          const data = await api.get('/users/me');
          set({ user: data });
        } catch {
          removeToken();
          set({ user: null });
        }
      },

      // ==========================================
      // Music Player State
      // playingItem.youtubeId -> nguồn phát duy nhất: audio từ YouTube (ẩn video, chỉ nghe),
      // free, không cần đăng nhập bất kỳ tài khoản nào (Spotify đã bỏ hoàn toàn).
      // ==========================================
      playingItem: null,
      setPlayingItem: (item) => set({ playingItem: item, isPlaying: !!item }),
      isMinimized: false,
      setIsMinimized: (min) => set({ isMinimized: min }),
      isPlaying: false,
      setIsPlaying: (val) => set({ isPlaying: val }),

      // ==========================================
      // Mood check-in hôm nay
      // ==========================================
      todayMood: null,
      setTodayMood: (mood) => set({ todayMood: mood }),

      moodLogs: [],

      loadMoodWeek: async () => {
        try {
          const data = await api.get('/moods/week');
          set({ moodLogs: data });
        } catch (e) {
          console.error('loadMoodWeek error:', e);
        }
      },

      // Lịch sử mood theo khoảng ngày tuỳ chọn (mặc định 30 ngày gần nhất) — dùng cho trang
      // "Lịch sử mood" trên Dashboard, tách khỏi moodLogs (7 ngày) để không ảnh hưởng biểu đồ tuần.
      moodHistory: [],
      loadMoodHistory: async (days = 30) => {
        try {
          const to = new Date();
          const from = new Date();
          from.setDate(to.getDate() - (days - 1));
          const fmt = (d) => d.toISOString().split('T')[0];
          const data = await api.get(`/moods/range?from=${fmt(from)}&to=${fmt(to)}`);
          set({ moodHistory: data });
          return data;
        } catch (e) {
          console.error('loadMoodHistory error:', e);
          set({ moodHistory: [] });
          return [];
        }
      },

      // ==========================================
      // "Khám phá hôm nay" — AI Insight + Gamification (đọc lại cuộc chat trong ngày)
      // ==========================================
      dailyInsight: null,

      loadDailyInsight: async () => {
        try {
          const data = await api.get('/dashboard/daily-insight');
          set({ dailyInsight: data });
          return data;
        } catch (e) {
          console.error('loadDailyInsight error:', e);
          return null;
        }
      },

      achievements: [],
      loadAchievements: async () => {
        try {
          const data = await api.get('/dashboard/achievements');
          set({ achievements: data });
          return data;
        } catch (e) {
          console.error('loadAchievements error:', e);
          return []
        }
      },

      weeklySummary: null,
      loadWeeklySummary: async () => {
        try {
          const data = await api.get('/dashboard/weekly-summary');
          set({ weeklySummary: data });
          return data;
        } catch (e) {
          console.error('loadWeeklySummary error:', e);
          return null;
        }
      },

      logMood: async (moodData) => {
        // moodData: { moodScore, moodEmoji, note, logDate }
        const data = await api.postAuth('/moods', {
          moodScore: moodData.moodScore,
          moodEmoji: moodData.moodEmoji || '',
          note: moodData.note || '',
          logDate: moodData.logDate || new Date().toISOString().split('T')[0],
        });
        set((s) => ({ moodLogs: [...s.moodLogs, data] }));
        return data;
      },

      // ==========================================
      // Chat — conversations + messages
      // ==========================================
      conversations: [],
      messages: [],

      loadConversations: async () => {
        try {
          const data = await api.get('/conversations');
          set({ conversations: data });
        } catch (e) {
          console.error('loadConversations error:', e);
        }
      },

      loadMessages: async (conversationId) => {
        if (!conversationId) return;
        try {
          const data = await api.get(`/conversations/${conversationId}/messages?page=0&size=200`);
          // Backend trả PageResponse { content: [...], page, size, ... }
          const msgs = (data.content || []).map((m) => ({
            id: m.id,
            role: m.role,       // 'user' | 'ai'
            text: m.content,    // map content → text cho UI
            time: m.createdAt,
            detectedEmotion: m.detectedEmotion,
            sentimentScore: m.sentimentScore,
            // Bài hát Dora đã gợi ý kèm tin nhắn này (nếu có) — giờ được backend lưu lại
            // (Message.song_ids) nên vẫn còn sau khi load lại lịch sử, không chỉ lúc mới gửi.
            songs: m.songs || [],
          }));
          set({ messages: msgs });
        } catch (e) {
          console.error('loadMessages error:', e);
          set({ messages: [] });
        }
      },

      sendMessage: async (conversationId, text) => {
        if (!conversationId || !text) return;

        try {
          const data = await api.postAuth(`/conversations/${conversationId}/chat`, {
            content: text,
          });

          await get().loadMessages(conversationId);
          return data;
        } catch (e) {
          console.error('sendMessage error:', e);
          throw e;
        }
      },

      // Chat với Dora khi CHƯA đăng nhập — gọi endpoint công khai /chat/guest (không cần token),
      // KHÔNG tạo conversation/message nào trong DB. history do ChatPage tự quản lý (chỉ trong
      // state của trang, mất khi tải lại) và gửi kèm mỗi lần gọi để Dora hiểu ngữ cảnh nhiều lượt.
      sendGuestMessage: async (text, history = []) => {
        if (!text) return null;
        try {
          return await api.post('/chat/guest', { message: text, history });
        } catch (e) {
          console.error('sendGuestMessage error:', e);
          throw e;
        }
      },

      clearMessages: async (conversationId) => {
        if (!conversationId) {
          set({ messages: [] });
          return;
        }
        try {
          await api.delete(`/conversations/${conversationId}/messages`);
          set({ messages: [] });
        } catch (e) {
          console.error('clearMessages error:', e);
        }
      },

      createConversation: async (title) => {
        try {
          const conv = await api.postAuth('/conversations', { title });
          set((s) => ({
            conversations: [conv, ...s.conversations],
            currentConversationId: conv.id,
            messages: [],
          }));
          return conv;
        } catch (e) {
          console.error('createConversation error:', e);
        }
      },

      renameConversation: async (conversationId, title) => {
        try {
          const data = await api.put(`/conversations/${conversationId}`, { title });
          set((s) => ({
            conversations: s.conversations.map((c) => (c.id === conversationId ? data : c)),
          }));
          return data;
        } catch (e) {
          console.error('renameConversation error:', e);
        }
      },

      // ==========================================
      // Journal entries
      // ==========================================
      journals: [],

      loadJournals: async () => {
        try {
          const data = await api.get('/journals?page=0&size=100');
          // Backend trả PageResponse
          const journals = (data.content || []).map((j) => ({
            id: j.id,
            title: j.title,
            text: j.content,       // map content → text cho UI
            mood: j.moodValue,     // map moodValue → mood cho UI
            tags: j.tags || [],
            date: j.entryDate,     // map entryDate → date cho UI
            createdAt: j.createdAt,
            updatedAt: j.updatedAt,
          }));
          set({ journals });
        } catch (e) {
          console.error('loadJournals error:', e);
        }
      },

      addJournal: async (entry) => {
        const body = {
          title: entry.title || '',
          content: entry.text,         // UI text → backend content
          moodValue: entry.mood,       // UI mood → backend moodValue
          tags: entry.tags || [],
          entryDate: entry.date || new Date().toISOString().split('T')[0],
        };
        const data = await api.postAuth('/journals', body);
        const local = {
          id: data.id,
          title: data.title,
          text: data.content,
          mood: data.moodValue,
          tags: data.tags || [],
          date: data.entryDate,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        set((s) => ({ journals: [local, ...s.journals] }));
        return local;
      },

      updateJournal: async (id, updatedData) => {
        // Tìm journal cũ để merge
        const existing = get().journals.find((j) => j.id === id);
        const body = {
          title: updatedData.title ?? existing?.title ?? '',
          content: updatedData.text ?? existing?.text ?? '',
          moodValue: updatedData.mood ?? existing?.mood ?? '',
          tags: updatedData.tags ?? existing?.tags ?? [],
          entryDate: updatedData.date ?? existing?.date ?? new Date().toISOString().split('T')[0],
        };
        const data = await api.put(`/journals/${id}`, body);
        const local = {
          id: data.id,
          title: data.title,
          text: data.content,
          mood: data.moodValue,
          tags: data.tags || [],
          date: data.entryDate,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        set((s) => ({
          journals: s.journals.map((j) => (j.id === id ? local : j)),
        }));
      },

      deleteJournal: async (id) => {
        await api.delete(`/journals/${id}`);
        set((s) => ({ journals: s.journals.filter((j) => j.id !== id) }));
      },

      // ==========================================
      // UI state
      // ==========================================
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
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
);