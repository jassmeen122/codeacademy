
export const getYoutubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  const videoId = url.split('v=')[1]?.split('&')[0];
  return `https://www.youtube.com/embed/${videoId}`;
};

export const openYoutubeVideo = (url: string) => {
  window.open(url, '_blank');
};

// Map of programming languages to their YouTube video URLs
export const languageVideoMap: Record<string, { courseVideo: string, exercisesVideo: string, advancedVideo?: string }> = {
  python: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=rfscVS0vtbw"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=HBxCHonY-Fg"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=HGOBQPFzWKo")
  },
  java: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=GoXwIVyQqaY"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=9J-hez_rt2s"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=Hl-zzrqQoSE")
  },
  javascript: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=W6NZfCO5SIk"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=w-7RQ46RgxU"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=R9I85RhI7Cg")
  },
  c: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=KJgsSFOSQv0"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=K5vGQzWBgRQ"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=eST0LgzBPL4")
  },
  php: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=vqqt5_jnh2o"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=U2lQWR6uIuo")
  },
  sql: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=HXV3zeQKqGY"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=aaVqBwamWjQ"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=ztHopE5Wnpc")
  },
  cpp: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=vLnPwxZdW4Y"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=8jLOx1hD3_o"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=euvSzRjvbpQ")
  },
};
