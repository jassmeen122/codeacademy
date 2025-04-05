
export const useVideoProgress = () => {
  return {
    trackVideoProgress: async (
      courseId: string, 
      language: string, 
      progress: number, 
      completed: boolean
    ) => {
      console.log('Video progress stub called', { courseId, language, progress, completed });
      return true;
    },
    updating: false
  };
};
