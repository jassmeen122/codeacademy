
// Maps language IDs to YouTube video URLs
export const languageVideoMap: Record<string, { courseVideo: string; exercisesVideo: string }> = {
  python: {
    courseVideo: 'https://www.youtube.com/embed/rfscVS0vtbw',
    exercisesVideo: 'https://www.youtube.com/embed/t8pPdKYpowI'
  },
  java: {
    courseVideo: 'https://www.youtube.com/embed/eIrMbAQSU34',
    exercisesVideo: 'https://www.youtube.com/embed/grEKMHGYyns'
  },
  javascript: {
    courseVideo: 'https://www.youtube.com/embed/W6NZfCO5SIk',
    exercisesVideo: 'https://www.youtube.com/embed/hdI2bqOjy3c'
  },
  c: {
    courseVideo: 'https://www.youtube.com/embed/KJgsSFOSQv0',
    exercisesVideo: 'https://www.youtube.com/embed/qz2Sj2V4Xew'
  },
  cpp: {
    courseVideo: 'https://www.youtube.com/embed/vLnPwxZdW4Y',
    exercisesVideo: 'https://www.youtube.com/embed/GQp1zzTwrIg'
  },
  php: {
    courseVideo: 'https://www.youtube.com/embed/OK_JCtrrv-c',
    exercisesVideo: 'https://www.youtube.com/embed/2eebptXfEvw'
  },
  sql: {
    courseVideo: 'https://www.youtube.com/embed/HXV3zeQKqGY',
    exercisesVideo: 'https://www.youtube.com/embed/5cU5xSZXFo8'
  }
};

// Returns the YouTube embed URL for a language
export const getYoutubeEmbedUrl = (languageId: string | undefined): string => {
  if (!languageId) return '';
  
  const videoInfo = languageVideoMap[languageId];
  return videoInfo?.courseVideo || '';
};

// Opens a YouTube video in a new tab
export const openYoutubeVideo = (url: string): void => {
  if (!url) return;
  
  const youtubeUrl = url.replace('embed/', 'watch?v=');
  window.open(youtubeUrl, '_blank');
};
