"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StreamplayNavbar } from "@/components/netflix-navbar";

export default function SupportPage() {
  const { slug } = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetch(`/api/support-pages?slug=${slug}`)
        .then((res) => res.json())
        .then((data) => {
          setPage(data);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl animate-pulse mx-auto mb-6 flex items-center justify-center shadow-2xl"></div>
          <div className="text-white text-2xl font-bold mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  if (!page || page.error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Page not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      <StreamplayNavbar />
      <div className="pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 py-10 bg-gradient-to-b from-slate-900/80 to-black/80 rounded-2xl shadow-xl border border-slate-800 section-fade">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-6">{page.title}</h1>
          <div className="prose prose-invert text-gray-200 max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
          <div className="mt-8 text-right text-xs text-gray-500">Last updated: {new Date(page.updatedAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
} 