import create from 'zustand';

interface FeedbackStore {
  isFeedbackButtonShown: {
    Home: boolean;
    LetterBox: boolean;
  };

  action: {
    clearFeedbackButtonOnHome: () => void;
    clearFeedbackButtonOnLetterBox: () => void;
  };
}

export const useFeedbackStore = create<FeedbackStore>(set => ({
  isFeedbackButtonShown: {
    Home: false,
    LetterBox: false,
  },

  action: {
    clearFeedbackButtonOnHome: () =>
      set(state => ({
        isFeedbackButtonShown: {...state.isFeedbackButtonShown, Home: true},
      })),

    clearFeedbackButtonOnLetterBox: () =>
      set(state => ({
        isFeedbackButtonShown: {
          ...state.isFeedbackButtonShown,
          LetterBox: true,
        },
      })),
  },
}));

export const useFeedbackAction = () => useFeedbackStore(state => state.action);
