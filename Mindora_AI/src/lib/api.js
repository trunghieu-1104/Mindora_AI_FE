const API_BASE = 'http://localhost:8080/api'

export const getToken = () => localStorage.getItem('mindora_token')
export const setToken = (token) => localStorage.setItem('mindora_token', token)
export const removeToken = () => localStorage.removeItem('mindora_token')

// Mock Database stored in localStorage
const getMockDb = () => {
  const db = localStorage.getItem('mindora_mock_db')
  if (db) return JSON.parse(db)
  
  // Default values
  const defaultDb = {
    users: [],
    conversations: [],
    messages: {}, // conversationId -> messages[]
    journals: [],
    moodLogs: [],
  }
  localStorage.setItem('mindora_mock_db', JSON.stringify(defaultDb))
  return defaultDb
}

const saveMockDb = (db) => {
  localStorage.setItem('mindora_mock_db', JSON.stringify(db))
}

// Mock API handler
function handleMockRequest(method, path, body = null) {
  console.log(`[API Mock] Intercepted: ${method} ${path}`, body)
  const db = getMockDb()
  const token = getToken()
  
  // Basic Auth verification
  const currentUser = token ? db.users.find(u => u.token === token) : null

  // Helper to generate a random string ID
  const uuid = () => Math.random().toString(36).substring(2, 15)

  // Parse path
  const cleanPath = path.split('?')[0]

  // 1. Auth endpoints
  if (cleanPath === '/auth/login') {
    const { email, password } = body || {}
    let user = db.users.find(u => u.email === email)
    if (!user) {
      // Auto-register to make it easier for testing!
      user = { id: uuid(), email, fullName: 'Người dùng thử nghiệm', password, token: `token-${uuid()}` }
      db.users.push(user)
      saveMockDb(db)
    }
    return {
      token: user.token,
      user: { id: user.id, email: user.email, fullName: user.fullName },
      conversationId: db.conversations.find(c => c.userId === user.id)?.id || null
    }
  }

  if (cleanPath === '/auth/register') {
    const { email, password, fullName } = body || {}
    const existing = db.users.find(u => u.email === email)
    if (existing) {
      throw new Error('Email đã tồn tại')
    }
    const user = { id: uuid(), email, fullName: fullName || 'Người dùng mới', password, token: `token-${uuid()}` }
    db.users.push(user)
    saveMockDb(db)
    return {
      token: user.token,
      user: { id: user.id, email: user.email, fullName: user.fullName },
      conversationId: null
    }
  }

  if (cleanPath === '/users/me') {
    if (!currentUser) throw new Error('Chưa đăng nhập')
    return { id: currentUser.id, email: currentUser.email, fullName: currentUser.fullName }
  }

  // Ensure logged in for other routes
  if (!currentUser) {
    throw new Error('Chưa đăng nhập (Token không hợp lệ)')
  }

  // 2. Conversations
  if (cleanPath === '/conversations') {
    if (method === 'GET') {
      return db.conversations.filter(c => c.userId === currentUser.id)
    }
    if (method === 'POST') {
      const { title } = body || {}
      const conv = { id: uuid(), title: title || 'Cuộc trò chuyện mới', userId: currentUser.id, createdAt: new Date().toISOString() }
      db.conversations.unshift(conv)
      saveMockDb(db)
      return conv
    }
  }

  // 3. Messages
  // match /conversations/xxx/messages
  const msgMatch = cleanPath.match(/^\/conversations\/([^/]+)\/messages$/)
  if (msgMatch) {
    const conversationId = msgMatch[1]
    if (method === 'GET') {
      const msgs = db.messages[conversationId] || []
      return {
        content: msgs,
        page: 0,
        size: 200
      }
    }
    if (method === 'POST') {
      const { role, content } = body || {}
      const msg = {
        id: uuid(),
        role,
        content,
        createdAt: new Date().toISOString(),
        detectedEmotion: role === 'user' ? 'neutral' : undefined,
        sentimentScore: role === 'user' ? 4 : undefined,
      }
      if (!db.messages[conversationId]) db.messages[conversationId] = []
      db.messages[conversationId].push(msg)
      saveMockDb(db)
      return msg
    }
    if (method === 'DELETE') {
      db.messages[conversationId] = []
      saveMockDb(db)
      return { success: true }
    }
  }

  // 4. Journals
  if (cleanPath === '/journals') {
    if (method === 'GET') {
      const list = db.journals.filter(j => j.userId === currentUser.id)
      return {
        content: list,
        page: 0,
        size: 100
      }
    }
    if (method === 'POST') {
      const { title, content, moodValue, tags, entryDate } = body || {}
      const journal = {
        id: uuid(),
        userId: currentUser.id,
        title,
        content,
        moodValue,
        tags,
        entryDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      db.journals.unshift(journal)
      saveMockDb(db)
      return journal
    }
  }

  const journalIdMatch = cleanPath.match(/^\/journals\/([^/]+)$/)
  if (journalIdMatch) {
    const journalId = journalIdMatch[1]
    if (method === 'PUT') {
      const idx = db.journals.findIndex(j => j.id === journalId)
      if (idx !== -1) {
        db.journals[idx] = {
          ...db.journals[idx],
          ...body,
          updatedAt: new Date().toISOString()
        }
        saveMockDb(db)
        return db.journals[idx]
      }
      throw new Error('Không tìm thấy nhật ký')
    }
    if (method === 'DELETE') {
      db.journals = db.journals.filter(j => j.id !== journalId)
      saveMockDb(db)
      return { success: true }
    }
  }

  // 5. Moods
  if (cleanPath === '/moods') {
    if (method === 'POST') {
      const { moodScore, moodEmoji, note, logDate } = body || {}
      const log = {
        id: uuid(),
        userId: currentUser.id,
        moodScore,
        moodEmoji,
        note,
        logDate,
        createdAt: new Date().toISOString()
      }
      db.moodLogs.push(log)
      saveMockDb(db)
      return log
    }
  }

  if (cleanPath === '/moods/week') {
    if (method === 'GET') {
      return db.moodLogs.filter(m => m.userId === currentUser.id)
    }
  }

  throw new Error(`Endpoint mock chưa hỗ trợ: ${method} ${path}`)
}

async function request(method, path, body = null, requireAuth = false) {
  const headers = { 'Content-Type': 'application/json' }

  if (requireAuth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || `Lỗi ${res.status}`)
    }

    return data
  } catch (error) {
    // Check if it's a network/fetch error (e.g. connection refused)
    if (
      error.name === 'TypeError' || 
      error.message.includes('fetch') || 
      error.message.includes('NetworkError') || 
      error.message.includes('Failed to connect')
    ) {
      console.warn(`[API] Không kết nối được Spring Boot backend (${API_BASE}). Đang chuyển sang chế độ Mock local...`)
      return handleMockRequest(method, path, body)
    }
    throw error
  }
}

export const api = {
  get:    (path)         => request('GET',    path, null, true),
  post:   (path, body)   => request('POST',   path, body, false),
  postAuth: (path, body) => request('POST',   path, body, true),
  put:    (path, body)   => request('PUT',    path, body, true),
  patch:  (path, body)   => request('PATCH',  path, body, true),
  delete: (path)         => request('DELETE', path, null, true),
}
