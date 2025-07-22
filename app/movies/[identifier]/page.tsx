"use client"

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { StreamplayNavbar } from "@/components/netflix-navbar";
import { Input } from "@/components/ui/input";
import { useSmartSearch } from "@/hooks/use-smart-search";

export default function MoviePlayerPage() {
  const router = useRouter();
  const { identifier } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { results, loading: searchLoading, error, triggerSearch } = useSmartSearch();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!identifier) return;
    fetch(`https://archive.org/metadata/${identifier}`)
      .then((res) => res.json())
      .then((data) => {
        // Find the first mp4 file
        const file = data.files?.find((f: any) => f.name.endsWith(".mp4"));
        setMovie({
          title: data.metadata?.title || identifier,
          description: data.metadata?.description || "No description available.",
          thumbnail: data.metadata?.thumb || data.metadata?.cover || "/placeholder.jpg",
          videoUrl: file ? `https://archive.org/download/${identifier}/${file.name}` : null,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [identifier]);

  // Smart search trigger
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm) triggerSearch(searchTerm);
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">Loading...</div>;
  }

  if (!movie || !movie.videoUrl) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">Video not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center">
      <StreamplayNavbar />
      <div className="pt-20 px-4 flex flex-col items-center w-full">
        {/* Smart Search Bar */}
        <div className="w-full max-w-3xl mb-8">
          <Input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search anything about this movie or others..."
            className="bg-gray-900 text-white border-gray-700 focus:ring-pink-500"
          />
          {searchLoading && <div className="text-gray-400 mt-2">Searching...</div>}
          {error && <div className="text-red-400 mt-2">{error}</div>}
          {results.length > 0 && (
            <div className="mt-4 bg-gray-800 rounded-lg p-4 space-y-2">
              {results.map((item, idx) => (
                <div key={idx} className="text-white text-base border-b border-gray-700 last:border-b-0 pb-2 last:pb-0">
                  <div className="font-semibold">{item.title || item.name}</div>
                  <div className="text-gray-300 text-sm">{item.description || item.overview}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <h1 className="text-white text-3xl font-bold mb-4 text-center drop-shadow-lg">{movie.title}</h1>
        <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-pink-500/40 bg-black mb-8 flex items-center justify-center">
          <video
            ref={videoRef}
            src={movie.videoUrl}
            poster={movie.thumbnail}
            controls
            className="w-full h-full rounded-2xl bg-black"
            style={{objectFit: 'cover'}}
          />
          <button
            className="absolute top-4 right-4 z-10 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            onClick={() => {
              const el = videoRef.current;
              if (el && el.requestFullscreen) el.requestFullscreen();
              else if (el && (el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
              else if (el && (el as any).msRequestFullscreen) (el as any).msRequestFullscreen();
            }}
            aria-label="Fullscreen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 0 0-2 2v3m0 8v3a2 2 0 0 0 2 2h3m8-16h3a2 2 0 0 1 2 2v3m0 8v3a2 2 0 0 1-2 2h-3" /></svg>
          </button>
        </div>
        <div className="max-w-3xl text-gray-300 text-lg bg-gray-900 rounded p-4 mb-8 shadow-xl">
          {movie.description}
        </div>
        <button
          className="mt-2 px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          onClick={() => router.back()}
        >
          ← Back to Movies
        </button>
      </div>
    </div>
  );
} 