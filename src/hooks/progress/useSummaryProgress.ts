
export const useSummaryProgress = () => {
  return {
    trackSummaryRead: async (
      languageId: string,
      title: string
    ) => {
      console.log('Summary progress stub called', { languageId, title });
      return true;
    },
    updating: false
  };
};
