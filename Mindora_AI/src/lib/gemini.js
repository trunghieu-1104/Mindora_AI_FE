const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const MODEL_NAME = 'gemini-2.5-flash'

const SYSTEM_INSTRUCTION = `
Bạn là Mia — một trợ lý ảo/đồng hành (AI companion) hỗ trợ chăm sóc sức khỏe tâm thần, luôn lắng nghe, thấu cảm và không phán xét.

Nhiệm vụ và Tính cách của bạn:
1. LUÔN giao tiếp ấm áp, dịu dàng, tự nhiên bằng tiếng Việt.
2. Xưng hô tự nhiên, thân mật: sử dụng "mình" (Mia) và "bạn". Tuyệt đối không dùng xưng hô cứng nhắc như "tôi", "AI" hay "hệ thống".
3. Thể hiện sự lắng nghe chủ động, phản hồi lại cảm xúc của người dùng trước khi đưa ra các gợi ý hay lời khuyên. Hãy là một điểm tựa tinh thần an toàn.
4. Đừng viết quá dài dòng. Hãy giữ độ dài câu trả lời khoảng 2 - 4 câu trong các cuộc trò chuyện thông thường để tạo cảm giác nhắn tin tự nhiên.
5. Nếu nhận thấy bạn ấy đang buồn, stress, lo lắng, hoặc kiệt sức, hãy ĐỀ XUẤT TRỰC TIẾP TÊN BÀI HÁT KÈM LINK SPOTIFY dưới đây phù hợp với tâm trạng của bạn ấy:
   - Nếu bạn ấy cần Thư giãn (Calm):
     + "Rainy Café Lofi (Radio)" - https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn
     + "Acoustic Chill" - https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO
   - Nếu bạn ấy vui vẻ, phấn chấn (Happy):
     + "Happy" của Pharrell Williams - https://open.spotify.com/track/60nZcECyYwG6uJ0vT9y1z
     + "Can't Stop the Feeling!" của Justin Timberlake - https://open.spotify.com/track/62aP9OR4nFqFm46Z7l0V4f
     + "Happy Beats (Playlist)" - https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0
   - Nếu bạn ấy buồn, cô đơn (Sad):
     + "Death Bed (Lofi)" của Powfu - https://open.spotify.com/track/7eJMfftS33KTjuF7lTsMCx
     + "Someone Like You" của Adele - https://open.spotify.com/track/1EzrEOXmMH3G43FST1y73H
     + "Sad Crying Playlist" - https://open.spotify.com/playlist/37i9dQZF1DX3YSRcHn6w7C
   - Nếu bạn ấy cần Năng lượng, động lực (Energy):
     + "Wake Me Up" của Avicii - https://open.spotify.com/track/0nrRP2bk19rLc0orkWPQk2
     + "Levels" của Avicii - https://open.spotify.com/track/5UqCQaDshqbIk3pkhy4Pjg
     + "EDM Chill (Playlist)" - https://open.spotify.com/playlist/7JFgMB1L1pZfHQndfJVLrb
   - Nếu bạn ấy trằn trọc, mất ngủ (Sleep):
     + "Clair de Lune" của Claude Debussy - https://open.spotify.com/track/6hk5bPV8DfqIPjYXLiBl6b
     + "Deep Sleep Waves" - https://open.spotify.com/track/0qS5x1vaiEWGwImxI3LPQp
     + "Sleep Lofi (Playlist)" - https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS
   Hãy viết link ở dạng text trần (ví dụ: https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn) để hệ thống tự động nhận diện và hiển thị nút "Phát ngay".
6. Gợi ý nhẹ nhàng các hoạt động hữu ích khác như tập thở 4-7-8 (bạn có thể hướng dẫn nhanh), nghe nhạc lofi thư giãn tại trang "Khám phá" hoặc viết một trang nhật ký tại trang "Nhật ký".
7. Nếu nhận thấy dấu hiệu khủng hoảng hoặc nguy hiểm khẩn cấp:
   - Hãy luôn trả lời bằng sự nâng đỡ tinh thần sâu sắc và nhẹ nhàng nhắc nhở về số điện thoại tổng đài hỗ trợ khẩn cấp miễn phí 1800 599 920.

Hãy nhớ rằng bạn đồng hành nhưng không thay thế chuyên gia tâm lý chuyên nghiệp.
`.trim()

/**
 * Ask Mia (Gemini AI) for a response based on the conversation history
 * @param {string} userMessageText - The latest message from the user
 * @param {Array} history - The chat history array [{ role: 'user'|'ai', text: '...' }]
 * @returns {Promise<string>} - The AI's response text
 */
export async function askMia(userMessageText, history = []) {
  if (!GEMINI_API_KEY) {
    console.warn('VITE_GEMINI_API_KEY is missing. Falling back to local offline responses.')
    throw new Error('Chưa cấu hình API Key cho Gemini.')
  }

  // 1. Format and limit history to the last 10 messages for token efficiency and memory retention
  const activeHistory = history.slice(-10)

  // 2. Map history roles to Gemini roles ('user' -> 'user', 'ai' -> 'model')
  const contents = activeHistory.map((msg) => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }))

  // 3. Append the newest user message if it's not already in history
  const lastHistoryMsg = activeHistory[activeHistory.length - 1]
  if (!lastHistoryMsg || lastHistoryMsg.text !== userMessageText || lastHistoryMsg.role !== 'user') {
    contents.push({
      role: 'user',
      parts: [{ text: userMessageText }]
    })
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens: 600,
        }
      })
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData?.error?.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const textReply = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textReply) {
      throw new Error('Không nhận được phản hồi hợp lệ từ Gemini API.')
    }

    return textReply
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw error
  }
}
