
export const useQuizProgress = () => {
  return {
    trackQuizCompletion: async (
      languageId: string,
      language: string, 
      passed: boolean, 
      score: number
    ) => {
      console.log('Quiz progress stub called', { languageId, language, passed, score });
      return true;
    },
    updating: false
  };
};
