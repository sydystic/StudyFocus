"use client"

import { useState } from "react"

type SubTask = {
    title: string
    sessions: number
}

export function AITaskBreakdown({ onAddTasks }: { onAddTasks: (tasks: string[]) => void }) {
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [subtasks, setSubtasks] = useState<SubTask[]>([])
    const [error, setError] = useState<string | null>(null)
    const [added, setAdded] = useState(false)

    const breakdown = async () => {
        const goal = input.trim()
        if (!goal) return
        setLoading(true)
        setError(null)
        setSubtasks([])
        setAdded(false)

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `You are a study planner. Break this study goal into 3-5 specific, actionable sub-tasks.
Respond ONLY with a JSON array, no markdown, no explanation. Format:
[{"title": "sub-task description", "sessions": number_of_25min_pomodoros}]
Keep titles concise (under 8 words). sessions should be 1-4.

Goal: ${goal}`
                            }]
                        }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
                    }),
                }
            )

            const data = await res.json()
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
            const clean = text.replace(/```json|```/g, "").trim()
            const parsed: SubTask[] = JSON.parse(clean)
            setSubtasks(parsed)
        } catch {
            setError("Couldn't break that down. Check your API key or try again.")
        } finally {
            setLoading(false)
        }
    }

    const addAll = () => {
        onAddTasks(subtasks.map(t => t.title))
        setAdded(true)
    }

    return (
        <div className="flex flex-col gap-3">
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-white/35">
                AI Study Planner
            </p>

            <div className="flex gap-2">
                <input
                    className="flex-1 h-10 px-3 text-sm rounded-lg bg-[#1a1a1a] border border-white/10
                     text-white placeholder-white/25 outline-none focus:border-[#7c6ff7]/60 transition-colors"
                    placeholder="e.g. Study for data structures exam…"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && breakdown()}
                />
                <button
                    onClick={breakdown}
                    disabled={loading || !input.trim()}
                    className="h-10 px-4 text-sm font-medium rounded-lg bg-[#7c6ff7] text-white
                     hover:bg-[#6a5ef0] active:scale-95 transition-all
                     disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {loading ? (
                        <span className="flex items-center gap-1.5">
                            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Planning
                        </span>
                    ) : "Break down"}
                </button>
            </div>

            {error && <p className="text-xs text-red-400/80 px-1">{error}</p>}

            {subtasks.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-1">
                    {subtasks.map((t, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/8">
                            <div className="flex items-center gap-2.5">
                                <span className="text-[10px] text-[#7c6ff7]/50 font-mono w-4">{i + 1}</span>
                                <span className="text-sm text-white/75">{t.title}</span>
                            </div>
                            <span className="text-[10px] text-white/30 shrink-0 ml-2">
                                {t.sessions} {t.sessions === 1 ? "session" : "sessions"}
                            </span>
                        </div>
                    ))}

                    <button
                        onClick={addAll}
                        disabled={added}
                        className="mt-1 w-full py-2 rounded-lg border border-[#7c6ff7]/30 text-sm text-[#7c6ff7]
                       hover:bg-[#7c6ff7]/10 active:scale-95 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {added ? "✓ Added to tasks" : "Add all to tasks"}
                    </button>
                </div>
            )}
        </div>
    )
}