import React, {useCallback, useMemo, useReducer} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, StyleSheet, StatusBar} from 'react-native';
import type {StackParamsList} from '../../../types/stackParamList';
import {ListItem, ListName} from './Components/MyPageList';

import {NicknameModal} from '../../../Modals/UserInfo/NicknameModal';
import {TopicsModal} from '../../../Modals/UserInfo/TopicsModal';
import {PersonalitiesModal} from '../../../Modals/UserInfo/PersonalitiesModal';

import {LocationModal} from '../../../Modals/UserInfo/LocationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserInfo} from '../../../APIs/member';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../Constants/screen';
import {ModalBlur} from '../../../Modals/ModalBlur';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header2} from '../../../Components/Headers/Header2';
import {BottomButton} from '../../../Components/Button/Bottom/BottomButton';
import {
  onPressPrivacyPolicy,
  onPressTermsOfService,
} from '../../../Utils/hyperlink';
import {useAuthAction} from '../../../Store/auth';
import {useQuery} from 'react-query';
import {LogoutModal} from '../../../Modals/Logout/LogoutModal';
import {Profile} from './Components/Profile';
import {EditNicknameButton} from './Components/Button/EditNicknameButton';
import {StampBox} from './Components/StampBox';
import {EditUserInfoButton} from './Components/Button/EditUserInfoButton';

type Props = NativeStackScreenProps<StackParamsList, 'MyPage'>;

type ModalName = 'NICKNAME' | 'TOPIC' | 'PERSONALITY' | 'LOCATION' | 'LOGOUT';

const MODAL_NAME: {[key in ModalName]: key} = {
  NICKNAME: 'NICKNAME',
  TOPIC: 'TOPIC',
  PERSONALITY: 'PERSONALITY',
  LOCATION: 'LOCATION',
  LOGOUT: 'LOGOUT',
};

type ModalState = {
  [key in ModalName]: boolean;
};

const initialModalState: ModalState = {
  NICKNAME: false,
  TOPIC: false,
  PERSONALITY: false,
  LOCATION: false,
  LOGOUT: false,
};

const MODAL_ACTION = {
  TOGGLE_NICKNAME_MODAL: 'TOGGLE_NICKNAME_MODAL',
  TOGGLE_TOPIC_MODAL: 'TOGGLE_TOPIC_MODAL',
  TOGGLE_PERSONALITY_MODAL: 'TOGGLE_PERSONALITY_MODAL',
  TOGGLE_LOCATION_MODAL: 'TOGGLE_LOCATION_MODAL',
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
    case MODAL_ACTION.TOGGLE_LOCATION_MODAL:
      return {...state, LOCATION: !state.LOCATION};
    case MODAL_ACTION.TOGGLE_LOGOUT_MODAL:
      return {...state, LOGOUT: !state.LOGOUT};
  }
};

export const MyPage = ({navigation}: Props) => {
  const [isModalVisible, dispatch] = useReducer(
    modalReducer,
    initialModalState,
  );

  const isAnyModalVisible = useMemo(
    () =>
      isModalVisible.NICKNAME ||
      isModalVisible.TOPIC ||
      isModalVisible.PERSONALITY ||
      isModalVisible.LOCATION ||
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
        <EditNicknameButton onPress={toggleModal(MODAL_NAME.NICKNAME)} />
      </View>

      <StampBox
        stampQuantity={userInfo.stampQuantity}
        onPress={goToStampHistory}
      />

      <View style={styles.userInfoWrapper}>
        <EditUserInfoButton
          text="관심사 관리"
          onPress={toggleModal(MODAL_NAME.TOPIC)}
        />
        <EditUserInfoButton
          text="성향 관리"
          onPress={toggleModal(MODAL_NAME.PERSONALITY)}
        />
        <EditUserInfoButton
          text="위치 정보 관리"
          onPress={toggleModal(MODAL_NAME.LOCATION)}
        />
      </View>

      <View
        style={[
          styles.menuWrapper,
          {
            paddingBottom: SAFE_AREA_BOTTOM,
          },
        ]}>
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
      <LocationModal
        currentLocation={{
          geolocationId: userInfo.geolocationId,
          parentGeolocationId: userInfo.parentGeolocationId,
        }}
        isModalVisible={isModalVisible.LOCATION}
        onPressClose={toggleModal(MODAL_NAME.LOCATION)}
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
  menuList: {flex: 1, paddingTop: 24, paddingHorizontal: 24},
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
});