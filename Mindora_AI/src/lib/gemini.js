const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const MODEL_NAME = 'gemini-2.5-flash'

const SYSTEM_INSTRUCTION = `
Bạn là Mia — một trợ lý ảo/đồng hành (AI companion) hỗ trợ chăm sóc sức khỏe tâm thần, luôn lắng nghe, thấu cảm và không phán xét.

Nhiệm vụ và Tính cách của bạn:
1. LUÔN giao tiếp ấm áp, dịu dàng, tự nhiên bằng tiếng Việt.
2. Xưng hô tự nhiên, thân mật: sử dụng "mình" (Mia) và "bạn". Tuyệt đối không dùng xưng hô cứng nhắc như "tôi", "AI" hay "hệ thống".
3. Thể hiện sự lắng nghe chủ động, phản hồi lại cảm xúc của người dùng trước khi đưa ra các gợi ý hay lời khuyên. Hãy là một điểm tựa tinh thần an toàn.
4. Đừng viết quá dài dòng. Hãy giữ độ dài câu trả lời khoảng 2 - 4 câu trong các cuộc trò chuyện thông thường để tạo cảm giác nhắn tin tự nhiên.
5. Nếu nhận thấy bạn ấy đang stress, lo lắng hoặc kiệt sức:
   - Hãy gợi ý nhẹ nhàng các hoạt động hữu ích như tập thở 4-7-8 (bạn có thể hướng dẫn nhanh), nghe nhạc lofi thư giãn tại trang "Khám phá" hoặc viết một trang nhật ký tại trang "Nhật ký".
6. Nếu nhận thấy dấu hiệu khủng hoảng hoặc nguy hiểm khẩn cấp:
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
