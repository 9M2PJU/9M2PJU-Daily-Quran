# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-09-10 — Emerald & Gold Luxury Aesthetic & AI Engine Optimization 🌿✨

### ✨ Added
- **Comprehensive SEO & AEO Optimization**:
  - Full Schema.org JSON-LD structured data (`WebSite` with SearchAction, `WebApplication`, `Organization`, `FAQPage`, `BreadcrumbList`)
  - AI Engine machine context files: [`/llms.txt`](public/llms.txt) and [`/llms-full.txt`](public/llms-full.txt) for ChatGPT, Perplexity, Claude, and Gemini
  - Dynamic `usePageSEO` hook for client-side title, description, Open Graph, Twitter Cards, and canonical URL synchronization
  - Complete 114-Surah XML Sitemap (`/sitemap.xml`) and search engine crawl policies (`/robots.txt`)
- **Luxury Theme & Typography**:
  - Refined palette with Midnight Emerald (`#07140e`), Warm Gold (`#d4af37`), and rich glassmorphism
  - Arabic typography with Amiri and Noto Naskh Arabic font feature ligatures and customizable font sizing
  - Custom emerald scrollbars and decorative Islamic geometry accents
- **Interactive 30 Juz Navigation**:
  - Complete dataset of 30 Juz entries with starting Surah names, Arabic calligraphy, and direct Ayah jump links
  - Place of revelation filtering (*Makkah* vs *Madinah*) in Surah Index
- **Tafsir Exegesis Drawer**:
  - Integrated commentary from classical scholars (Ibn Kathir, Al-Jalalayn, Ma'arif al-Qur'an, Tazkirul Quran)
- **Enhanced Prayer Times & Qibla Compass**:
  - Live animated compass dial with Kaaba bearing visualization, degree readout, DMS coordinates, and Next Prayer detector

### 🔧 Changed
- Upgraded UI across all pages: Home, Surah Reader, Surah Directory, Prayer Times, Library, Bookmarks, Activity, Settings, and Notifications
- Standardized Malay translations with authentic Islamic terminology

---

## [2.0.0] - 2026-02-19 — First Stable Release 🎉

### ✨ Added
- **Inline Personal Notes** — Add/edit notes directly in the verse card when bookmarking
- **Edit Note Button** — Toggle note editor for already-bookmarked verses without unbookmarking
- **Prayer Times & Qibla** — Full prayer times page with GPS-based Qibla bearing (degree, cardinal direction, DMS, distance to Kaaba)
- **Desktop Sidebar Navigation** — Prayer Times & Qibla link added to desktop sidebar
- **Mobile Navigation** — Bookmarks ("Saved") link added to mobile bottom nav bar
- **Geolocation Timeout** — 10-second timeout with cached location to prevent hanging on desktop
- **Retry Button** — Added to location error screen for easy retry

### 🔧 Changed
- **Merged Bookmark & Note Actions** — Removed separate "Add Note" button; bookmarking now opens inline note editor automatically
- **Qibla Simplified** — Replaced unreliable compass sensor with GPS-based bearing display (works on all devices)
- **Improved Error States** — Loading and error views use `min-h-[50vh]` to prevent blank pages

### 🐛 Fixed
- **Blank Page on Desktop** — Fixed `h-full` CSS issue causing invisible content in flex containers
- **Android Compass Stuck** — Resolved by removing sensor dependency entirely
- **Geolocation Hanging** — Added timeout and `maximumAge` caching to `useGeolocation` hook

---

## [1.3.1] - 2026-02-18

### ✨ Added
- **Optional Verse Translations** — Toggle translation visibility for focused Arabic reading
- **Screen Wake Lock** — Prevents screen dimming during audio playback on mobile
- **Real Tafsir Scholar Selector** — Integrated Quran.com API for live exegesis from multiple scholars
- **Persistent Audio Controls** — Header player now works instantly without manual activation

### 🔧 Changed
- **Tagline Refinement** — Updated to "Guide us to the straight path" (Al-Fatihah 1:6)
- **Surah Layout Fix** — Centered vertical alignment for a more premium reading experience
- **PWA Icons** — Fixed icon consistency for valid installability
- **Performance Bump** — Optimized Context rendering with `useMemo` for stable playback

---

## [1.2.0] - 2026-02-17

### ✨ Added
- Focus Mode with verse-by-verse navigation and auto-scroll
- 10 Quran reciters with selection in Settings
- Bookmarks & Personal Notes system
- Scroll spy for auto-updating sidebar context
- Deep linking to verses

### 🔧 Changed
- Audio auto-stop on page exit

---

## [1.0.0] - 2026-02-18

### 🚀 Launched
- Initial release of **9M2PJU Daily Quran PWA**
- Full text of the Quran in Uthmani script

### ✨ Added
- **Audio Player** — Integrated sticky footer player with continuous playback (Reciter: Mishary Rashid Alafasy)
- **Translations** — English (Saheeh International), Malay (Abdul Hameed), Indonesian (Kemenag)
- **Settings** — Language selector and Dark Mode toggle
- **Persistence** — Remembers last read Surah and theme preference using LocalStorage
- **Search** — Real-time search functionality for Surahs
- **PWA** — Fully configured manifest and service worker for installability
- **Domain** — Custom domain support at `quran.hamradio.my`

### 💅 UI/UX
- Responsive design for Mobile, Tablet, and Desktop
- Smooth page transitions and staggered animations using Framer Motion
- Custom logo and branding

### 🔧 Tech Stack
- Migrated to React + Vite for better performance
- Setup GitHub Actions for automated deployment
