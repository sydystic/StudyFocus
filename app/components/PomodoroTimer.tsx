"use client"

import { useState, useEffect, useRef, useCallback } from "react"

type Session = {
  task: string
  duration: number
  date: string
}

function saveSession(session: Session) {
  const existing: Session[] = JSON.parse(localStorage.getItem("sessions") || "[]")
  existing.push(session)
  localStorage.setItem("sessions", JSON.stringify(existing))
}

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

export function PomodoroTimer({ selectedTask }: { selectedTask: string | null }) {
  const [customMinutes, setCustomMinutes] = useState(25)
  const [editingDuration, setEditingDuration] = useState(false)
  const [remaining, setRemaining] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const endTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const sessionStartRef = useRef<number | null>(null)

  const TOTAL = customMinutes * 60

  const tick = useCallback(() => {
    if (!endTimeRef.current) return
    const secs = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000))
    setRemaining(secs)
    if (secs > 0) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      setRunning(false)
      if (sessionStartRef.current && selectedTask) {
        const duration = Math.round((Date.now() - sessionStartRef.current) / 1000)
        saveSession({ task: selectedTask, duration, date: new Date().toISOString() })
        sessionStartRef.current = null
      }
    }
  }, [selectedTask])

  useEffect(() => {
    if (running) {
      if (!sessionStartRef.current) sessionStartRef.current = Date.now()
      endTimeRef.current = Date.now() + remaining * 1000
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  const applyMinutes = (mins: number) => {
    const clamped = Math.max(1, Math.min(120, mins))
    setCustomMinutes(clamped)
    setRemaining(clamped * 60)
    setRunning(false)
    sessionStartRef.current = null
  }

  const toggle = () => { if (remaining > 0) setRunning(r => !r) }
  const reset  = () => { setRunning(false); setRemaining(TOTAL); sessionStartRef.current = null }

  const done   = remaining === 0
  const circ   = 2 * Math.PI * 90
  const offset = circ * (remaining / TOTAL)

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle
            cx="100" cy="100" r="90" fill="none"
            stroke={done ? "#34d399" : "#7c6ff7"}
            strokeWidth="3" strokeLinecap="round"
            style={{ strokeDasharray: circ, strokeDashoffset: offset, transition: "stroke-dashoffset 0.5s linear" }}
          />
        </svg>

        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">
            {done ? "done" : running ? "running" : "focus"}
          </span>

          {editingDuration ? (
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => applyMinutes(customMinutes - 5)}
                  className="w-7 h-7 rounded-full border border-white/20 text-white/60
                             hover:border-[#7c6ff7]/60 hover:text-white
                             flex items-center justify-center transition-all active:scale-90"
                >
                  −
                </button>
                <span className="font-mono text-4xl font-light text-white tabular-nums w-14 text-center">
                  {String(customMinutes).padStart(2, "0")}
                </span>
                <button
                  onClick={() => applyMinutes(customMinutes + 5)}
                  className="w-7 h-7 rounded-full border border-white/20 text-white/60
                             hover:border-[#7c6ff7]/60 hover:text-white
                             flex items-center justify-center transition-all active:scale-90"
                >
                  +
                </button>
              </div>
              <span className="text-[9px] text-white/25 tracking-widest uppercase">minutes</span>
              <div className="flex gap-1">
                {[15, 25, 45, 60].map(m => (
                  <button
                    key={m}
                    onClick={() => applyMinutes(m)}
                    className={`px-2 py-0.5 rounded text-[10px] transition-all active:scale-95
                      ${customMinutes === m
                        ? "bg-[#7c6ff7] text-white"
                        : "bg-white/6 text-white/35 hover:bg-white/10 hover:text-white/60"}`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
              <button
                onClick={() => setEditingDuration(false)}
                className="text-[9px] text-[#7c6ff7]/60 hover:text-[#7c6ff7] transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className={`font-mono text-5xl font-light tabular-nums tracking-tight
                ${done ? "text-emerald-400" : "text-white"}`}>
                {fmt(remaining)}
              </span>
              {!running && !done && (
                <button
                  onClick={() => setEditingDuration(true)}
                  className="text-[10px] text-white/20 hover:text-[#7c6ff7]/60 transition-colors"
                >
                  set time
                </button>
              )}
              {/* selectedTask intentionally NOT shown here */}
            </div>
          )}
        </div>
      </div>

      {!editingDuration && (
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            disabled={done}
            className="px-6 py-2.5 rounded-lg bg-[#7c6ff7] text-sm font-medium text-white
                       hover:bg-[#6a5ef0] active:scale-95 transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {running ? "Pause" : "Start"}
          </button>
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-lg border border-white/20 text-sm font-medium text-white
                       hover:border-white/40 active:scale-95 transition-all"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}