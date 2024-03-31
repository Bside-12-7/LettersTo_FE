import React, {useCallback, useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {useQueryClient} from 'react-query';
import {getUserInfo} from '@apis/member';
import {BottomTab} from '@components/BottomTab/BottomTab';
import {LetterBoxList} from '../LetterBox/LetterBoxList';
import {Home} from './HomeScreen';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {useAnalytics} from '@hooks/Analytics/useAnalytics';
import {useFocusEffect} from '@react-navigation/native';
import {registerPushNotificationToken} from '@apis/push';
import messaging from '@react-native-firebase/messaging';
import deviceInfo from 'react-native-device-info';

type Props = NativeStackScreenProps<StackParamsList, 'Main'>;

export const Main = ({navigation}: Props) => {
  const [selectedScreen, setSelectedScreen] = useState<'Home' | 'LetterBox'>(
    'Home',
  );

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

  const goToHome = useCallback(() => {
    setSelectedScreen('Home');
  }, []);

  const goToLetterBox = useCallback(() => {
    setSelectedScreen('LetterBox');
  }, []);

  const queryClient = useQueryClient();

  const {logScreenNameWithoutNavigation} = useAnalytics();

  useEffect(() => {
    const fetchUserInfo = async () => {
      await queryClient.prefetchQuery('userInfo', getUserInfo);
    };

    fetchUserInfo();
  }, [queryClient]);

  // MainScreen은 Firebase Analytics의 Screen 항목에 [Home/LetterBox]를 따로 기록함
  useFocusEffect(
    useCallback(() => {
      logScreenNameWithoutNavigation(selectedScreen);
    }, [logScreenNameWithoutNavigation, selectedScreen]),
  );

  useEffect(() => {
    registerPushToken();
  });

  return (
    <View style={{flex: 1}}>
      {selectedScreen === 'Home' && <Home navigation={navigation} />}
      {selectedScreen === 'LetterBox' && (
        <LetterBoxList navigation={navigation} onPressHome={goToHome} />
      )}
      <BottomTab
        currentScreen={selectedScreen}
        onPressHome={goToHome}
        onPressLetterBox={goToLetterBox}
      />
    </View>
  );
};
