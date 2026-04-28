import React, {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useQueryClient} from 'react-query';
import {getUserInfo} from '@apis/member';
import {BottomTab} from '@components/BottomTab/BottomTab';
import {LetterBoxList} from '../LetterBox/LetterBoxList';
import {Home} from './HomeScreen';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList, BottomTabParamList} from '@type/stackParamList';
import {useAnalytics} from '@hooks/Analytics/useAnalytics';
import {useFocusEffect} from '@react-navigation/native';
import {registerPushNotificationToken} from '@apis/push';
import messaging from '@react-native-firebase/messaging';
import deviceInfo from 'react-native-device-info';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

type Props = NativeStackScreenProps<StackParamsList, 'Main'>;

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const Main = ({navigation}: Props) => {
  const queryClient = useQueryClient();
  const {logScreenNameWithoutNavigation} = useAnalytics();

  // Analytics를 위한 현재 탭 추적
  const [currentTab, setCurrentTab] = useState<'Home' | 'LetterBox'>('Home');

  async function requestPushNotificationPermission() {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }

  async function registerPushToken() {
    const pushNotificationPermissionResult =
      await requestPushNotificationPermission();
    if (pushNotificationPermissionResult === true) {
      const token =
        Platform.OS === 'ios'
          ? await messaging().getAPNSToken()
          : await messaging().getToken();
      const deviceId = await deviceInfo.getUniqueId();
      if (token && deviceId) {
        const result = await registerPushNotificationToken({
          type: 'APNS',
          token,
          deviceId,
        });
        console.log(result);
      }
    }
  }

  // 푸시 알림 등록 (기존 로직 유지)
  useEffect(() => {
    registerPushToken();
  }, []);

  // 사용자 정보 prefetch (기존 로직 유지)
  useEffect(() => {
    const fetchUserInfo = async () => {
      await queryClient.prefetchQuery('userInfo', getUserInfo);
    };
    fetchUserInfo();
  }, [queryClient]);

  // Firebase Analytics (기존 로직 유지)
  // MainScreen은 Firebase Analytics의 Screen 항목에 [Home/LetterBox]를 따로 기록함
  useFocusEffect(
    useCallback(() => {
      logScreenNameWithoutNavigation(currentTab);
    }, [logScreenNameWithoutNavigation, currentTab]),
  );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <BottomTab {...props} onTabChange={(screen) => setCurrentTab(screen)} />
      )}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="LetterBox" component={LetterBoxList} />
    </Tab.Navigator>
  );
};
