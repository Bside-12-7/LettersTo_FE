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
  useRef,
  useState,
} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {InvitationModal} from '@components/Modals/MyPage/AddressManage/InvitationModal';
import {ListItemWithSwipeAction} from '@components/ListItem/ListItemWithSwipeAction';
import {deleteFriends, getFriends} from '@apis/invitation';
import {GRADIENT_COLORS} from '@constants/letter';
import {LinearGradient} from 'expo-linear-gradient';
import {useLetterEditorStore} from '@stores/store';
import {AxiosError} from 'axios';
import {DeleteFriendModal} from '@components/Modals/MyPage/AddressManage/DeleteFriendModal';
const questionsImg = require('@assets/question.png');
const pencilImg = require('@assets/Icon/pencil/pencil_blue.png');

type Props = NativeStackScreenProps<StackParamsList, 'AddressManage'>;

type ModalName =
  | 'SAFE_NICKNAME'
  | 'SAFE_NICKNAME_INFO'
  | 'LOCATION'
  | 'INVITATION'
  | 'DELETE_FRIEND';

const MODAL_NAME: {[key in ModalName]: key} = {
  SAFE_NICKNAME: 'SAFE_NICKNAME',
  SAFE_NICKNAME_INFO: 'SAFE_NICKNAME_INFO',
  LOCATION: 'LOCATION',
  INVITATION: 'INVITATION',
  DELETE_FRIEND: 'DELETE_FRIEND',
};
type ModalState = {
  [key in ModalName]: boolean;
};

const INITIAL_MODAL_STATE: ModalState = {
  SAFE_NICKNAME: false,
  SAFE_NICKNAME_INFO: false,
  LOCATION: false,
  INVITATION: false,
  DELETE_FRIEND: false,
};

const MODAL_ACTION = {
  TOGGLE_SAFE_NICKNAME_MODAL: 'TOGGLE_SAFE_NICKNAME_MODAL',
  TOGGLE_SAFE_NICKNAME_INFO_MODAL: 'TOGGLE_SAFE_NICKNAME_INFO_MODAL',
  TOGGLE_LOCATION_MODAL: 'TOGGLE_LOCATION_MODAL',
  TOGGLE_INVITATION_MODAL: 'TOGGLE_INVITATION_MODAL',
  TOGGLE_DELETE_FRIEND_MODAL: 'TOGGLE_DELETE_FRIEND_MODAL',
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
    case MODAL_ACTION.TOGGLE_DELETE_FRIEND_MODAL:
      return {...state, DELETE_FRIEND: !state.DELETE_FRIEND};
  }
};

export function AddressManage({navigation, route: {params}}: Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [isModalVisible, dispatch] = useReducer(
    modalReducer,
    INITIAL_MODAL_STATE,
  );
  const isAnyModalVisible = useMemo(
    () =>
      isModalVisible.SAFE_NICKNAME ||
      isModalVisible.SAFE_NICKNAME_INFO ||
      isModalVisible.INVITATION ||
      isModalVisible.LOCATION ||
      isModalVisible.DELETE_FRIEND,
    [isModalVisible],
  );
  const [receivedCode, setReceivedCode] = useState(params?.code);
  const queryClient = useQueryClient();

  const {setDeliverLetterTo} = useLetterEditorStore();

  const {top: SAFE_AREA_TOP} = useSafeAreaInsets();

  const {data: userInfo, isSuccess} = useQuery('userInfo', getUserInfo);
  const {data: regions} = useQuery('regions', getRegions);
  const {data: cities} = useQuery(
    ['regions', userInfo?.parentGeolocationId, 'cities'],
    () => userInfo && getCities(userInfo.parentGeolocationId),
  );
  const {data: friends, isFetchedAfterMount} = useQuery('friends', getFriends, {
    refetchOnMount: true,
  });
  const {mutate} = useMutation<null, AxiosError, number>({
    mutationFn: id => deleteFriends(id),
    onSettled() {
      toggleModal(MODAL_NAME.DELETE_FRIEND);
      queryClient.refetchQueries('friends');
    },
  });

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

  useEffect(() => {
    setTimeout(() => {
      if (isFetchedAfterMount && (!friends || friends?.length === 0)) {
        toggleModal('INVITATION');
      }
    }, 500);
  }, [friends, isFetchedAfterMount]);

  if (!isSuccess) return <></>;

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
        {friends && (
          <ScrollView
            style={{flex: 1}}
            contentInsetAdjustmentBehavior="automatic"
            ref={scrollViewRef}>
            {friends.map(friend => (
              <>
                <ListItemWithSwipeAction
                  style={{
                    height: 100,
                    alignItems: 'center',
                    width: '100%',
                    padding: 16,
                    flexDirection: 'row',
                    borderBottomColor: '#0000CC40',
                    borderBottomWidth: 1,
                  }}
                  key={friend.id}
                  scrollViewRef={scrollViewRef}
                  onPressDelete={() => toggleModal(MODAL_NAME.DELETE_FRIEND)}>
                  <View
                    style={[
                      styles.listItemIcon,
                      {backgroundColor: GRADIENT_COLORS.BLUE},
                    ]}>
                    <Text style={styles.listItemIconText}>
                      {friend.nickname[0]}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                    }}>
                    <Text style={styles.listItemTitle}>{friend.nickname}</Text>
                    <Text style={styles.listItemTitle}>{friend.address}</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setDeliverLetterTo({
                        toNickname: friend.nickname,
                        toAddress: friend.address,
                      });
                      navigation.navigate('LetterEditor', {
                        to: 'DELIVERY',
                        type: 'DIRECT_MESSAGE',
                        fromMemberId: friend.memberId,
                      });
                    }}
                    style={{
                      marginLeft: 'auto',
                    }}>
                    <LinearGradient
                      colors={['#FF6ECE', '#FF3DBD']}
                      style={{
                        width: 73,
                        height: 28,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Galmuri11',
                          fontSize: 13,
                          color: 'white',
                        }}>
                        편지 쓰기
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </ListItemWithSwipeAction>
                <DeleteFriendModal
                  isModalVisible={isModalVisible.DELETE_FRIEND}
                  onPressClose={() => toggleModal(MODAL_NAME.DELETE_FRIEND)}
                  onPressDelete={() => mutate(friend.id)}
                />
              </>
            ))}
          </ScrollView>
        )}
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
  listItemIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#0000CC',
    borderRadius: 18,
  },
  listItemIconText: {
    fontFamily: 'Galmuri11-Bold',
    fontSize: 13,
    color: '#0000CC',
  },
  listItemTitle: {
    width: '50%',
    fontFamily: 'Galmuri11',
    fontSize: 14,
    lineHeight: 24,
    color: '#0000CC',
  },
});
