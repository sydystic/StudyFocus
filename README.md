<div align="center">

# 🎯 StudyFocus

### Focus. Track. Improve.

**A minimalist AI-powered study productivity app for students who actually want to get things done.**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-focusonyourstudy.vercel.app-6C63FF?style=for-the-badge)](https://focusonyourstudy.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://focusonyourstudy.vercel.app/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## 🤔 Why StudyFocus?

Most productivity apps are either too bloated or too basic. StudyFocus hits the sweet spot — a clean, distraction-free workspace that combines everything a student needs: a Pomodoro timer, task management, Spotify music, AI study planning, and session analytics. All in one tab. No account needed.

---

## ✨ Features

- ⏱️ **Pomodoro Timer** — customizable session durations, focus mode
- ✅ **Smart Task Manager** — create, select, and track tasks per session
- 🤖 **AI Study Planner** — paste a topic, get an AI-generated study breakdown
- 🎵 **Spotify Integration** — paste any playlist link, play music without switching tabs
- 📊 **Session Analytics** — track sessions, streaks, and weekly progress
- 📱 **Installable PWA** — add to home screen on iOS/Android, works offline
- 💾 **No backend needed** — all data stored locally in the browser

---

## 🎬 Demo

🔗 **Try it live:** [focusonyourstudy.vercel.app](https://focusonyourstudy.vercel.app/)

<!-- Add a screenshot or GIF here -->
<!-- ![StudyFocus Demo](./assets/demo.gif) -->

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| PWA | next-pwa |
| AI | LLM integration for study breakdowns |
| Storage | localStorage (no backend) |
| Deployment | Vercel |

---

## 📦 Run Locally

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/sydystic/StudyFocus.git
cd StudyFocus

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

> **Note:** For full PWA functionality (offline support, installability), run a production build:
> ```bash
> npm run build && npm start
> ```

---

## 📁 Project Structure

```
StudyFocus/
├── app/                 # Next.js App Router pages & components
│   ├── components/      # Timer, TaskManager, SpotifyPlayer, Analytics
│   └── page.tsx         # Main app entry
├── public/              # Static assets, PWA manifest & icons
├── next.config.ts       # Next.js + PWA config
├── tailwind.config.ts   # Tailwind setup
└── tsconfig.json        # TypeScript config
```

---

## 📱 Install as an App

StudyFocus is a Progressive Web App — you can install it like a native app:

**On Mobile (iOS/Android):** Open in browser → Share → "Add to Home Screen"

**On Desktop (Chrome/Edge):** Click the install icon in the address bar

Once installed, it opens in standalone mode with no browser UI.

---

## 🗺️ Roadmap

- [ ] Cloud sync across devices
- [ ] Custom Pomodoro presets (25/5, 50/10, etc.)
- [ ] AI-generated session summaries
- [ ] Study streak notifications
- [ ] Export analytics to PDF

---

## 👤 Author

**Siddhi** — [@sydystic](https://github.com/sydystic) · [LinkedIn](https://www.linkedin.com/in/siddhikurne/)

---


<div align="center">
  <sub>Built for students who are tired of switching between 10 tabs just to study.</sub>
</div>
