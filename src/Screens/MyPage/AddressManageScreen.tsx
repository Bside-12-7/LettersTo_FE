import {getUserInfo} from '@apis/member';
import {Header2} from '@components/Headers/Header2';
import {ModalBlur} from '@components/Modals/ModalBlur';
import {SafeNicknameInfoModal} from '@components/Modals/MyPage/AddressManage/SafeNicknameInfoModal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackParamsList} from '@type/stackParamList';
import React, {useCallback, useMemo, useReducer} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery} from 'react-query';
const questionsImg = require('@assets/question.png');
const pencilImg = require('@assets/Icon/pencil/pencil_blue.png');

type Props = NativeStackScreenProps<StackParamsList, 'AddressManage'>;

type ModalName = 'SAFE_NICKNAME' | 'SAFE_NICKNAME_INFO';

const MODAL_NAME: {[key in ModalName]: key} = {
  SAFE_NICKNAME: 'SAFE_NICKNAME',
  SAFE_NICKNAME_INFO: 'SAFE_NICKNAME_INFO',
};
type ModalState = {
  [key in ModalName]: boolean;
};

const INITIAL_MODAL_STATE: ModalState = {
  SAFE_NICKNAME: false,
  SAFE_NICKNAME_INFO: false,
};

const MODAL_ACTION = {
  TOGGLE_SAFE_NICKNAME_MODAL: 'TOGGLE_SAFE_NICKNAME_MODAL',
  TOGGLE_SAFE_NICKNAME_INFO_MODAL: 'TOGGLE_SAFE_NICKNAME_INFO_MODAL',
} as const;

const modalReducer = (
  state: ModalState,
  action: {type: keyof typeof MODAL_ACTION},
) => {
  switch (action.type) {
    case MODAL_ACTION.TOGGLE_SAFE_NICKNAME_MODAL:
      return {...state, SAFE_NICKNAME: !state.SAFE_NICKNAME};
    case MODAL_ACTION.TOGGLE_SAFE_NICKNAME_INFO_MODAL:
      return {...state, SAFE_NICKNAME_INFO: !state.SAFE_NICKNAME_INFO};
  }
};

export function AddressManage({navigation}: Props) {
  const [isModalVisible, dispatch] = useReducer(
    modalReducer,
    INITIAL_MODAL_STATE,
  );
  const isAnyModalVisible = useMemo(
    () => isModalVisible.SAFE_NICKNAME || isModalVisible.SAFE_NICKNAME_INFO,
    [isModalVisible],
  );

  const {top: SAFE_AREA_TOP /*, bottom: SAFE_AREA_BOTTOM*/} =
    useSafeAreaInsets();

  const {data: userInfo, isSuccess} = useQuery('userInfo', getUserInfo);

  const toggleModal = (modalName: ModalName) => {
    console.log(modalName);
    dispatch({type: `TOGGLE_${modalName}_MODAL`});
  };

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  if (!isSuccess) {
    return <></>;
  }

  return (
    <View style={[styles.container, {paddingTop: SAFE_AREA_TOP}]}>
      <StatusBar barStyle={'light-content'} />
      <Header2 title={'주소록 관리'} color={'white'} onPressBack={goBack} />

      <View
        style={{
          paddingTop: 17,
          paddingBottom: 31,
          paddingHorizontal: 24,
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => toggleModal(MODAL_NAME.SAFE_NICKNAME)}
          style={[styles.btnEdit, {marginBottom: 18}]}>
          <Text
            style={{fontFamily: 'Galmuri11', fontSize: 14, color: '#0000CC'}}>
            친구들이 보는 이름
          </Text>
          <TouchableWithoutFeedback
            onPress={() => toggleModal(MODAL_NAME.SAFE_NICKNAME_INFO)}>
            <Image source={questionsImg} style={{height: 20, width: 20}} />
          </TouchableWithoutFeedback>
          <Text
            style={{
              fontFamily: 'Galmuri11',
              fontSize: 14,
              color: '#0000CC',
              marginLeft: 'auto',
            }}>
            {userInfo?.safeNickname}
          </Text>
          <Image source={pencilImg} style={{height: 24, width: 24}} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} style={styles.btnEdit}>
          <Text
            style={{fontFamily: 'Galmuri11', fontSize: 14, color: '#0000CC'}}>
            내 주소
          </Text>
          <Text
            style={{
              fontFamily: 'Galmuri11',
              fontSize: 14,
              color: '#0000CC',
              marginLeft: 'auto',
            }}>
            진석
          </Text>
          <Image source={pencilImg} style={{height: 24, width: 24}} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <Text>123</Text>
      </View>
      {isAnyModalVisible && <ModalBlur />}
      <SafeNicknameInfoModal
        isModalVisible={isModalVisible.SAFE_NICKNAME_INFO}
        onPressClose={() => toggleModal(MODAL_NAME.SAFE_NICKNAME_INFO)}
      />
      {/* <NicknameModal
        currentNickname={userInfo.safeNickname}
        isModalVisible={isModalVisible.SAFE_NICKNAME}
        onPressClose={() => toggleModal(MODAL_NAME.SAFE_NICKNAME)}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0000cc'},
  btnEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});
