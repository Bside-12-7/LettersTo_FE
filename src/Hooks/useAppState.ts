import {useRef} from 'react';
import {AppState, type AppStateStatus} from 'react-native';

const APP_STATE = {
  ACTIVE: 'active',
  BACKGROUND: 'background',
  INACTIVE: 'inactive',
  UNKNOWN: 'unknown',
  EXTENSION: 'extension',
} as const;

export type AppStateListenerType = {
  onChangeToForeground?: () => void;
  onChangeToBackground?: () => void;
  isSettingsChanged?: boolean;
};

export const useAppState = () => {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const checkIsForeground = (currentAppState: AppStateStatus) => {
    return currentAppState === APP_STATE.ACTIVE;
  };

  const checkIsBackground = (currentAppState: AppStateStatus) => {
    return (
      currentAppState === APP_STATE.INACTIVE ||
      currentAppState === APP_STATE.BACKGROUND
    );
  };

  const appStateListener = ({
    onChangeToForeground,
    onChangeToBackground,
    isSettingsChanged = true,
  }: AppStateListenerType) => {
    return AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        const isChangedToForeground =
          isSettingsChanged &&
          checkIsBackground(appState.current) &&
          checkIsForeground(nextAppState);

        const isChangedToBackground =
          isSettingsChanged &&
          checkIsForeground(appState.current) &&
          checkIsBackground(nextAppState);

        if (isChangedToForeground) {
          onChangeToForeground?.();
        }

        if (isChangedToBackground) {
          onChangeToBackground?.();
        }

        appState.current = nextAppState;
      },
    );
  };

  return {appStateListener};
};
