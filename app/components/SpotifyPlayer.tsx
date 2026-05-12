"use client"

import { useState, useEffect } from "react"

type SpotifyType = "playlist" | "album" | "track" | "artist"

interface SpotifyEmbed {
  type: SpotifyType
  id: string
}

function parseSpotifyUrl(url: string): SpotifyEmbed | null {
  const webMatch = url.match(/open\.spotify\.com\/(playlist|album|track|artist)\/([a-zA-Z0-9]+)/)
  if (webMatch) return { type: webMatch[1] as SpotifyType, id: webMatch[2] }
  const uriMatch = url.match(/spotify:(playlist|album|track|artist):([a-zA-Z0-9]+)/)
  if (uriMatch) return { type: uriMatch[1] as SpotifyType, id: uriMatch[2] }
  return null
}

function embedHeight(type: SpotifyType): number {
  return type === "track" ? 80 : 152
}

// Keyword → Spotify playlist mapping (curated, no API key needed)
const PLAYLIST_MAP: { keywords: string[]; label: string; id: string }[] = [
  { keywords: ["math", "calculus", "algebra", "statistics", "physics", "chemistry", "science", "formula"], label: "Deep Focus", id: "37i9dQZF1DWZeKCadgRdKQ" },
  { keywords: ["read", "reading", "literature", "essay", "english", "history", "philosophy"], label: "Lo-Fi Reading", id: "37i9dQZF1DX8Uebhn9wzrS" },
  { keywords: ["code", "coding", "program", "algorithm", "data structure", "computer", "software", "debug"], label: "Coding Mode", id: "37i9dQZF1DX5trt9i14X7j" },
  { keywords: ["exam", "test", "revision", "study", "memorize", "review", "final"], label: "Study Session", id: "37i9dQZF1DWXLeA8Omikj7" },
  { keywords: ["write", "writing", "draft", "essay", "paper", "report", "creative"], label: "Ambient Writing", id: "37i9dQZF1DX3Ynp6alla5HL" },
  { keywords: ["language", "vocab", "spanish", "french", "japanese", "german", "chinese"], label: "Focus Flow", id: "37i9dQZF1DWZZbwlv3Vmtr" },
]

function suggestPlaylist(task: string | null): { label: string; id: string } | null {
  if (!task) return null
  const lower = task.toLowerCase()
  for (const entry of PLAYLIST_MAP) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return { label: entry.label, id: entry.id }
    }
  }
  // Default fallback
  return { label: "Study Session", id: "37i9dQZF1DWXLeA8Omikj7" }
}

export default function SpotifyPlayer({ selectedTask }: { selectedTask?: string | null }) {
  const [input, setInput] = useState("")
  const [embed, setEmbed] = useState<SpotifyEmbed | null>(null)
  const [error, setError] = useState(false)
  const [suggestion, setSuggestion] = useState<{ label: string; id: string } | null>(null)

  useEffect(() => {
    const s = suggestPlaylist(selectedTask ?? null)
    setSuggestion(s)
  }, [selectedTask])

  const handlePlay = () => {
    const parsed = parseSpotifyUrl(input.trim())
    if (parsed) {
      setEmbed(parsed)
      setError(false)
    } else {
      setError(true)
    }
  }

  const loadSuggestion = () => {
    if (!suggestion) return
    setEmbed({ type: "playlist", id: suggestion.id })
    setError(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-white/35">Music</p>

      {/* Smart suggestion */}
      {suggestion && selectedTask && !embed && (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#1a1a1a] border border-[#7c6ff7]/20">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-[#7c6ff7]/60 tracking-wide">Suggested for your task</span>
            <span className="text-sm text-white/70">{suggestion.label}</span>
          </div>
          <button
            onClick={loadSuggestion}
            className="px-3 py-1.5 rounded-lg bg-[#7c6ff7]/15 border border-[#7c6ff7]/30
                       text-xs text-[#7c6ff7] hover:bg-[#7c6ff7]/25 active:scale-95 transition-all"
          >
            Play ▶
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          onKeyDown={e => e.key === "Enter" && handlePlay()}
          placeholder="Or paste a Spotify link…"
          className={`flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none
                      border-b pb-1 transition-colors
                      ${error ? "border-red-500/60" : "border-white/10 focus:border-[#7c6ff7]/60"}`}
        />
        <button
          onClick={handlePlay}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10
                     text-sm text-white/70 hover:text-white hover:border-white/20
                     active:scale-95 transition-all whitespace-nowrap"
        >
          <span className="text-[10px]">▶</span> Play
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400/80">
          Couldn't parse that URL. Paste a Spotify link for a playlist, album, track, or artist.
        </p>
      )}

      {embed && (
        <div className="rounded-xl overflow-hidden mt-1">
          <iframe
            key={`${embed.type}-${embed.id}`}
            src={`https://open.spotify.com/embed/${embed.type}/${embed.id}?utm_source=generator&theme=0`}
            width="100%"
            height={embedHeight(embed.type)}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="border-0"
          />
        </div>
      )}
    </div>
  )
}