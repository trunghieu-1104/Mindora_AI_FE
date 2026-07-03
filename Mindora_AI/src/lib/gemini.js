const LOCAL_RESPONSES = [
  {
    keywords: ['mệt', 'kiệt sức', 'mệt mỏi'],
    reply: 'Mình hiểu cảm giác mệt mỏi đó 🌙 Bạn thử nghe một bản nhạc lo-fi nhẹ nhàng để thư giãn nhé:\n"Rainy Café Lofi" - https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn\nHoặc hãy chia sẻ thêm cho mình biết điều gì đang làm bạn mệt mỏi nhé.'
  },
  {
    keywords: ['buồn', 'khóc', 'cô đơn'],
    reply: 'Buồn cũng không sao đâu bạn ơi 🌧️ Mình luôn ở đây lắng nghe bạn. Bạn thử nghe bài hát này xem có giúp vơi bớt phần nào không nhé:\n"Someone Like You" của Adele - https://open.spotify.com/track/1EzrEOXmMH3G43FST1y73H\nChuyện gì đã xảy ra vậy bạn?'
  },
  {
    keywords: ['stress', 'lo lắng', 'áp lực'],
    reply: 'Nghe có vẻ bạn đang căng thẳng quá 😮‍💨 Thử hít thở sâu cùng mình nhé? Ngoài ra, playlist acoustic êm dịu này sẽ giúp bạn dịu lại đấy:\n"Acoustic Chill" - https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO\nBạn cảm thấy thế nào sau khi nghỉ ngơi một chút?'
  },
  {
    keywords: ['vui', 'hạnh phúc', 'ổn', 'tuyệt'],
    reply: 'Thật tuyệt vời khi thấy bạn tràn đầy năng lượng tích cực! 🌸 Hãy cùng nghe bài nhạc vui tươi này để duy trì tâm trạng tốt này nhé:\n"Happy" của Pharrell Williams - https://open.spotify.com/track/60nZcECyYwG6uJ0vT9y1z\nKể cho mình nghe điều gì đã mang lại niềm vui cho bạn hôm nay nào!'
  },
  {
    keywords: ['ngủ', 'mất ngủ', 'trằn trọc'],
    reply: 'Khó ngủ cũng ảnh hưởng rất nhiều đến tâm trạng nhỉ 🌙 Thử nghe bản nhạc thư giãn này trước khi đi ngủ nhé:\n"Clair de Lune" của Debussy - https://open.spotify.com/track/6hk5bPV8DfqIPjYXLiBl6b\nBạn thường hay trằn trọc vì điều gì vậy?'
  },
  {
    keywords: ['nhạc', 'nghe nhạc', 'bài hát', 'gợi ý nhạc'],
    reply: 'Để mình gợi ý cho bạn playlist phù hợp nhé 🎵\nNếu bạn muốn thư giãn: "Acoustic Chill" - https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO\nNếu bạn muốn phấn chấn: "Happy Beats" - https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0\nBạn đang muốn nghe loại nhạc nào?'
  },
  {
    keywords: ['nhật ký', 'ghi nhật ký'],
    reply: 'Ghi nhật ký là một cách tuyệt vời để hiểu bản thân hơn nhé 📝 Bạn có thể vào trang "Nhật ký" để bắt đầu. Hôm nay bạn muốn ghi lại điều gì?'
  },
]

const DEFAULT_REPLY = 'Mình hiểu rồi 💙 Cảm ơn bạn đã luôn tin tưởng và chia sẻ với mình. Bạn muốn tâm sự thêm điều gì không?'

export async function askDora(userMessageText, history = []) {
  const text = userMessageText.toLowerCase()
  for (const { keywords, reply } of LOCAL_RESPONSES) {
    if (keywords.some(k => text.includes(k))) return reply
  }
  return DEFAULT_REPLY
}
