import React from "react";

interface Platform {
  name: string;
  logoUrl: string;
  href?: string; // Optional: link to platform page or filter
}

interface PlatformRowProps {
  platforms: Platform[];
}

export const PlatformRow: React.FC<PlatformRowProps> = ({ platforms }) => (
  <div className="w-full max-w-6xl mx-auto mt-8">
    <h2 className="text-2xl font-semibold text-white mb-4 px-2">Browse By Apps</h2>
    <div className="flex overflow-x-auto gap-4 pb-2 px-2 scrollbar-hide">
      {platforms.map((platform) => (
        <button
          key={platform.name}
          className="flex-shrink-0 w-20 h-20 bg-black rounded-xl shadow-lg flex items-center justify-center border border-white/10 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-pink-500"
          onClick={() => {
            if (platform.href) {
              window.location.href = platform.href;
            } else {
              console.log(`Clicked on ${platform.name}`);
            }
          }}
          title={platform.name}
        >
          <img
            src={platform.logoUrl}
            alt={platform.name}
            className="w-16 h-16 object-contain rounded-lg"
          />
        </button>
      ))}
    </div>
  </div>
); 