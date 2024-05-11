import React, {useCallback, useMemo, useReducer} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, StyleSheet, StatusBar} from 'react-native';
import {useQuery} from 'react-query';
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

  const isAnyModalVisible = useMemo(
    () =>
      isModalVisible.NICKNAME ||
      isModalVisible.TOPIC ||
      isModalVisible.PERSONALITY ||
      isModalVisible.LOGOUT,
    [isModalVisible],
  );

  const {logout} = useAuthAction();

  const {top: SAFE_AREA_TOP, bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  const onPressLogout = useCallback(() => {
    AsyncStorage.removeItem('accessToken');
    AsyncStorage.removeItem('refreshToken');
    logout();
  }, [logout]);

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
        <View style={styles.feedbackButton}>
          <FeedbackButton screenName="MYPAGE" />
        </View>
        <View style={styles.menuList}>
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
