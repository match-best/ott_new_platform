import { notFound } from "next/navigation";

interface ArchiveWatchPageProps {
  params: { identifier: string };
}

export default async function ArchiveWatchPage({ params }: ArchiveWatchPageProps) {
  const { identifier } = params;
  if (!identifier) return notFound();

  // Fetch metadata from Internet Archive API
  const res = await fetch(
    `https://archive.org/metadata/${identifier}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return notFound();
  const data = await res.json();

  const title = data.metadata?.title || identifier;
  const description = data.metadata?.description || "";
  const thumbnail = `https://archive.org/services/img/${identifier}`;
  // Try to find an mp4 file
  const mp4File = data.files?.find((f: any) => f.name.endsWith(".mp4"));
  const videoUrl = mp4File
    ? `https://archive.org/download/${identifier}/${mp4File.name}`
    : `https://archive.org/download/${identifier}/${identifier}.mp4`;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">{title}</h1>
      {description && <p className="text-gray-300 mb-4 max-w-2xl text-center">{description}</p>}
      <video
        src={videoUrl}
        poster={thumbnail}
        controls
        autoPlay
        className="w-full max-w-3xl aspect-video rounded shadow"
      />
    </div>
  );
} 