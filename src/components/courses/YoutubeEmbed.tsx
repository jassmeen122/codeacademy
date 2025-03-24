
import React from 'react';

interface YoutubeEmbedProps {
  videoId: string;
  title?: string;
}

export const YoutubeEmbed = ({ videoId, title = 'YouTube video player' }: YoutubeEmbedProps) => {
  if (!videoId) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-md">
        <p className="text-gray-500">Vidéo non disponible</p>
      </div>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-lg shadow-sm">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
