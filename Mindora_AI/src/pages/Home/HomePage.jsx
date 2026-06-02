import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, BookOpen, BarChart2, Music, Users, Sparkles, Star, ArrowRight } from 'lucide-react'
import Button from '../../components/atoms/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const FEATURES = [
  {
    icon: <Music size={28} />,
    color: 'bg-accent',
    title: 'Âm nhạc & Thư giãn',
    desc: 'Gợi ý nhạc theo tâm trạng của bạn — từ lo-fi êm dịu đến nhạc năng lượng để bứt phá.',
  },
  {
    icon: <BookOpen size={28} />,
    color: 'bg-primary',
    title: 'Viết nhật ký mỗi ngày',
    desc: 'Ghi lại cảm xúc, suy nghĩ. Mia sẽ phân tích và hiểu bạn hơn qua từng trang nhật ký.',
  },
  {
    icon: <Users size={28} />,
    color: 'bg-secondary',
    title: 'Kết nối chuyên gia',
    desc: 'Khi cần thêm hỗ trợ, MindBuddy kết nối bạn với các chuyên gia tâm lý uy tín.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Minh Châu',
    avatar: '🌸',
    text: 'Mia như người bạn thật sự — không phán xét, luôn lắng nghe. Mình viết nhật ký đều hơn từ ngày dùng MindBuddy.',
    mood: '🥰',
  },
  {
    name: 'Tuấn Anh',
    avatar: '🌿',
    text: 'Tính năng gợi ý nhạc theo mood rất hay! Mỗi khi stress thì mở app ra, nghe nhạc theo gợi ý là thấy dịu hơn.',
    mood: '😊',
  },
  {
    name: 'Thu Hương',
    avatar: '🦋',
    text: 'Dashboard phân tích tâm trạng giúp mình nhận ra mình thường stress vào cuối tuần. Nhờ đó mình chủ động hơn.',
    mood: '😌',
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/40 rounded-full blur-2xl" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/30 rounded-full font-ui text-sm text-text-main">
              <Sparkles size={14} />
              AI đồng hành sức khỏe tâm thần
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl md:text-6xl text-text-main leading-tight mb-6"
          >
            Hôm nay bạn<br />
            <span className="text-primary-dark">cảm thấy thế nào?</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-body text-text-sub text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Mindoraemon luôn ở đây — lắng nghe, đồng hành,<br className="hidden sm:block" />
            và gợi ý những điều nhỏ bé giúp bạn thấy tốt hơn.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/chat')}
              icon={<MessageCircle size={20} />}
            >
              Trò chuyện ngay
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/journal')}
              icon={<BookOpen size={20} />}
            >
              Xem nhật ký
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex items-center justify-center gap-6 text-text-sub"
          >
            <div className="flex -space-x-2">
              {['🌸', '🌿', '🦋', '🌙'].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm border-2 border-bg">
                  {e}
                </div>
              ))}
            </div>
            <p className="font-body text-sm">
              <span className="text-text-main font-semibold">....</span> người đang dùng Mindoraemon
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Mindoraemon */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">Tại sao chọn Mindoraemon?</h2>
            <p className="section-sub max-w-xl mx-auto">
              Mọi tính năng đều được thiết kế để bạn cảm thấy an toàn, được lắng nghe và không đơn độc.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="card-hover group"
              >
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-5 text-text-main group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="font-display text-xl text-text-main mb-3">{f.title}</h3>
                <p className="font-body text-text-sub leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">Dùng như thế nào?</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '😊', title: 'Check-in cảm xúc', desc: 'Mỗi ngày, chọn emoji thể hiện tâm trạng của bạn. Chỉ 5 giây.' },
              { step: '02', icon: '💬', title: 'Trò chuyện với Mia', desc: 'Kể cho Mia nghe — vui, buồn, hay bất cứ điều gì. Mia luôn lắng nghe.' },
              { step: '03', icon: '✨', title: 'Nhận gợi ý cá nhân', desc: 'Nhạc, bài tập thở, ghi nhật ký — tất cả được cá nhân hóa cho bạn.' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{s.icon}</div>
                <span className="font-ui text-xs text-text-sub tracking-widest uppercase">{s.step}</span>
                <h3 className="font-display text-xl text-text-main mt-2 mb-3">{s.title}</h3>
                <p className="font-body text-text-sub leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title mb-4">Người dùng nói gì?</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card relative"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-ui font-semibold text-text-main text-sm">{t.name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={12} className="fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-2xl">{t.mood}</span>
                </div>
                <p className="font-body text-text-sub text-sm leading-relaxed">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 rounded-4xl p-12"
        >
          <div className="text-5xl mb-6">🌸</div>
          <h2 className="section-title mb-4">
            Hãy để Mindoraemon là người bạn đồng hành mỗi ngày
          </h2>
          <p className="section-sub mb-8">
            Miễn phí. Không phán xét. Luôn ở đây cho bạn.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/chat')}
            icon={<ArrowRight size={20} />}
            className="mx-auto"
          >
            Bắt đầu miễn phí
          </Button>

          <p className="mt-6 font-ui text-xs text-text-sub">
            Mindoraemon không thay thế chuyên gia tâm lý. Nếu bạn cần hỗ trợ khẩn cấp: <strong>1800 599 920</strong>
          </p>
        </motion.div>
      </section>
    </div>
  )
}
