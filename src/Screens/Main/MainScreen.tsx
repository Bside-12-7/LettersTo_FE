import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {useQueryClient} from 'react-query';
import {getUserInfo} from '@apis/member';
import {BottomTab} from '@components/BottomTab/BottomTab';
import {LetterBoxList} from '../LetterBox/LetterBoxList';
import {Home} from './HomeScreen';
import messaging from '@react-native-firebase/messaging';
import deviceInfo from 'react-native-device-info';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {registerPushNotificationToken} from '@apis/push';

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
      const token = await messaging().getAPNSToken();
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      await queryClient.prefetchQuery('userInfo', getUserInfo);
    };

    fetchUserInfo();
  }, [queryClient]);

  useEffect(() => {
    registerPushToken();
  }, []);

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
