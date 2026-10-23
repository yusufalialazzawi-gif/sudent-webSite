import React, { useState } from 'react';
import { Play, VideoOff, Maximize2, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function UniversityVideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  description,
  fallbackImage,
  className = '',
  aspectRatio = 'aspect-video',
}) {
  const { currentLang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!videoUrl || hasError) {
    if (fallbackImage) {
      return (
        <div className={`relative rounded-2xl overflow-hidden bg-slate-900 ${aspectRatio} ${className}`}>
          <img
            src={fallbackImage}
            alt={title || 'University Campus'}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-amber-400 block mb-1">
                {currentLang === 'ar' ? 'جولة الحرم الجامعي' : currentLang === 'tr' ? 'Kampüs Turu' : 'Campus Tour'}
              </span>
              <h4 className="text-white font-bold text-sm sm:text-base font-cairo">
                {title || (currentLang === 'ar' ? 'فيديو تعريفي بالحرم الجامعي والمرافق' : 'University Overview & Facilities')}
              </h4>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  // Parse YouTube or Vimeo or Direct Video
  const getEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const cleanUrl = url.trim();

    // YouTube (watch, embed, short link, shorts)
    const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return {
        type: 'youtube',
        videoId: ytMatch[1],
        embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
        defaultThumb: `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`,
      };
    }

    // Vimeo
    const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        type: 'vimeo',
        videoId: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
        defaultThumb: thumbnailUrl,
      };
    }

    // Direct MP4 / WebM / MOV / OGG / Uploads
    if (
      cleanUrl.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i) ||
      cleanUrl.includes('/uploads/') ||
      cleanUrl.startsWith('blob:')
    ) {
      return {
        type: 'direct',
        embedUrl: cleanUrl,
        defaultThumb: thumbnailUrl || fallbackImage,
      };
    }

    // Fallback: try as iframe embed
    return {
      type: 'iframe',
      embedUrl: cleanUrl,
      defaultThumb: thumbnailUrl || fallbackImage,
    };
  };

  const parsed = getEmbedUrl(videoUrl);
  const poster = thumbnailUrl || parsed?.defaultThumb || fallbackImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group ${className}`}>
      {isPlaying && parsed ? (
        <div className={`w-full ${aspectRatio} relative bg-black`}>
          {parsed.type === 'direct' ? (
            <video
              src={parsed.embedUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              onError={() => setHasError(true)}
            />
          ) : (
            <iframe
              src={parsed.embedUrl}
              title={title || 'University Video'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => setHasError(true)}
            ></iframe>
          )}
        </div>
      ) : (
        <div className={`relative w-full ${aspectRatio} overflow-hidden`}>
          <img
            src={poster}
            alt={title || 'Video Thumbnail'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              if (parsed?.videoId && parsed.type === 'youtube') {
                e.target.src = `https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Central Play Button */}
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-amber-500 hover:bg-brand-amber-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-brand-amber-500/50 hover:scale-110 transition-all duration-300 group/btn"
            aria-label="Play Introduction Video"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950 ms-1 group-hover/btn:scale-110 transition-transform" />
          </button>

          {/* Video Metadata Overlay */}
          <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white flex items-end justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-amber-500/20 text-brand-amber-400 border border-brand-amber-400/30">
                {currentLang === 'ar' ? 'فيديو تعريفي رسمي' : currentLang === 'tr' ? 'Resmi Tanıtım Filmi' : 'Official Introduction Video'}
              </span>
              <h3 className="text-base sm:text-xl font-black font-cairo leading-snug drop-shadow-md">
                {title || (currentLang === 'ar' ? 'جولة مصورة في الحرم الجامعي والمرافق والمختبرات' : 'Campus, Laboratories & Academic Facilities Tour')}
              </h3>
              {description && (
                <p className="text-xs text-slate-300 line-clamp-2 drop-shadow">
                  {description}
                </p>
              )}
            </div>

            {videoUrl.startsWith('http') && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 transition-colors shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{currentLang === 'ar' ? 'فتح بالمصدر' : 'Source'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
