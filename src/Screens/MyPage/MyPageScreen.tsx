import React, {useCallback, useEffect, useMemo, useReducer} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  Text,
  Pressable,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {getUserInfo} from '@apis/member';
import {useAuthAction} from '@stores/auth';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@constants/screen';
import {onPressPrivacyPolicy, onPressTermsOfService} from '@utils/hyperlink';

import {ListItem, ListName} from '@components/MyPage/MyPageList';
import {Header2} from '@components/Headers/Header2';
import {BottomButton} from '@components/Button/Bottom/BottomButton';
import {Profile} from '@components/MyPage/ProfileView';
import {EditNicknameButton} from '@components/MyPage/EditNicknameButton';
import {StampBox} from '@components/MyPage/StampBox';
import {EditUserInfoButton} from '@components/MyPage/EditUserInfoButton';

import {NicknameModal} from '@components/Modals/MyPage/NicknameModal';
import {TopicsModal} from '@components/Modals/MyPage/TopicsModal';
import {PersonalitiesModal} from '@components/Modals/MyPage/PersonalitiesModal';
import {ModalBlur} from '@components/Modals/ModalBlur';
import {LogoutModal} from '@components/Modals/MyPage/LogoutModal';

import type {StackParamsList} from '@type/stackParamList';
import {FeedbackButton} from '@components/Feedback/FeedbackButton';
import {CLICK_BUTTON_EVENT_PARAMS} from '@constants/analytics';
import {
  NotificationListItem,
  NotificationListName,
} from '@components/MyPage/NotificationSettingList';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import {useAppState} from '@hooks/useAppState';
import Toast from '@components/Toast/toast';
import {dateFormatter} from '@utils/dateFormatter';
import {
  getMemberTermsConsent,
  getTerms,
  recordMarketingAgreement,
  RecordMarketingAgreementRequest,
} from '@apis/terms';
import {
  getNotificationPreference,
  NotificationPreferenceRequest,
  setNotificationPreference,
} from '@apis/notification';

type Props = NativeStackScreenProps<StackParamsList, 'MyPage'>;

type ModalName = 'NICKNAME' | 'TOPIC' | 'PERSONALITY' | 'LOGOUT';

const MODAL_NAME: {[key in ModalName]: key} = {
  NICKNAME: 'NICKNAME',
  TOPIC: 'TOPIC',
  PERSONALITY: 'PERSONALITY',
  LOGOUT: 'LOGOUT',
};

type ModalState = {
  [key in ModalName]: boolean;
};

const INITIAL_MODAL_STATE: ModalState = {
  NICKNAME: false,
  TOPIC: false,
  PERSONALITY: false,
  LOGOUT: false,
};

const MODAL_ACTION = {
  TOGGLE_NICKNAME_MODAL: 'TOGGLE_NICKNAME_MODAL',
  TOGGLE_TOPIC_MODAL: 'TOGGLE_TOPIC_MODAL',
  TOGGLE_PERSONALITY_MODAL: 'TOGGLE_PERSONALITY_MODAL',
  TOGGLE_LOGOUT_MODAL: 'TOGGLE_LOGOUT_MODAL',
} as const;

const modalReducer = (
  state: ModalState,
  action: {type: keyof typeof MODAL_ACTION},
) => {
  switch (action.type) {
    case MODAL_ACTION.TOGGLE_NICKNAME_MODAL:
      return {...state, NICKNAME: !state.NICKNAME};
    case MODAL_ACTION.TOGGLE_TOPIC_MODAL:
      return {...state, TOPIC: !state.TOPIC};
    case MODAL_ACTION.TOGGLE_PERSONALITY_MODAL:
      return {...state, PERSONALITY: !state.PERSONALITY};
    case MODAL_ACTION.TOGGLE_LOGOUT_MODAL:
      return {...state, LOGOUT: !state.LOGOUT};
  }
};

export const MyPage = ({navigation}: Props) => {
  const [isModalVisible, dispatch] = useReducer(
    modalReducer,
    INITIAL_MODAL_STATE,
  );

  const queryClient = useQueryClient();
  const {data: termsData} = useQuery('terms', getTerms);

  const isAnyModalVisible = useMemo(
    () =>
      isModalVisible.NICKNAME ||
      isModalVisible.TOPIC ||
      isModalVisible.PERSONALITY,
    [isModalVisible],
  );

  const {logout} = useAuthAction();

  const {top: SAFE_AREA_TOP, bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  const onPressLogout = useCallback(() => {
    AsyncStorage.removeItem('accessToken');
    AsyncStorage.removeItem('refreshToken');
    queryClient.clear();
    logout();
  }, [logout, queryClient]);

  const toggleModal = (modalName: ModalName) => () =>
    dispatch({type: `TOGGLE_${modalName}_MODAL`});

  const goBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const goToStampHistory = useCallback(() => {
    navigation.navigate('StampHistory');
  }, [navigation]);

  const goToAccountDelete = useCallback(() => {
    navigation.navigate('AccountDelete');
  }, [navigation]);

  const goToAddressManage = useCallback(() => {
    navigation.navigate('AddressManage');
  }, [navigation]);

  const {data: userInfo, isSuccess} = useQuery('userInfo', getUserInfo);
  const {data: notificationPreference} = useQuery(
    'notification-preference',
    getNotificationPreference,
  );

  const [isDeviceNotificationEnabled, setIsDeviceNotificationEnabled] =
    React.useState(false);

  const {appStateListener} = useAppState();

  const {mutate} = useMutation({
    mutationFn: setNotificationPreference,
  });

  useEffect(() => {
    async function getNotificationEnabled() {
      const settings = await notifee.getNotificationSettings();
      setIsDeviceNotificationEnabled(
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
          settings.authorizationStatus === AuthorizationStatus.PROVISIONAL,
      );
    }

    getNotificationEnabled();

    const subscription = appStateListener({
      onChangeToForeground: getNotificationEnabled,
    });
    return () => {
      subscription.remove();
    };
  }, []);

  async function openAppNotificationSettings() {
    try {
      if (Platform.OS === 'ios') Linking.openURL('app-settings:');
      else await notifee.openNotificationSettings();
    } catch (e) {
      console.error('설정 화면 이동 실패:', e);
    }
  }

  const onChangeNotificationSetting =
    (receptionType: 'SERVICE' | 'MARKETING') => (value: boolean) => {
      const request: NotificationPreferenceRequest = {
        receptionType,
        enabled: value,
      };
      mutate(request, {
        onSuccess() {
          queryClient.invalidateQueries('notification-preference');
          if (receptionType === 'SERVICE') {
            Toast.show(
              value ? '알림 수신을 동의했습니다' : '알림 수신을 거부했습니다',
            );
          } else {
            Toast.show(
              value
                ? `${dateFormatter(
                    'yyyy.mm.dd',
                    new Date(),
                  )}\nletters to 마케팅 정보 수신을 동의했습니다`
                : `${dateFormatter(
                    'yyyy.mm.dd',
                    new Date(),
                  )}\nletters to 마케팅 정보 수신을 거부했습니다`,
            );
          }
        },
      });
    };

  if (!isSuccess) {
    return <></>;
  }

  return (
    <View style={[styles.container, {paddingTop: SAFE_AREA_TOP}]}>
      <StatusBar barStyle={'light-content'} />
      <Header2 title={'MY'} color={'white'} onPressBack={goBack} />
      <View style={styles.nicknameWrap}>
        <Profile nickname={userInfo.nickname} />
        <EditNicknameButton
          clickButtonEvent={CLICK_BUTTON_EVENT_PARAMS.EDIT_NICKNAME}
          onPress={toggleModal(MODAL_NAME.NICKNAME)}
        />
      </View>

      <StampBox
        clickButtonEvent={CLICK_BUTTON_EVENT_PARAMS.STAMP_BOX}
        stampQuantity={userInfo.stampQuantity}
        onPress={goToStampHistory}
      />

      <View style={styles.userInfoWrapper}>
        <EditUserInfoButton
          text="관심사 관리"
          clickButtonEvent={CLICK_BUTTON_EVENT_PARAMS.EDIT_TOPIC}
          onPress={toggleModal(MODAL_NAME.TOPIC)}
        />
        <EditUserInfoButton
          text="성향 관리"
          clickButtonEvent={CLICK_BUTTON_EVENT_PARAMS.EDIT_PERSONALITY}
          onPress={toggleModal(MODAL_NAME.PERSONALITY)}
        />
        <EditUserInfoButton
          text="주소록 관리"
          clickButtonEvent={CLICK_BUTTON_EVENT_PARAMS.MANAGE_ADDRESS}
          onPress={goToAddressManage}
        />
      </View>

      <View
        style={[
          styles.menuWrapper,
          {
            paddingBottom: SAFE_AREA_BOTTOM,
          },
        ]}>
        <ScrollView>
          <View style={styles.feedbackButton}>
            <FeedbackButton screenName="MYPAGE" />
          </View>
          <View style={styles.menuList}>
            <View style={styles.menu}>
              <NotificationListName name="알림 설정" />
              <NotificationListItem
                itemName="서비스 알림 수신 설정"
                value={notificationPreference?.SERVICE ?? false}
                onChange={onChangeNotificationSetting('SERVICE')}
                description="알림을 수신하면 편지 발송·도착 시 알려드려요!"
              />
              <NotificationListItem
                itemName="마케팅 수신 설정"
                value={notificationPreference?.MARKETING ?? false}
                onChange={onChangeNotificationSetting('MARKETING')}
                description="업데이트 및 재밌는 소식이 있을 때 알려드려요!"
              />

              {!isDeviceNotificationEnabled && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('@assets/warning.png')}
                    style={{width: 16, height: 16, marginRight: 4}}
                  />
                  <Text
                    style={{
                      fontFamily: 'Galmuri11',
                      fontSize: 12,
                      flex: 1,
                      color: '#ff5757',
                    }}>
                    기기 알림을 켜야 알려드릴 수 있어요!
                  </Text>
                  <Pressable
                    onPress={openAppNotificationSettings}
                    style={{
                      height: 26,
                      width: 73,
                      backgroundColor: '#0000cc',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Galmuri11',
                        fontSize: 13,
                        color: '#ffffff',
                      }}>
                      알림 켜기
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            <View style={styles.menu}>
              <ListName name="약관 정보" />
              <ListItem
                itmeName="서비스이용약관"
                onPress={onPressTermsOfService}
              />
              <ListItem
                itmeName="개인정보처리방침"
                onPress={onPressPrivacyPolicy}
              />
            </View>

            <View style={styles.menu}>
              <ListName name="계정 관리" />
              <ListItem itmeName="회원 탈퇴" onPress={goToAccountDelete} />
            </View>
          </View>
        </ScrollView>

        <BottomButton
          white
          buttonText="로그아웃"
          onPress={toggleModal(MODAL_NAME.LOGOUT)}
        />
      </View>

      {isAnyModalVisible && <ModalBlur />}
      <NicknameModal
        currentNickname={userInfo.nickname}
        isModalVisible={isModalVisible.NICKNAME}
        onPressClose={toggleModal(MODAL_NAME.NICKNAME)}
      />
      <TopicsModal
        currentTopics={userInfo.topicIds}
        isModalVisible={isModalVisible.TOPIC}
        onPressClose={toggleModal(MODAL_NAME.TOPIC)}
      />
      <PersonalitiesModal
        currentPersonalities={userInfo.personalityIds}
        isModalVisible={isModalVisible.PERSONALITY}
        onPressClose={toggleModal(MODAL_NAME.PERSONALITY)}
      />
      <LogoutModal
        isVisible={isModalVisible.LOGOUT}
        onPressClose={toggleModal(MODAL_NAME.LOGOUT)}
        onPressLogout={onPressLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0000cc'},
  nicknameWrap: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  nicknameButton: {
    height: 28,
    width: 82,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nicknameButtonText: {
    fontFamily: 'Galmuri11',
    fontSize: 11,
    color: '#0000cc',
  },
  userInfoWrapper: {height: 54, flexDirection: 'row'},
  modalBlur: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#000000a0',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  menuWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  menuList: {flex: 1, paddingTop: 8, paddingHorizontal: 24},
  menu: {marginBottom: 34},
  modal: {
    margin: 0,
    backgroundColor: 'white',
    height: 300,
    flex: 1,
    bottom: 0,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    position: 'absolute',
    width: '100%',
  },
  avatar: {
    overflow: 'hidden',
    width: 36,
    height: 36,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFCC',
    borderRadius: 18,
  },
  avatarText: {fontFamily: 'Galmuri11-Bold', fontSize: 13, color: '#0000CC'},
  feedbackButton: {margin: 16},
});
