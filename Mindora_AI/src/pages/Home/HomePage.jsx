import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
}

function HeroBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1440 860"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Large main blob — warm terracotta right */}
        <path
          d="M820,30 C1010,0 1380,80 1440,290 C1500,500 1310,710 1100,755 C890,800 680,670 640,490 C600,310 630,60 820,30Z"
          fill="#C97B3A"
          opacity="0.78"
        />
        {/* Mid blob — lighter orange */}
        <path
          d="M660,180 C770,90 980,130 1080,290 C1180,450 1060,650 850,675 C640,700 490,565 495,400 C500,235 550,270 660,180Z"
          fill="#D9905C"
          opacity="0.55"
        />
        {/* Small bottom-left accent */}
        <path
          d="M170,760 C280,690 440,715 490,800 C540,885 440,930 305,910 C170,890 60,830 170,760Z"
          fill="#E8A06A"
          opacity="0.48"
        />
        {/* Tiny top-left accent */}
        <path
          d="M-40,90 C60,40 160,75 185,175 C210,275 125,345 10,325 C-105,305 -140,140 -40,90Z"
          fill="#C97B3A"
          opacity="0.38"
        />
      </svg>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-4 py-20 bg-bg overflow-hidden">
        <HeroBlobs />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <motion.p
            variants={fadeUp}
            className="font-ui text-text-sub text-xs uppercase tracking-widest mb-5"
          >
            Bắt đầu hành trình tâm lý của bạn
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-[5.5rem] sm:text-[7rem] md:text-[9rem] leading-none text-text-main mb-6"
          >
            GẶP MIA
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-body text-text-sub text-base md:text-lg leading-relaxed mb-10 max-w-sm mx-auto"
          >
            Người bạn tâm lý AI — lắng nghe không phán xét, đồng hành 24/7.
          </motion.p>

          <motion.div variants={fadeUp}>
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-text-main rounded-full font-ui font-medium text-text-main hover:bg-text-main hover:text-bg transition-all duration-300"
            >
              Trò chuyện với Mia <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── ABOUT MIA ────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-text-main leading-snug mb-6">
              Mia không chỉ là một chatbot —{' '}
              <span className="italic text-primary-dark">có ở là người bạn lắng nghe bạn</span>
            </h2>
            <p className="font-body text-text-sub text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Dù bạn đang chịu áp lực, lo âu hay chỉ muốn có ai đó để tâm sự —
              Mia luôn sẵn sàng, không phán xét, không bao giờ mệt mỏi.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {['Tâm sự', 'Nhật ký', 'Thư giãn', 'Phân tích cảm xúc'].map((tag) => (
                <span
                  key={tag}
                  className="px-5 py-2 bg-primary/15 rounded-full font-ui text-sm text-text-main"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURE CARDS ────────────────────────────────────── */}
      <section className="py-20 px-4 bg-bg">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl text-text-main mb-10"
          >
            Đồng hành cùng bạn 🎊
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Tâm chăm sóc',
                desc:  'Theo dõi sức khỏe tâm thần hàng ngày cùng Mia',
                bg:    '#DBEAFE',
                iconBg:'#93C5FD',
                emoji: '🌸',
              },
              {
                title: 'Nhật ký',
                desc:  'Ghi lại cảm xúc và suy nghĩ của bạn mỗi ngày',
                bg:    '#FEF3C7',
                iconBg:'#FCD34D',
                emoji: '📖',
              },
              {
                title: 'Nhạc & Thư giãn',
                desc:  'Gợi ý nhạc theo tâm trạng — lo-fi, thiền, năng lượng',
                bg:    '#F5F5F4',
                iconBg:'#D6D3D1',
                emoji: '🎵',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl overflow-hidden cursor-pointer group hover:shadow-soft transition-all duration-300"
                style={{ backgroundColor: card.bg }}
              >
                <div className="h-52 flex items-center justify-center relative overflow-hidden">
                  <div
                    className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl shadow-card group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundColor: card.iconBg }}
                  >
                    {card.emoji}
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full opacity-25" style={{ backgroundColor: card.iconBg }} />
                  <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full opacity-20" style={{ backgroundColor: card.iconBg }} />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-text-main mb-2">{card.title}</h3>
                  <p className="font-body text-text-sub text-sm leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EMOTIONS ─────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-ui text-text-sub text-xs uppercase tracking-widest mb-4">Phân tích cảm xúc</p>
            <h2 className="font-display text-3xl md:text-4xl text-text-main leading-tight mb-6">
              Hiểu rõ hơn<br />cảm xúc của bạn
            </h2>
            <p className="font-body text-text-sub text-base leading-relaxed mb-8">
              Mia theo dõi và phân tích cảm xúc qua các cuộc trò chuyện và nhật ký.
              Nhận ra những pattern để chủ động chăm sóc bản thân tốt hơn.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 font-ui font-medium text-text-main group hover:gap-4 transition-all duration-300"
            >
              Xem phân tích của bạn
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-bg rounded-3xl p-6 shadow-card"
          >
            <p className="font-ui text-sm font-semibold text-text-main mb-4">Tâm trạng tuần này</p>
            <div className="flex items-end gap-2 h-24 mb-3">
              {[55, 75, 42, 88, 65, 82, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-lg transition-all duration-500"
                  style={{ height: `${h}%`, backgroundColor: h > 70 ? '#C9A227' : h > 50 ? '#E8B83088' : '#4A638033' }}
                />
              ))}
            </div>
            <div className="flex justify-between mb-5">
              {['T2','T3','T4','T5','T6','T7','CN'].map((d) => (
                <span key={d} className="font-ui text-xs text-text-sub flex-1 text-center">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Tích cực', value: '68%', emoji: '😊', color: '#C9A22722' },
                { label: 'Lo âu',    value: '12%', emoji: '😟', color: '#D94F4F18' },
                { label: 'Bình thản',value: '15%', emoji: '😌', color: '#1B3A5C18' },
                { label: 'Mệt mỏi', value: '5%',  emoji: '😴', color: '#4A638018' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: item.color }}>
                  <span className="text-xl">{item.emoji}</span>
                  <p className="font-ui text-xs text-text-sub mt-1">{item.label}</p>
                  <p className="font-display text-lg text-text-main font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── LARGE PHOTO ──────────────────────────────────────── */}
      <section className="relative h-[58vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-stone-200 to-stone-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <span className="text-[12rem] leading-none select-none">🧘‍♀️</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-text-main/70 via-text-main/20 to-transparent px-6 pb-10 pt-24">
          <div className="max-w-6xl mx-auto">
            <p className="font-display text-white text-2xl md:text-4xl max-w-md leading-snug">
              Hãy tìm thấy bình yên<br />cùng Mindora
            </p>
          </div>
        </div>
      </section>

      {/* ─── CHAT PREVIEW ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-ui text-text-sub text-xs uppercase tracking-widest mb-4">Luôn bên bạn</p>
            <h2 className="font-display text-3xl md:text-4xl text-text-main leading-tight mb-6">
              Hãy tìm thấy bình tĩnh<br />của cùng Mindora
            </h2>
            <p className="font-body text-text-sub text-base leading-relaxed mb-8">
              Từ những cuộc trò chuyện nhỏ đến những khoảnh khắc khó khăn nhất —
              Mia luôn ở đây, sẵn sàng lắng nghe và đồng hành cùng bạn mỗi ngày.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-text-main text-bg rounded-full font-ui font-medium hover:opacity-90 transition-opacity"
            >
              Bắt đầu ngay <ArrowRight size={16} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-bg rounded-3xl p-6 shadow-card"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center font-display text-sm text-text-main">M</div>
                <div className="bg-white rounded-3xl rounded-tl-sm p-3 max-w-[76%] shadow-bubble">
                  <p className="font-body text-sm text-text-main">Xin chào! Hôm nay bạn cảm thấy thế nào? 🌸</p>
                </div>
              </div>
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0" />
                <div className="bg-primary rounded-3xl rounded-tr-sm p-3 max-w-[76%] shadow-bubble">
                  <p className="font-body text-sm text-text-main">Mình khá ổn, cảm ơn Mia! 😊</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center font-display text-sm text-text-main">M</div>
                <div className="bg-white rounded-3xl rounded-tl-sm p-3 max-w-[76%] shadow-bubble">
                  <p className="font-body text-sm text-text-main">Thật tuyệt! Bạn có muốn chia sẻ điều gì không? ✨</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-11">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-text-sub/40 animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <span className="font-ui text-xs text-text-sub">Mia đang gõ...</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── DARK CTA ─────────────────────────────────────────── */}
      <section className="relative py-24 px-4 bg-text-main overflow-hidden">
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-bg leading-tight mb-6">
              BẮT ĐẦU<br />HÀNH TRÌNH
            </h2>
            <p className="font-body text-bg/60 text-base leading-relaxed mb-8">
              Bắt đầu chăm sóc sức khỏe tâm thần ngay hôm nay — miễn phí, không phán xét.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary rounded-full font-ui font-medium text-text-main hover:bg-primary-dark transition-colors"
            >
              Dùng ngay miễn phí <ArrowRight size={16} />
            </button>
            <p className="mt-5 font-ui text-xs text-bg/35">
              Mindora không thay thế chuyên gia tâm lý. Hỗ trợ khẩn cấp:{' '}
              <strong className="text-bg/55">1800 599 920</strong>
            </p>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center"
          >
            <div className="w-56 h-[28rem] bg-white/8 border border-white/20 rounded-[2.5rem] overflow-hidden relative">
              <div className="h-9 flex items-center justify-center border-b border-white/10">
                <div className="w-16 h-1 bg-white/25 rounded-full" />
              </div>
              <div className="p-4 flex flex-col gap-3 h-full pb-8">
                <div className="bg-white/10 rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-primary/70" />
                    <span className="font-ui text-white/65 text-xs">Mia</span>
                  </div>
                  <p className="font-body text-white/75 text-xs">Chào bạn! Hôm nay bạn thế nào? 🌸</p>
                </div>
                <div className="bg-primary/30 rounded-2xl p-3 ml-5">
                  <p className="font-body text-white/75 text-xs">Mình đang lo lắng về công việc...</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-3">
                  <p className="font-body text-white/75 text-xs">Mình hiểu. Bạn muốn kể thêm không? 💙</p>
                </div>
                <div className="mt-auto bg-white/10 rounded-2xl p-3">
                  <p className="font-ui text-white/55 text-xs mb-2">Tâm trạng hôm nay</p>
                  <div className="flex gap-2 justify-around text-base">
                    {['😊', '😐', '😟', '😴', '😤'].map((e, i) => (
                      <span
                        key={i}
                        className={`transition-transform ${i === 0 ? 'scale-125' : 'opacity-40'}`}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="py-14 px-4 bg-secondary-dark border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <p className="font-display text-bg text-2xl mb-3">Mindora</p>
              <p className="font-body text-bg/50 text-sm leading-relaxed">
                Người bạn tâm lý AI — luôn ở đây cho bạn, 24/7.
              </p>
            </div>
            {[
              {
                title: 'Tính năng',
                links: ['Chat với Mia', 'Nhật ký', 'Khám phá nhạc', 'Phân tích cảm xúc'],
              },
              {
                title: 'Hỗ trợ',
                links: ['Trung tâm hỗ trợ', 'Liên hệ', 'Báo lỗi', 'FAQ'],
              },
              {
                title: 'Pháp lý',
                links: ['Điều khoản dịch vụ', 'Chính sách bảo mật', 'Cookie'],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="font-ui text-bg text-sm font-semibold mb-4">{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="font-body text-bg/50 text-sm hover:text-bg transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="font-ui text-bg/30 text-xs">© 2025 Mindora. Không thay thế chuyên gia tâm lý.</p>
            <p className="font-ui text-bg/30 text-xs">
              Đường dây hỗ trợ:{' '}
              <strong className="text-bg/50">1800 599 920</strong>
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
