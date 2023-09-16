import React, {useReducer, useMemo} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header2} from '@components/Headers/Header2';
import {getStampHistories} from '@apis/stamp';
import {dateFormatter} from '@utils/dateFormatter';
import {useQuery} from 'react-query';
import {getUserInfo} from '@apis/member';
import {StampReward} from '@components/Stamp/StampReward/StampRewardContainer';
import {ModalBlur} from '@components/Modals/ModalBlur';
import {RewardInformationModal} from '@components/Modals/Reward/RewardInformationModal';
import {RewardSuccessModal} from '@components/Modals/Reward/RewardSuccessModal';
type Props = NativeStackScreenProps<StackParamsList, 'StampHistory'>;

type ModalName = 'REWARD_INFORMATION' | 'REWARD_SUCCESS';

const MODAL_NAME: {[key in ModalName]: key} = {
  REWARD_INFORMATION: 'REWARD_INFORMATION',
  REWARD_SUCCESS: 'REWARD_SUCCESS',
};

type ModalState = {
  [key in ModalName]: boolean;
};

const INITIAL_MODAL_STATE: ModalState = {
  REWARD_INFORMATION: false,
  REWARD_SUCCESS: false,
};

const MODAL_ACTION = {
  TOGGLE_REWARD_INFORMATION_MODAL: 'TOGGLE_REWARD_INFORMATION_MODAL',
  TOGGLE_REWARD_SUCCESS_MODAL: 'TOGGLE_REWARD_SUCCESS_MODAL',
} as const;

const modalReducer = (
  state: ModalState,
  action: {type: keyof typeof MODAL_ACTION},
) => {
  switch (action.type) {
    case MODAL_ACTION.TOGGLE_REWARD_INFORMATION_MODAL:
      return {...state, REWARD_INFORMATION: !state.REWARD_INFORMATION};
    case MODAL_ACTION.TOGGLE_REWARD_SUCCESS_MODAL:
      return {...state, REWARD_SUCCESS: !state.REWARD_SUCCESS};
  }
};

export const StampHistory = ({navigation}: Props) => {
  const {top: SAFE_AREA_TOP, bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  const onPressBack = () => {
    navigation.pop();
  };

  const {data: stampHistories} = useQuery('stampHistories', getStampHistories);

  const {data: userInfo} = useQuery('userInfo', getUserInfo);

  const [isModalVisible, dispatch] = useReducer(
    modalReducer,
    INITIAL_MODAL_STATE,
  );

  const toggleModal = (modalName: ModalName) => () => {
    dispatch({type: `TOGGLE_${modalName}_MODAL`});
  };

  const isAnyModalVisible = useMemo(
    () => isModalVisible.REWARD_INFORMATION || isModalVisible.REWARD_SUCCESS,
    [isModalVisible],
  );

  const onPressGoToLetterEditor = () => {
    navigation.popToTop();
    navigation.navigate('LetterEditor');
  };

  return (
    <View style={[styles.container, {paddingTop: SAFE_AREA_TOP}]}>
      <StatusBar barStyle={'light-content'} />
      <Header2 title="우표 지급 내역" color="white" onPressBack={onPressBack} />

      <View style={styles.totalArea}>
        <Image
          source={require('@assets/numberStamps_white.png')}
          style={{width: 24, height: 24}}
        />
        <Text style={[styles.totalText, {marginLeft: 2}]}>나의 보유 우표</Text>
        <Text style={[styles.totalText, {marginLeft: 'auto'}]}>
          {userInfo?.stampQuantity.toLocaleString()}개
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={{paddingBottom: SAFE_AREA_BOTTOM}}>
          <View style={{margin: 16}}>
            <StampReward
              toggleRewardInformationModal={toggleModal(
                MODAL_NAME.REWARD_INFORMATION,
              )}
              toggleRewardSuccessModal={toggleModal(MODAL_NAME.REWARD_SUCCESS)}
            />
          </View>
          {stampHistories?.map((item: any, idx: number) => {
            return (
              <View key={idx} style={styles.item}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.quantity}>+{item.quantity}개</Text>
                </View>
                <Text style={styles.createdDate}>
                  {dateFormatter('yyyy.mm.dd', item.createdDate)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {isAnyModalVisible && <ModalBlur />}
      <RewardInformationModal
        onPressClose={toggleModal(MODAL_NAME.REWARD_INFORMATION)}
        isModalVisible={isModalVisible.REWARD_INFORMATION}
      />
      <RewardSuccessModal
        onPressClose={toggleModal(MODAL_NAME.REWARD_SUCCESS)}
        onPressGoToLetterEditor={onPressGoToLetterEditor}
        isModalVisible={isModalVisible.REWARD_SUCCESS}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000CC',
  },
  contentContainer: {flex: 1, backgroundColor: 'white', marginTop: 5},
  totalArea: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  totalText: {fontFamily: 'Galmuri11', fontSize: 15, color: 'white'},
  tooltipArea: {
    position: 'absolute',
    zIndex: 10,
    top: 50,
    left: 24,
    height: 32,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFCC',
    borderWidth: 1,
    borderColor: '#0000CC',
    borderRadius: 5,
  },
  tooltipText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000CC',
    lineHeight: 28,
  },
  tooltipTail: {
    position: 'absolute',
    top: -3.5,
    left: 22,
    transform: [{scaleY: -1}],
    width: 5,
    height: 4,
  },
  item: {
    minHeight: 100,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 204, 0.2)',
  },
  event: {
    marginRight: 8,
    paddingRight: 8,
    paddingLeft: 10,
    fontFamily: 'Galmuri11-Bold',
    fontSize: 11,
    lineHeight: 24,
    color: 'white',
    backgroundColor: '#FF47C1',
    borderRadius: 10,
  },
  eventText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000CC',
    marginRight: 'auto',
  },
  description: {fontFamily: 'Galmuri11', fontSize: 14, color: '#0000CC'},
  quantity: {fontFamily: 'Galmuri11', fontSize: 14, color: '#44CCFF'},
  createdDate: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000CC',
    opacity: 0.5,
  },
});
