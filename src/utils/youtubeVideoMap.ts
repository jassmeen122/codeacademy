
export const getYoutubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  const videoId = url.split('v=')[1]?.split('&')[0];
  return `https://www.youtube.com/embed/${videoId}`;
};

export const openYoutubeVideo = (url: string) => {
  window.open(url, '_blank');
};

// Map of programming languages to their YouTube video URLs
export const languageVideoMap: Record<string, { courseVideo: string, exercisesVideo: string, advancedVideo: string }> = {
  python: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=rfscVS0vtbw"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=HBxCHonY-Fg"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=HGOBQPFzWKo")
  },
  java: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=GoXwIVyQqaY"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=9J-hez_rt2s"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=grEKMHGYyns")
  },
  javascript: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=W6NZfCO5SIk"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=w-7RQ46RgxU"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=R8rmfD9Y5-c")
  },
  c: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=KJgsSFOSQv0"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=K5vGQzWBgRQ"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=1uR4tL-OSNI")
  },
  php: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=OK_JCtrrv-c"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=vqqt5_jnh2o"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=sVbEyFZKgqk")
  },
  sql: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=HXV3zeQKqGY"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=aaVqBwamWjQ"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=1dWCqjhvF58")
  },
  cpp: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=vLnPwxZdW4Y"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=8jLOx1hD3_o"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=18c3MTX0PK0")
  },
  typescript: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=BwuLxPH8IDs"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=gp5H0Vw39yw"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=F2JCjVSZlG0")
  },
  rust: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=BpPEoZW5IiY"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=usJDUSrcwqI"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=BHxmWTVFWxQ")
  },
  golang: {
    courseVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=YS4e4q9oBaU"),
    exercisesVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=yyUHQIec83I"),
    advancedVideo: getYoutubeEmbedUrl("https://www.youtube.com/watch?v=0ReKdcpNyQg")
  }
};

// Developer-focused YouTube channels
export const devChannels = [
  {
    name: "Fireship",
    url: "https://www.youtube.com/c/Fireship",
    description: "Quick, practical web development tutorials and tech news"
  },
  {
    name: "Traversy Media",
    url: "https://www.youtube.com/c/TraversyMedia",
    description: "Web development tutorials on various frameworks and languages"
  },
  {
    name: "The Net Ninja",
    url: "https://www.youtube.com/c/TheNetNinja",
    description: "Complete tutorial series for web developers"
  },
  {
    name: "Web Dev Simplified",
    url: "https://www.youtube.com/c/WebDevSimplified",
    description: "Learn web development concepts quickly and easily"
  },
  {
    name: "freeCodeCamp",
    url: "https://www.youtube.com/c/Freecodecamp",
    description: "Full courses on programming and computer science"
  },
  {
    name: "Programming with Mosh",
    url: "https://www.youtube.com/c/programmingwithmosh",
    description: "Comprehensive programming courses"
  },
  {
    name: "Academind",
    url: "https://www.youtube.com/c/Academind",
    description: "In-depth courses on web technologies"
  },
  {
    name: "Coding Tech",
    url: "https://www.youtube.com/c/CodingTech",
    description: "Conference talks and tech presentations"
  }
];

// Technical topics for developers
export const devTopics = [
  {
    name: "System Design",
    url: "https://www.youtube.com/watch?v=xpDnVSmNFX0",
    description: "Learn how to design scalable systems"
  },
  {
    name: "Data Structures and Algorithms",
    url: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
    description: "Comprehensive DSA course"
  },
  {
    name: "DevOps",
    url: "https://www.youtube.com/watch?v=j5Zsa_eOXeY",
    description: "Introduction to DevOps practices"
  },
  {
    name: "Cloud Computing",
    url: "https://www.youtube.com/watch?v=kQnNd-DyrpA",
    description: "Understanding cloud technologies"
  },
  {
    name: "Design Patterns",
    url: "https://www.youtube.com/watch?v=v9ejT8FO-7I",
    description: "Software design patterns explained"
  },
  {
    name: "Microservices",
    url: "https://www.youtube.com/watch?v=y8IQb4ofjDo",
    description: "Building microservice architectures"
  }
];

