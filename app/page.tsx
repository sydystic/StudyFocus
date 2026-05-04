"use client"

import { useState } from "react"
import { TaskManager } from "./components/TaskManager"
import { PomodoroTimer } from "./components/PomodoroTimer"
import SpotifyPlayer from "./components/SpotifyPlayer"

export default function StudyFocusPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">

      <header className="py-5 text-center border-b border-white/10">
        <h1 className="text-xl font-semibold tracking-wide">StudyFocus</h1>
        <p className="text-sm text-white/40 mt-0.5 tracking-widest">Focus. Track. Improve.</p>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8 gap-6 max-w-lg mx-auto w-full">


        {/* Timer — shows which task is active */}
        <section className="flex flex-col items-center w-full">
          {selectedTask && (
            <p className="text-xs text-[#7c6ff7]/60 mb-3 truncate max-w-xs text-center">
              Focusing on: <span className="text-[#7c6ff7]">{selectedTask}</span>
            </p>
          )}
          <PomodoroTimer selectedTask={selectedTask} />
        </section>

        {/* Tasks — top of page for widget-style quick access */}
        <section className="w-full bg-[#111111] border border-white/8 rounded-2xl p-4">
          <TaskManager onSelect={setSelectedTask} />
        </section>

        {/* Spotify */}
        <section className="w-full bg-[#111111] border border-white/8 rounded-2xl p-4">
          <SpotifyPlayer />
        </section>

      </main>

      <footer className="py-6 border-t border-white/8 text-center flex flex-col gap-2">
        <p className="text-xs text-white/25">studyfocus. minimalist productivity.</p>
        <p className="text-xs text-white/25">made by siddhi.</p>
      </footer>

    </div>
  )
}