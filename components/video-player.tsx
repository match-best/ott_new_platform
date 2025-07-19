"use client"

import { useRef } from "react"
import YouTube, { type YouTubeProps } from "react-youtube"

interface VideoPlayerProps {
  videoId: string
  contentId: string
  onPlay?: () => void
  onPause?: () => void
  onEnd?: () => void
}

export function VideoPlayer({ videoId, contentId, onPlay, onPause, onEnd }: VideoPlayerProps) {
  const playerRef = useRef<any>(null)

  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
    },
  }

  const onReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target
  }

  const onPlayHandler: YouTubeProps["onPlay"] = () => {
    // Track play event
    fetch("/api/analytics/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentId,
        action: "play",
        timestamp: new Date(),
      }),
    })
    onPlay?.()
  }

  const onPauseHandler: YouTubeProps["onPause"] = () => {
    // Track pause event
    fetch("/api/analytics/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentId,
        action: "pause",
        timestamp: new Date(),
      }),
    })
    onPause?.()
  }

  const onEndHandler: YouTubeProps["onEnd"] = () => {
    // Track completion
    fetch("/api/analytics/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentId,
        action: "complete",
        timestamp: new Date(),
      }),
    })
    onEnd?.()
  }

  return (
    <div className="aspect-video w-full">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onPlay={onPlayHandler}
        onPause={onPauseHandler}
        onEnd={onEndHandler}
        className="w-full h-full"
      />
    </div>
  )
}
