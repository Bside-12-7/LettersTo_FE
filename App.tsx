// In App.js in a new project

import React, {useCallback, useEffect, useRef} from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import StackNavigator from '~/Navigator';
import SplashScreen from 'react-native-splash-screen';
import {RootSiblingParent} from 'react-native-root-siblings';
import {QueryClientProvider, QueryClient} from 'react-query';
import Toast from '@components/Toast/toast';
import analytics from '@react-native-firebase/analytics';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      staleTime: 10000,
      onError: (error: any) => {
        console.error(error.message);
        Toast.show('문제가 발생했습니다');
      },
    },
    mutations: {
      onError: (error: any) => {
        Toast.show(error.response.data.message);
      },
    },
  },
});

export default function App() {
  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 1000);
  }, []);

  const routeNameRef = useRef<string>();
  const navigationRef = createNavigationContainerRef();

  // Firebase Analytics
  const analyzeScreenView = useCallback(async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName) {
      await analytics().logScreenView({
        screen_name: currentRouteName,
      });
    }

    routeNameRef.current = currentRouteName;
  }, [navigationRef]);

  const getInitialRouteName = useCallback(() => {
    routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
  }, [navigationRef]);

  return (
    <RootSiblingParent>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          ref={navigationRef}
          onReady={getInitialRouteName}
          onStateChange={analyzeScreenView}>
          <StackNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </RootSiblingParent>
  );
}
