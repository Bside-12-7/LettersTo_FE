// In App.js in a new project

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from '~/Navigator';
import SplashScreen from 'react-native-splash-screen';
import {RootSiblingParent} from 'react-native-root-siblings';
import {QueryClientProvider, QueryClient} from 'react-query';
import Toast from '@components/Toast/toast';
import {useAnalytics} from '@hooks/Analytics/useAnalytics';
import {Linking} from 'react-native';
import PushNotification from 'react-native-push-notification';

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

  const linking = {
    prefixes: ['letterstoapp://'],

    // Custom function to get the URL which was used to open the app
    async getInitialURL() {
      // check for notification deep linking
      PushNotification.popInitialNotification(async notification => {
        // <---- 1
        if (!notification) {
          return;
        }

        const {link = null} = notification?.data || {}; // <---- 1
        if (link) {
          Linking.openURL(link);
        } else {
          Linking.openURL('letterstoapp://notifications');
        }
      });
      // As a fallback, you may want to do the default deep link handling
      return await Linking.getInitialURL();
    },

    // Custom function to subscribe to incoming links
    subscribe(listener: any) {
      // Listen to incoming links from deep linking
      const linkingSubscription = Linking.addEventListener('url', ({url}) => {
        listener(url);
      });

      return () => {
        linkingSubscription.remove();
      };
    },

    config: {
      screens: {
        Notifications: {
          path: 'notifications',
        },
        LetterBoxDetail: {
          path: 'letterbox/:id/:fromMemberId',
        },
      },
    },
  };

  return (
    <RootSiblingParent>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          linking={linking}
          ref={navigationRef}
          onReady={getInitialRouteName}
          onStateChange={logScreenName}>
          <StackNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </RootSiblingParent>
  );
}
