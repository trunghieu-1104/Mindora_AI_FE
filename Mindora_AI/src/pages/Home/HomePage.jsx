import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown, Ear, Heart, Lightbulb } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
}


export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-organic-pattern animate-ken-burns pointer-events-none" />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <motion.p
            variants={fadeUp}
            className="font-ui text-white/80 text-xs uppercase tracking-widest mb-6"
          >
            AI Companion cho sức khỏe tinh thần của bạn
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-[4rem] sm:text-[6rem] md:text-[8rem] leading-none text-white font-bold mb-4"
          >
            GẶP DORA
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-display text-xl sm:text-2xl md:text-3xl italic text-white/90 mb-6"
          >
            Người đồng hành tâm trí của bạn
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="font-body text-white/75 text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto"
          >
            Lắng nghe, thấu hiểu và đồng hành cùng bạn mỗi ngày.
           
          </motion.p>

          <motion.div variants={fadeUp}>
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white rounded-full font-ui font-medium text-text-main hover:bg-white/90 transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
            >
              Bắt đầu trò chuyện <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>

        {/* Down arrow indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* ─── ABOUT DORA ───────────────────────────────────────── */}
      <section className="py-28 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 rounded-full font-ui text-xs text-primary uppercase tracking-widest mb-6">
              AI Companion
            </span>

            <h2 className="font-display text-3xl md:text-5xl text-text-main leading-snug mb-6">
              Dora không chỉ là một chatbot —{' '}
              <span className="italic text-primary">cậu ấy là người bạn đồng hành lắng nghe bạn khi bạn cần</span>
            </h2>

            <p className="font-body text-text-sub text-base md:text-lg leading-relaxed mb-14 max-w-2xl mx-auto">
              Được xây dựng dựa trên các nguyên lý tâm lý học tích cực,
              Dora đồng hành cùng bạn trên hành trình chăm sóc sức khỏe tinh thần mỗi ngày -
              nhẹ nhàng, không phán xét, luôn sẵn sàng.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Ear size={22} strokeWidth={1.5} />,
                  title: 'Lắng nghe',
                  desc: 'Phản hồi thấu cảm, hiểu được cảm xúc của bạn',
                },
                {
                  icon: <Heart size={22} strokeWidth={1.5} />,
                  title: 'Đồng hành',
                  desc: 'Luôn ở đây mỗi khi bạn cần một người để trò chuyện',
                },
                {
                  icon: <Lightbulb size={22} strokeWidth={1.5} />,
                  title: 'Gợi ý',
                  desc: 'Bài tập nhỏ, lời khuyên thiết thực mỗi ngày',
                },
              ].map((item) => (
                <div key={item.title} className="bg-bg rounded-3xl p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-lg text-text-main font-semibold mb-2">{item.title}</h3>
                  <p className="font-body text-text-sub text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURE CARDS ────────────────────────────────────── */}
      <section className="py-20 px-4 bg-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl text-text-main mb-3"
            >
              Đồng hành cùng bạn 
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-body text-text-sub text-base max-w-lg mx-auto"
            >
              Mỗi tính năng được thiết kế để đồng hành cùng bạn trên hành trình
              chăm sóc sức khỏe tinh thần
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                bg: 'bg-chat-blobs',
                title: 'Trò chuyện',
                desc: 'Tâm sự với Dora bất cứ lúc nào bạn cần. Nhận phản hồi thấu cảm và những lời khuyên nhẹ nhàng.',
                to: '/chat',
              },
              {
                bg: 'bg-journal-notebook',
                title: 'Nhật ký',
                desc: 'Ghi lại cảm xúc và suy nghĩ mỗi ngày để hiểu bản thân rõ hơn.',
                to: '/journal',
              },
              {
                bg: 'bg-explore-wave',
                title: 'Thiền & Nhạc',
                desc: 'Khám phá nhạc và bài thiền được gợi ý theo tâm trạng của bạn.',
                to: '/explore',
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25 }}
                onClick={() => navigate(card.to)}
                className={`relative h-[420px] rounded-3xl overflow-hidden cursor-pointer group ${card.bg}`}
                style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-display text-2xl text-white font-semibold mb-1">{card.title}</h3>
                  <p className="font-body text-white/75 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EMOTIONS ─────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-bg">
        <div className="max-w-6xl mx-auto">

          {/* Top row: title + mood tags */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="font-display italic text-primary text-sm mb-1">phân tích cảm xúc</p>
              <h2 className="font-display text-4xl md:text-5xl text-text-main font-bold leading-tight">
                Hiểu rõ cảm xúc
              </h2>
              <p className="font-display italic text-primary text-3xl md:text-4xl mt-1">mỗi ngày</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { emoji: '😊', label: 'Vui vẻ' },
                { emoji: '😌', label: 'Bình yên' },
                { emoji: '😟', label: 'Lo âu' },
                { emoji: '🙏', label: 'Biết ơn' },
              ].map((tag) => (
                <span key={tag.label} className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full font-ui text-sm text-text-main shadow-sm border border-primary/10">
                  {tag.emoji} {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* 4 image cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { img: '/bieu_do.jpg',    title: 'Biểu đồ tâm trạng', sub: 'Theo dõi 7 ngày' },
              { img: '/tu_khoa.jpg',    title: 'Từ khóa nổi bật',   sub: 'Chủ đề thường gặp' },
              { img: '/Mood_Picker.jpg', title: 'Mood picker',       sub: 'Chọn tâm trạng' },
              { img: '/Insight.jpg',     title: 'Insight tuần',      sub: 'Phân tích & gợi ý' },
            ].map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                onClick={() => navigate('/dashboard')}
                className="rounded-3xl overflow-hidden cursor-pointer group bg-white shadow-sm hover:shadow-soft transition-shadow duration-300"
              >
                <div
                  className="h-[280px] bg-cover bg-center"
                  style={{ backgroundImage: `url('${card.img}')` }}
                />
                <div className="px-4 py-3">
                  <p className="font-display text-base text-text-main font-semibold">{card.title}</p>
                  <p className="font-body text-xs text-text-sub mt-0.5">{card.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA link */}
          <div className="text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 font-ui font-semibold text-primary hover:gap-3 transition-all duration-300"
            >
              Xem phân tích đầy đủ <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* ─── LARGE PHOTO ──────────────────────────────────────── */}
      <section
        className="relative h-[110vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/BK.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Semi-transparent dark overlay */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />

        {/* Center content */}
        <div className="relative z-10 text-center px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl text-white font-bold leading-tight mb-6 uppercase"
          >
            Bắt đầu hành trình
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-body text-white/80 text-lg md:text-xl mb-10"
          >
            Mỗi ngày một bước nhỏ<br />cùng Dora đồng hành bên bạn
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-3 pl-2 pr-6 py-2 bg-text-main/90 hover:bg-text-main rounded-full transition-colors duration-300 cursor-pointer group"
            >
              <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg shrink-0">
                💬
              </span>
              <span className="font-ui font-semibold text-white text-base">Trò chuyện với Dora ngay</span>
              <ArrowRight size={16} className="text-white/70 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
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
              Hãy tìm thấy bình tĩnh<br/>của cùng Mindora
            </h2>
            <p className="font-body text-text-sub text-base leading-relaxed mb-8">
              Từ những cuộc trò chuyện nhỏ đến những khoảnh khắc khó khăn nhất —
              Dora luôn ở đây, sẵn sàng lắng nghe và đồng hành cùng bạn mỗi ngày.
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
            {/* Chat header */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-primary/10">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-display text-sm font-bold text-white">D</div>
              <div>
                <p className="font-ui text-sm font-semibold text-text-main">Dora</p>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  <span className="font-ui text-xs text-text-sub">Đang hoạt động</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center font-display text-sm font-bold text-white">D</div>
                <div className="bg-white rounded-3xl rounded-tl-sm p-3 max-w-[76%] shadow-bubble">
                  <p className="font-body text-sm text-text-main">Xin chào! Hôm nay bạn cảm thấy thế nào?</p>
                </div>
              </div>
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-secondary/60 flex-shrink-0" />
                <div className="bg-primary/20 rounded-3xl rounded-tr-sm p-3 max-w-[76%] shadow-bubble">
                  <p className="font-body text-sm text-text-main">Mình hơi căng thẳng, công việc nhiều quá.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center font-display text-sm font-bold text-white">D</div>
                <div className="bg-white rounded-3xl rounded-tl-sm p-3 max-w-[76%] shadow-bubble">
                  <p className="font-body text-sm text-text-main">Mình nghe bạn. Hãy kể thêm về điều đó nhé.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-11">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-text-sub/40 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="font-ui text-xs text-text-sub">Dora đang nhập...</span>
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
              Bắt đầu chăm sóc sức khỏe tâm thần ngay hôm nay - miễn phí, không phán xét.
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
                    <span className="font-ui text-white/65 text-xs">Dora</span>
                  </div>
                  <p className="font-body text-white/75 text-xs">Chào bạn! Hôm nay bạn thế nào?</p>
                </div>
                <div className="bg-primary/30 rounded-2xl p-3 ml-5">
                  <p className="font-body text-white/75 text-xs">Mình đang lo lắng về công việc...</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-3">
                  <p className="font-body text-white/75 text-xs">Mình hiểu. Bạn muốn kể thêm không?</p>
                </div>
                <div className="mt-auto bg-white/10 rounded-2xl p-3">
                  <p className="font-ui text-white/55 text-xs mb-3">Tâm trạng hôm nay</p>
                  <div className="flex gap-2 justify-around">
                    {[
                      { label: 'Vui', color: '#C9A227' },
                      { label: 'Bình', color: '#6B7686' },
                      { label: 'Lo', color: '#6B7280' },
                      { label: 'Buồn', color: '#4B5563' },
                      { label: 'Mệt', color: '#374151' },
                    ].map((m, i) => (
                      <div key={m.label} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-5 h-5 rounded-full transition-transform ${i === 0 ? 'scale-125 ring-2 ring-white/40' : 'opacity-40'}`}
                          style={{ backgroundColor: m.color }}
                        />
                        <span className={`font-ui text-[9px] ${i === 0 ? 'text-white/80' : 'text-white/30'}`}>{m.label}</span>
                      </div>
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
                links: ['Chat với Dora', 'Nhật ký', 'Khám phá nhạc', 'Phân tích cảm xúc'],
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
            <p className="font-ui text-bg/30 text-xs">© 2026 Mindora. Không thay thế chuyên gia tâm lý.</p>
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
