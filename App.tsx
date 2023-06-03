// In App.js in a new project

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from '~/Navigator';
import SplashScreen from 'react-native-splash-screen';
import {RootSiblingParent} from 'react-native-root-siblings';
import {QueryClientProvider, QueryClient} from 'react-query';
import Toast from '@components/Toast/toast';
import {useAnalytics} from '@hooks/Analytics/useAnalytics';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      staleTime: 10000,
      onError: (error: any) => {
        console.error('Query Error: ', error.message);
        Toast.show('문제가 발생했습니다');
      },
    },
    mutations: {
      onError: (error: any) => {
        console.error('Query Error: ', error.response.data.message);
        Toast.show(error.response.data.message);
      },
    },
  },
});

export default function App() {
  const {navigationRef, logScreenName, getInitialRouteName} = useAnalytics();

  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 1000);
  }, []);

  return (
    <RootSiblingParent>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          ref={navigationRef}
          onReady={getInitialRouteName}
          onStateChange={logScreenName}>
          <StackNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </RootSiblingParent>
  );
}
