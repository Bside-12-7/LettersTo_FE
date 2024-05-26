import {getCities, getRegions} from '@apis/geolocation';
import {getUserInfo} from '@apis/member';
import {Header2} from '@components/Headers/Header2';
import {ModalBlur} from '@components/Modals/ModalBlur';
import {SafeNicknameNoticeModal} from '@components/Modals/MyPage/AddressManage/SafeNicknameNoticeModal';
import {SafeNicknameModal} from '@components/Modals/MyPage/AddressManage/SafeNicknameModal';
import {LocationModal} from '@components/Modals/MyPage/AddressManage/LocationModal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackParamsList} from '@type/stackParamList';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
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
import {InvitationModal} from '@components/Modals/MyPage/AddressManage/InvitationModal';
const questionsImg = require('@assets/question.png');
const pencilImg = require('@assets/Icon/pencil/pencil_blue.png');

type Props = NativeStackScreenProps<StackParamsList, 'AddressManage'>;

type ModalName =
  | 'SAFE_NICKNAME'
  | 'SAFE_NICKNAME_INFO'
  | 'LOCATION'
  | 'INVITATION';

const MODAL_NAME: {[key in ModalName]: key} = {
  SAFE_NICKNAME: 'SAFE_NICKNAME',
  SAFE_NICKNAME_INFO: 'SAFE_NICKNAME_INFO',
  LOCATION: 'LOCATION',
  INVITATION: 'INVITATION',
};
type ModalState = {
  [key in ModalName]: boolean;
};

const INITIAL_MODAL_STATE: ModalState = {
  SAFE_NICKNAME: false,
  SAFE_NICKNAME_INFO: false,
  LOCATION: false,
  INVITATION: false,
};

const MODAL_ACTION = {
  TOGGLE_SAFE_NICKNAME_MODAL: 'TOGGLE_SAFE_NICKNAME_MODAL',
  TOGGLE_SAFE_NICKNAME_INFO_MODAL: 'TOGGLE_SAFE_NICKNAME_INFO_MODAL',
  TOGGLE_LOCATION_MODAL: 'TOGGLE_LOCATION_MODAL',
  TOGGLE_INVITATION_MODAL: 'TOGGLE_INVITATION_MODAL',
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
    case MODAL_ACTION.TOGGLE_LOCATION_MODAL:
      return {...state, LOCATION: !state.LOCATION};
    case MODAL_ACTION.TOGGLE_INVITATION_MODAL:
      return {...state, INVITATION: !state.INVITATION};
  }
};

export function AddressManage({navigation, route: {params}}: Props) {
  const [isModalVisible, dispatch] = useReducer(
    modalReducer,
    INITIAL_MODAL_STATE,
  );
  const isAnyModalVisible = useMemo(
    () => isModalVisible.SAFE_NICKNAME || isModalVisible.SAFE_NICKNAME_INFO,
    [isModalVisible],
  );
  const [receivedCode, setReceivedCode] = useState(params?.code);

  const {top: SAFE_AREA_TOP} = useSafeAreaInsets();

  const {data: userInfo, isSuccess} = useQuery('userInfo', getUserInfo);
  const {data: regions} = useQuery('regions', getRegions);
  const {data: cities} = useQuery(
    ['regions', userInfo?.parentGeolocationId, 'cities'],
    () => userInfo && getCities(userInfo.parentGeolocationId),
  );

  const addressString = useMemo(() => {
    if (!userInfo || !regions || !cities) return '';
    const userRegion = (
      regions as unknown as {label: string; value: number}[]
    ).find(region => region.value === userInfo.parentGeolocationId)?.label;
    const userCity = cities.find(
      city => city.id === userInfo.geolocationId,
    )?.name;

    return userRegion + ' ' + userCity;
  }, [cities, regions, userInfo]);

  const toggleModal = (modalName: ModalName) => {
    dispatch({type: `TOGGLE_${modalName}_MODAL`});
  };

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  useEffect(() => {
    if (receivedCode) toggleModal(MODAL_NAME.INVITATION);
  }, [receivedCode]);

  if (!isSuccess) return;

  return (
    <View style={[styles.container, {paddingTop: SAFE_AREA_TOP}]}>
      <StatusBar barStyle={'light-content'} />
      <Header2 title={'주소록 관리'} color={'white'} onPressBack={goBack} />

      <View style={styles.topWrapper}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => toggleModal(MODAL_NAME.SAFE_NICKNAME)}
          style={[styles.btnEdit, {marginBottom: 18}]}>
          <Text style={styles.textEdit}>친구들이 보는 이름</Text>
          <TouchableWithoutFeedback
            onPress={() => toggleModal(MODAL_NAME.SAFE_NICKNAME_INFO)}>
            <Image source={questionsImg} style={{height: 20, width: 20}} />
          </TouchableWithoutFeedback>
          <Text style={[styles.textEdit, {marginLeft: 'auto'}]}>
            {userInfo?.safeNickname}
          </Text>
          <Image source={pencilImg} style={{height: 24, width: 24}} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => toggleModal(MODAL_NAME.LOCATION)}
          style={styles.btnEdit}>
          <Text style={styles.textEdit}>내 주소</Text>
          <Text style={[styles.textEdit, {marginLeft: 'auto'}]}>
            {addressString}
          </Text>
          <Image source={pencilImg} style={{height: 24, width: 24}} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomWrapper}>
        <View style={styles.invitationWrapper}>
          <Image source={require('./image.png')} />
          <Text
            style={{
              margin: 8,
              fontFamily: 'Galmuri11',
              fontSize: 14,
              fontWeight: '700',
              color: '#0000CC',
            }}>
            친구 추가하고 편지 주고받기
          </Text>
          <TouchableOpacity
            onPress={() => toggleModal(MODAL_NAME.INVITATION)}
            style={{
              marginLeft: 'auto',
              paddingVertical: 6,
              paddingHorizontal: 11,
              backgroundColor: '#0000CC',
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontFamily: 'Galmuri11',
                fontSize: 13,
                color: 'white',
              }}>
              초대하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {isAnyModalVisible && <ModalBlur />}
      <SafeNicknameNoticeModal
        isModalVisible={isModalVisible.SAFE_NICKNAME_INFO}
        onPressClose={() => toggleModal(MODAL_NAME.SAFE_NICKNAME_INFO)}
      />
      <SafeNicknameModal
        currentNickname={userInfo.safeNickname}
        isModalVisible={isModalVisible.SAFE_NICKNAME}
        onPressClose={() => toggleModal(MODAL_NAME.SAFE_NICKNAME)}
      />
      <LocationModal
        currentLocation={{
          geolocationId: userInfo.geolocationId,
          parentGeolocationId: userInfo.parentGeolocationId,
        }}
        isModalVisible={isModalVisible.LOCATION}
        onPressClose={() => toggleModal(MODAL_NAME.LOCATION)}
      />
      <InvitationModal
        receivedCode={receivedCode}
        deleteReceivedCode={
          receivedCode ? () => setReceivedCode(undefined) : undefined
        }
        isModalVisible={isModalVisible.INVITATION}
        onPressClose={() => {
          toggleModal(MODAL_NAME.INVITATION);
        }}
      />
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
  textEdit: {fontFamily: 'Galmuri11', fontSize: 14, color: '#0000CC'},
  topWrapper: {
    paddingTop: 17,
    paddingBottom: 31,
    paddingHorizontal: 24,
  },
  bottomWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  invitationWrapper: {
    height: 100,
    backgroundColor: '#F2F2FC',
    borderBottomWidth: 1,
    borderBottomColor: '#0000CC',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
});