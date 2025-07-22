"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { StreamplayNavbar } from "@/components/netflix-navbar";

export default function SeriesPlayerPage() {
  const router = useRouter();
  const { identifier } = useParams();
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!identifier) return;
    fetch(`https://archive.org/metadata/${identifier}`)
      .then((res) => res.json())
      .then((data) => {
        // Find the first mp4 file
        const file = data.files?.find((f: any) => f.name.endsWith(".mp4"));
        setShow({
          title: data.metadata?.title || identifier,
          description: data.metadata?.description || "No description available.",
          thumbnail: data.metadata?.thumb || data.metadata?.cover || "/placeholder.jpg",
          videoUrl: file ? `https://archive.org/download/${identifier}/${file.name}` : null,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [identifier]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">Loading...</div>;
  }

  if (!show || !show.videoUrl) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">Video not found.</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <StreamplayNavbar />
      <div className="pt-20 px-4 flex flex-col items-center">
        <h1 className="text-white text-3xl font-bold mb-4 text-center">{show.title}</h1>
        <video
          src={show.videoUrl}
          poster={show.thumbnail}
          controls
          className="w-full max-w-3xl aspect-video rounded shadow mb-6"
        />
        <div className="max-w-3xl text-gray-300 text-lg bg-gray-900 rounded p-4">
          {show.description}
        </div>
        <button
          className="mt-8 px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          onClick={() => router.back()}
        >
          ← Back to Series
        </button>
      </div>
    </div>
  );
} 