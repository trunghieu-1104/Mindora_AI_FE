# Mindora AI

Ứng dụng web hỗ trợ sức khỏe tâm thần với AI companion tên **Mia** — lắng nghe, đồng hành, và gợi ý những điều nhỏ bé giúp bạn thấy tốt hơn mỗi ngày.

---

## Tính năng

| Tính năng | Mô tả |
|---|---|
| **Chat với Mia** | Trò chuyện với AI companion, nhận phản hồi thông cảm theo tâm trạng |
| **Nhật ký cảm xúc** | Ghi nhật ký hàng ngày với mood picker và tag phân loại |
| **Khám phá** | Nhạc theo tâm trạng, bài tập thở 4-7-8, podcast tâm lý |
| **Phân tích sức khỏe** | Dashboard biểu đồ tâm trạng 7 ngày, từ khóa nổi bật, trạng thái sức khỏe |
| **Responsive** | Giao diện đầy đủ trên mobile và desktop |

---

## Tech Stack

- **Frontend:** React 19 + Vite 8
- **Styling:** Tailwind CSS 3 (design system tùy chỉnh)
- **Animation:** Framer Motion
- **State:** Zustand + persist middleware
- **Routing:** React Router v7
- **Backend:** Supabase (Auth + Database)
- **AI:** Google Gemini API
- **Charts:** Recharts
- **Icons:** Lucide React
- **Fonts:** Playfair Display · Nunito · DM Sans

---

## Cấu trúc dự án

```
src/
├── components/
│   ├── atoms/          # Button, Avatar, Badge, Tag, MindoraLogo
│   └── organisms/      # Navbar
├── pages/
│   ├── Home/           # Landing page
│   ├── Chat/           # Chat với Mia
│   ├── Journal/        # Nhật ký cảm xúc
│   ├── Explore/        # Nhạc, thở, podcast
│   └── Dashboard/      # Phân tích sức khỏe
├── store/
│   └── useAppStore.js  # Zustand store (user, journals, mood)
├── lib/
│   ├── utils.js        # cn(), formatDate(), MOODS, QUICK_REPLIES
│   └── supabase.js     # Supabase client
├── App.jsx             # Router + layout
├── main.jsx            # Entry point
└── index.css           # Tailwind + design tokens
```

---

## Bắt đầu

### 1. Cài dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc dựa theo `.env.example`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

### 3. Chạy dev server

```bash
npm run dev
```

Mở [http://localhost:5173](http://localhost:5173) trên trình duyệt.

---

## Scripts

```bash
npm run dev      # Dev server với HMR
npm run build    # Build production
npm run preview  # Preview bản build
npm run lint     # ESLint
```

---

## Design System

### Màu sắc

| Token | Hex | Dùng cho |
|---|---|---|
| `primary` | `#C9A227` | Nút chính, active state |
| `secondary` | `#1B3A5C` | Accent tối, biểu đồ |
| `accent` | `#E8B830` | Highlight, badge |
| `bg` | `#F5F0E6` | Background toàn trang |
| `text-main` | `#1B2A3A` | Nội dung chính |
| `text-sub` | `#4A6380` | Nội dung phụ |

### Component classes

```css
.card          /* card trắng, bo góc 3xl, shadow nhẹ */
.card-hover    /* card + hover scale + shadow */
.btn-primary   /* nút vàng bo tròn */
.btn-secondary /* nút viền */
.input-field   /* input/textarea chuẩn */
.chat-bubble-ai / .chat-bubble-user
.mood-chip     /* pill chọn tâm trạng */
.section-title / .section-sub
```

---

## Trang & Routes

| Route | Trang | Mô tả |
|---|---|---|
| `/` | HomePage | Landing, hero, features, testimonials |
| `/chat` | ChatPage | Chat realtime với Mia |
| `/journal` | JournalPage | Danh sách và viết nhật ký |
| `/explore` | ExplorePage | Nhạc · Thở · Podcast |
| `/dashboard` | DashboardPage | Biểu đồ và phân tích sức khỏe |

---

## Lưu ý

> Mindora không thay thế chuyên gia tâm lý.
> Nếu cần hỗ trợ khẩn cấp: **1800 599 920** (miễn phí, 24/7)
