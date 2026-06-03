import React, {useCallback, useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQueryClient} from 'react-query';
import {getUserInfo} from '@apis/member';
import {BottomTab} from '@components/BottomTab/BottomTab';
import {RealtimeChatPromoModal} from '@components/Modals/RealtimeChatPromoModal';
import {LetterBoxList} from '../LetterBox/LetterBoxList';
import {Home} from './HomeScreen';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {useAnalytics} from '@hooks/Analytics/useAnalytics';
import {useFocusEffect} from '@react-navigation/native';
import {registerPushNotificationToken} from '@apis/push';
import messaging from '@react-native-firebase/messaging';
import deviceInfo from 'react-native-device-info';
import {SCREEN_NAMES} from '@constants/navigation';

const REALTIME_CHAT_PROMO_KEY = 'realtimeChatPromoSeen';

type Props = NativeStackScreenProps<StackParamsList, 'Main'>;

export const Main = ({navigation}: Props) => {
  const [selectedScreen, setSelectedScreen] = useState<'Home' | 'LetterBox'>(
    'Home',
  );
  const [promoVisible, setPromoVisible] = useState(false);

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

  const goToRealtimeChat = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.MAIN.REALTIME_CHAT);
  }, [navigation]);

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

  // 실시간 통신 안내 팝업 — 사용자당 1회 노출
  useEffect(() => {
    (async () => {
      try {
        const seen = await AsyncStorage.getItem(REALTIME_CHAT_PROMO_KEY);
        if (seen !== 'true') {
          setPromoVisible(true);
        }
      } catch (e) {
        console.error('promo seen 조회 실패:', e);
      }
    })();
  }, []);

  const dismissPromo = useCallback(async () => {
    setPromoVisible(false);
    try {
      await AsyncStorage.setItem(REALTIME_CHAT_PROMO_KEY, 'true');
    } catch (e) {
      console.error('promo seen 저장 실패:', e);
    }
  }, []);

  const onPressGoRealtimeChat = useCallback(() => {
    dismissPromo();
    navigation.navigate(SCREEN_NAMES.MAIN.REALTIME_CHAT);
  }, [dismissPromo, navigation]);

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
        onPressRealtimeChat={goToRealtimeChat}
      />
      <RealtimeChatPromoModal
        visible={promoVisible}
        onClose={dismissPromo}
        onPressGo={onPressGoRealtimeChat}
      />
    </View>
  );
};
