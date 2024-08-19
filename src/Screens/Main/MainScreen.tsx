import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {ModalHeader} from '@components/Headers/ModalHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ModalBlur} from '@components/Modals/ModalBlur';

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

  // 친구에게 편지쓰기 프로모션
  const {bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();
  const [isModalVisible, setModalVisible] = useState(true);

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

      {/* 친구에게 편지쓰기 프로모션 */}
      {isModalVisible && <ModalBlur />}
      <Modal
        statusBarTranslucent={true} // android
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        visible={isModalVisible}>
        <View style={styles.container}>
          <View style={[styles.modalView, {paddingBottom: SAFE_AREA_BOTTOM}]}>
            <ModalHeader
              title={''}
              onPressClose={() => setModalVisible(false)}
            />
            <View
              style={{
                paddingTop: 12,
                paddingBottom: 16,
                paddingHorizontal: 16,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Galmuri11',
                  fontSize: 18,
                  lineHeight: 23,
                  color: '#0000CC',
                  marginBottom: 8,
                }}>
                {'이제 내 친구와 편지를\n주고받을 수 있어요!'}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Galmuri11',
                  fontSize: 13,
                  fontWeight: '400',
                  lineHeight: 19.5,
                  color: '#0000CC',
                  marginBottom: 16,
                }}>
                {'메뉴 > 주소록 관리에서 친구를 추가해보세요!'}
              </Text>
              <View
                style={{
                  width: '100%',
                  aspectRatio: 343 / 254,
                }}>
                <Image
                  source={require('@assets/Image/friend/friend_promotion.png')}
                  style={{
                    flex: 1,
                    aspectRatio: 343 / 254,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row', paddingHorizontal: 16}}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flex: 120,
                  marginRight: 12,
                  height: 52,
                  borderColor: '#0000CC',
                  borderRadius: 12,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => setModalVisible(false)}>
                <Text
                  style={{
                    fontFamily: 'Galmuri11',
                    fontSize: 14,
                    lineHeight: 23,
                    color: '#0000CC',
                  }}>
                  안 할께요
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flex: 209,
                  height: 52,
                  backgroundColor: '#0000CC',
                  borderRadius: 12,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('AddressManage');
                }}>
                <Text
                  style={{
                    fontFamily: 'Galmuri11',
                    fontSize: 14,
                    lineHeight: 23,
                    color: '#ffffff',
                  }}>
                  친구에게 편지 써보기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
