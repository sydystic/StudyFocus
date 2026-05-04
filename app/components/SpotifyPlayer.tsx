"use client"

import { useState } from "react"

type SpotifyType = "playlist" | "album" | "track" | "artist"

interface SpotifyEmbed {
  type: SpotifyType
  id: string
}

function parseSpotifyUrl(url: string): SpotifyEmbed | null {
  // Web URL: https://open.spotify.com/{type}/{id}
  const webMatch = url.match(/open\.spotify\.com\/(playlist|album|track|artist)\/([a-zA-Z0-9]+)/)
  if (webMatch) return { type: webMatch[1] as SpotifyType, id: webMatch[2] }

  // URI: spotify:{type}:{id}
  const uriMatch = url.match(/spotify:(playlist|album|track|artist):([a-zA-Z0-9]+)/)
  if (uriMatch) return { type: uriMatch[1] as SpotifyType, id: uriMatch[2] }

  return null
}

// Albums and tracks use compact height; playlists/artists need more room
function embedHeight(type: SpotifyType): number {
  return type === "track" ? 80 : 152
}

export default function SpotifyPlayer() {
  const [input, setInput] = useState("")
  const [embed, setEmbed] = useState<SpotifyEmbed | null>(null)
  const [error, setError] = useState(false)

  const handlePlay = () => {
    const parsed = parseSpotifyUrl(input.trim())
    if (parsed) {
      setEmbed(parsed)
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          onKeyDown={e => e.key === "Enter" && handlePlay()}
          placeholder="Paste Spotify link (playlist, album, track…)"
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