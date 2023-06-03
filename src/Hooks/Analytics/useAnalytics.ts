import analytics from '@react-native-firebase/analytics';
import {createNavigationContainerRef} from '@react-navigation/native';
import {useCallback, useRef} from 'react';

export const useAnalytics = () => {
  const navigationRef = createNavigationContainerRef();

  const routeNameRef = useRef<string>();

  const getInitialRouteName = useCallback(() => {
    routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
  }, [navigationRef]);

  const logScreenName = useCallback(async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
    if (
      currentRouteName &&
      previousRouteName !== currentRouteName &&
      currentRouteName !== 'Main'
    ) {
      await analytics().logScreenView({
        screen_class: currentRouteName,
        screen_name: currentRouteName,
      });
    }

    routeNameRef.current = currentRouteName;
  }, [navigationRef]);

  const logScreenNameWithoutNavigation = useCallback(
    async (screenName: string) => {
      await analytics().logScreenView({
        screen_class: screenName,
        screen_name: screenName,
      });
    },
    [],
  );

  return {
    navigationRef,
    getInitialRouteName,
    logScreenName,
    logScreenNameWithoutNavigation,
  };
};
