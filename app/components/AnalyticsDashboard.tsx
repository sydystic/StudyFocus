"use client"

import { useEffect, useState } from "react"

type Session = {
    task: string
    duration: number
    date: string
}

function loadSessions(): Session[] {
    try { return JSON.parse(localStorage.getItem("sessions") || "[]") } catch { return [] }
}

function getDayKey(date: Date) {
    return date.toISOString().slice(0, 10)
}

function getLast7Days() {
    const days = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        days.push(getDayKey(d))
    }
    return days
}

function getStreak(sessionsByDay: Record<string, number>): number {
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        if (sessionsByDay[getDayKey(d)]) {
            streak++
        } else if (i > 0) {
            break
        }
    }
    return streak
}

function shortDay(dateStr: string) {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("en", { weekday: "short" }).slice(0, 1)
}

export function AnalyticsDashboard() {
    const [sessions, setSessions] = useState<Session[]>([])
    const [open, setOpen] = useState(false)

    useEffect(() => { setSessions(loadSessions()) }, [open])

    const days = getLast7Days()
    const sessionsByDay: Record<string, number> = {}
    for (const s of sessions) {
        const key = getDayKey(new Date(s.date))
        sessionsByDay[key] = (sessionsByDay[key] || 0) + 1
    }

    const streak = getStreak(sessionsByDay)
    const todayCount = sessionsByDay[getDayKey(new Date())] || 0
    const weekTotal = days.reduce((sum, d) => sum + (sessionsByDay[d] || 0), 0)
    const maxInDay = Math.max(1, ...days.map(d => sessionsByDay[d] || 0))

    const totalMinutes = sessions.reduce((sum, s) => sum + Math.round(s.duration / 60), 0)
    const totalHours = Math.floor(totalMinutes / 60)
    const remMins = totalMinutes % 60

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl
                   bg-[#111111] border border-white/8 text-left hover:border-white/15 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-lg">📊</span>
                    <div>
                        <p className="text-sm text-white/70 font-medium">Analytics</p>
                        <p className="text-[11px] text-white/30">
                            {streak > 0 ? `${streak}-day streak · ` : ""}{weekTotal} sessions this week
                        </p>
                    </div>
                </div>
                <span className="text-white/25 text-xs">View ›</span>
            </button>
        )
    }

    return (
        <div className="w-full bg-[#111111] border border-white/8 rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-white/35">Analytics</p>
                <button onClick={() => setOpen(false)} className="text-xs text-white/25 hover:text-white/50 transition-colors">
                    Close
                </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { label: "Streak", value: streak > 0 ? `${streak}d` : "—", sub: "days in a row" },
                    { label: "Today", value: String(todayCount), sub: "sessions" },
                    { label: "Focus time", value: totalHours > 0 ? `${totalHours}h ${remMins}m` : `${remMins}m`, sub: "all time" },
                ].map(stat => (
                    <div key={stat.label} className="flex flex-col items-center gap-0.5 px-2 py-3 rounded-xl bg-[#1a1a1a]">
                        <span className="text-[10px] text-white/30 tracking-wide">{stat.label}</span>
                        <span className="text-xl font-light text-white">{stat.value}</span>
                        <span className="text-[9px] text-white/20">{stat.sub}</span>
                    </div>
                ))}
            </div>

            {/* Weekly bar chart */}
            <div>
                <p className="text-[10px] text-white/30 mb-2 tracking-wide">Last 7 days</p>
                <div className="flex items-end gap-1.5 h-16">
                    {days.map(day => {
                        const count = sessionsByDay[day] || 0
                        const isToday = day === getDayKey(new Date())
                        const heightPct = count === 0 ? 4 : Math.max(12, (count / maxInDay) * 100)
                        return (
                            <div key={day} className="flex flex-col items-center gap-1 flex-1">
                                <div
                                    className="w-full rounded-sm transition-all"
                                    style={{
                                        height: `${heightPct}%`,
                                        background: isToday
                                            ? count > 0 ? "#7c6ff7" : "rgba(124,111,247,0.15)"
                                            : count > 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                                    }}
                                    title={`${count} session${count !== 1 ? "s" : ""}`}
                                />
                                <span className={`text-[9px] ${isToday ? "text-[#7c6ff7]/70" : "text-white/20"}`}>
                                    {shortDay(day)}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {sessions.length === 0 && (
                <p className="text-center text-xs text-white/20 py-2">Complete your first session to see stats here.</p>
            )}
        </div>
    )
}