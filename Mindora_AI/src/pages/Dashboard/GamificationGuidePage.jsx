import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    icon: '💡',
    title: 'AI Insight hôm nay',
    color: 'from-primary to-[#123152]',
    textColor: 'text-white',
    body: [
      'Mỗi ngày, sau khi bạn trò chuyện đủ với Dora (ít nhất vài tin nhắn), AI sẽ đọc lại toàn bộ đoạn chat hôm đó và viết ra MỘT nhận xét thật cụ thể — dựa trên chính những gì bạn đã nói, không phải lời chung chung.',
      'Nếu hôm nay bạn chưa chat đủ, mục này sẽ mời bạn trò chuyện thay vì báo lỗi. Mỗi ngày chỉ được phân tích 1 lần để tiết kiệm và tạo cảm giác "khám phá" mới mỗi khi quay lại.',
    ],
  },
  {
    icon: '⭐',
    title: 'XP & Level',
    color: 'bg-white',
    textColor: 'text-text-main',
    body: [
      'XP (điểm kinh nghiệm) được cộng mỗi ngày dựa trên mức độ bạn chia sẻ chủ động và tích cực trong cuộc trò chuyện — không phải cứ nhắn tin nhiều là được nhiều điểm, mà là chia sẻ thật.',
      'Cứ đủ 100 XP, bạn lên 1 Level. Thanh tiến trình trên Dashboard cho biết bạn còn cách Level tiếp theo bao xa.',
    ],
    table: {
      headers: ['Level', 'XP cần có'],
      rows: [['1', '0 XP'], ['2', '100 XP'], ['3', '200 XP'], ['4', '300 XP'], ['...', '...']],
    },
  },
  {
    icon: '🔥',
    title: 'Chuỗi ngày (Streak)',
    color: 'bg-white',
    textColor: 'text-text-main',
    body: [
      'Streak đếm số ngày liên tiếp bạn ghé trò chuyện cùng Dora. Mỗi ngày có ít nhất 1 cuộc trò chuyện thực chất sẽ giữ chuỗi tiếp tục.',
      'Nếu bỏ lỡ 1 ngày không trò chuyện, chuỗi sẽ reset về 1 khi bạn quay lại — vì vậy cố gắng duy trì thói quen mỗi ngày, dù chỉ vài phút, sẽ giúp chuỗi của bạn dài hơn.',
    ],
  },
  {
    icon: '🌱',
    title: 'Cây cảm xúc',
    color: 'bg-white',
    textColor: 'text-text-main',
    body: [
      'Cây cảm xúc tượng trưng cho việc bạn chăm sóc bản thân theo thời gian. Mỗi ngày trò chuyện tích cực, chủ động, cây sẽ lớn thêm một chút (0-5%).',
      'Khi cây đạt 100%, nó sẽ "trưởng thành" thành 1 cây hoàn chỉnh và một cây mới bắt đầu mọc — số cây đã trưởng thành được lưu lại mãi mãi, không mất đi.',
    ],
  },
  {
    icon: '🏆',
    title: 'Achievement (Thành tựu)',
    color: 'bg-white',
    textColor: 'text-text-main',
    body: [
      'Huy hiệu KHÔNG mở mỗi ngày — nó chỉ xuất hiện khi bạn thực sự có một bước tiến rõ rệt hoặc vượt qua điều gì đó khó khăn, theo đánh giá của AI dựa trên nội dung trò chuyện thật.',
      'Vì vậy đừng lo nếu vài ngày liền chưa thấy huy hiệu mới — điều đó bình thường. Mỗi huy hiệu đều có tên và mô tả riêng, không theo một danh sách cố định.',
    ],
  },
  {
    icon: '🏅',
    title: 'Huy hiệu tháng này',
    color: 'bg-white',
    textColor: 'text-text-main',
    body: [
      'Mục này chỉ hiển thị huy hiệu bạn mở được TRONG THÁNG HIỆN TẠI, mới nhất hiển thị trước — giống như một cuốn nhật ký nhỏ ghi lại những cột mốc bạn đã vượt qua tháng này.',
      'Khi sang tháng mới, danh sách sẽ tự "reset" và bắt đầu lại từ đầu, tạo động lực mới cho mỗi tháng thay vì một danh sách dài không đổi. Dữ liệu huy hiệu tháng cũ vẫn được lưu lại phía sau, chỉ không hiển thị ở đây nữa.',
    ],
  },
  {
    icon: '🐱',
    title: 'Pet (Momo)',
    color: 'bg-white',
    textColor: 'text-text-main',
    body: [
      'Momo là người bạn nhỏ đồng hành, gửi bạn một câu nhắn ngắn mỗi ngày dựa trên tâm trạng bạn vừa chia sẻ — như một lời quan tâm ấm áp, không phải đánh giá hay phán xét.',
    ],
  },
  {
    icon: '📅',
    title: 'Tổng kết tuần',
    color: 'bg-white',
    textColor: 'text-text-main',
    body: [
      'Vì các chỉ số hằng ngày chỉ cho thấy 1 ngày, "Tổng kết tuần" gộp lại 7 ngày gần nhất: tổng XP kiếm được, số ngày bạn hoạt động, cây cảm xúc lớn thêm bao nhiêu, số huy hiệu mới, và ngày nào là ngày nổi bật nhất — giúp bạn thấy được sự thay đổi theo thời gian.',
    ],
  },
]

export default function GamificationGuidePage() {
  return (
    <div className="min-h-screen bg-bg py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/dashboard"
            className="p-2.5 rounded-full bg-white hover:bg-primary-light border border-[#E8E1CF] text-text-main hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-text-main font-bold">Hướng dẫn Điểm & Thành tựu</h1>
            <p className="font-body text-xs text-text-sub">Giải thích các chỉ số trong mục Wellness Insight</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {SECTIONS.map((s) => (
            <div
              key={s.title}
              className={`relative overflow-hidden rounded-3xl p-6 shadow-sm border ${s.color === 'bg-white' ? 'bg-white border-[#E8E1CF]' : `bg-gradient-to-br ${s.color} border-transparent`}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl shrink-0">{s.icon}</span>
                <h3 className={`font-display text-lg font-semibold ${s.textColor}`}>{s.title}</h3>
              </div>

              <div className="flex flex-col gap-2.5">
                {s.body.map((p, i) => (
                  <p key={i} className={`font-body text-sm leading-relaxed ${s.textColor === 'text-white' ? 'text-white/95' : 'text-text-sub'}`}>
                    {p}
                  </p>
                ))}
              </div>

              {s.table && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-[#F0EBDC]">
                  <table className="w-full text-left">
                    <thead className="bg-bg/70">
                      <tr>
                        {s.table.headers.map((h) => (
                          <th key={h} className="font-ui text-[11px] text-text-sub uppercase tracking-wider px-4 py-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-bg/30'}>
                          {row.map((cell, j) => (
                            <td key={j} className="font-body text-sm text-text-main px-4 py-2">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/dashboard"
            className="inline-block px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-full font-ui text-sm font-semibold transition-colors cursor-pointer"
          >
            ← Quay lại Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
