import React, {useEffect, useMemo} from 'react';
import {View, Modal, StyleSheet, ScrollView} from 'react-native';
import {ResetButton} from '@components/Button/Reset/ResetButton';
import {ModalHeader} from '@components/Headers/ModalHeader';
import {SCREEN_HEIGHT} from '@constants/screen';
import {PersonalityList} from '@components/UserInfo/Personality/PersonalityList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {patchUserInfo} from '@apis/member';
import {usePersonality} from '@hooks/UserInfo/usePersonality';
import Toast from '@components/Toast/toast';
import {useMutation, useQueryClient} from 'react-query';
import {Title} from '@components/UserInfo/TitleText';
import _ from 'lodash';
import {Counter} from '@components/UserInfo/CounterText';
import {MAX_PERSONALITY_LIMIT} from '@constants/user';
import {MaximumAlert} from '@components/UserInfo/Alert/MaximumAlert';
import {UpdateButton} from '@components/Button/Bottom/UpdateButton';

type Props = {
  currentPersonalities: number[];
  isModalVisible: boolean;
  onPressClose: () => void;
};

export function PersonalitiesModal({
  currentPersonalities,
  isModalVisible,
  onPressClose,
}: Props) {
  const {
    personalities,
    selectedPersonalityIds,
    selectPersonality,
    alertOpacity,
    counter,
    reset,
    resetAlert,
  } = usePersonality(currentPersonalities);

  const queryClient = useQueryClient();

  const {bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  const disableUpdate = useMemo(
    () =>
      selectedPersonalityIds.length === 0 ||
      _.isEqual(currentPersonalities, selectedPersonalityIds),
    [currentPersonalities, selectedPersonalityIds],
  );

  const hideModal = () => {
    resetAlert();
    onPressClose();
  };

  const {mutate: updatePersonalites} = useMutation(
    ['personalities', selectedPersonalityIds],
    async () => await patchUserInfo({personalityIds: selectedPersonalityIds}),
    {
      onSuccess: () => {
        Toast.show('성공적으로 변경되었어요!');
        queryClient.invalidateQueries('userInfo');
        hideModal();
      },
      onError: (error: any) => {
        hideModal();
        Toast.show(error.response.data.message);
      },
    },
  );

  useEffect(() => {
    if (isModalVisible) {
      reset();
    }
  }, [isModalVisible, reset]);

  return (
    <Modal
      statusBarTranslucent={true} // android
      animationType="slide"
      transparent={true}
      onRequestClose={hideModal}
      visible={isModalVisible}>
      <View style={styles.container}>
        <View style={[styles.modalView, {paddingBottom: SAFE_AREA_BOTTOM}]}>
          <ModalHeader title={'성향 관리'} onPressClose={hideModal} />

          <View style={styles.titleBox}>
            <Title title={'나의 관심사를\n모두 선택해주세요'} />
            <View style={styles.counterWrap}>
              <ResetButton reset={reset} />
              <Counter value={counter} max={MAX_PERSONALITY_LIMIT} />
            </View>
          </View>
          <ScrollView alwaysBounceVertical={false} style={styles.topicBox}>
            <PersonalityList
              personalities={personalities}
              selectPersonality={selectPersonality}
              selectedPersonalityIds={selectedPersonalityIds}
            />
          </ScrollView>
          <MaximumAlert
            alertOpacity={alertOpacity}
            max={MAX_PERSONALITY_LIMIT}
          />
          <UpdateButton
            disable={disableUpdate}
            onPressUpdate={updatePersonalites}
          />
        </View>
      </View>
    </Modal>
  );
}

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
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
  },
  titleWrap: {
    marginBottom: 30,
    justifyContent: 'flex-end',
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    marginTop: 8,
  },
  counterWrap: {alignItems: 'center', flexDirection: 'row'},
  counter: {
    width: 35,
    fontSize: 13,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    marginHorizontal: 8,
    textAlign: 'right',
  },
  topicBox: {
    marginHorizontal: 24,
    height: SCREEN_HEIGHT * 0.6,
  },
  alert: {
    marginHorizontal: 24,
    marginBottom: 10,
  },
  alertText: {
    fontFamily: 'Galmuri11',
    color: '#ff44cc',
  },
});
