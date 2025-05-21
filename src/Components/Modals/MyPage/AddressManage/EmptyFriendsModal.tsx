import {ModalHeader} from '@components/Headers/ModalHeader';
import {Modal, View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomButton} from '@components/Button/Bottom/BottomButton';

type Props = {
  isModalVisible: boolean;
  onPressConfirm: () => void;
  onPressClose: () => void;
};

export const EmptyFriendsModal = ({
  isModalVisible,
  onPressClose,
  onPressConfirm,
}: Props) => {
  const {bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  return (
    <Modal
      statusBarTranslucent={true}
      animationType="slide"
      transparent={true}
      onRequestClose={onPressClose}
      visible={isModalVisible}>
      <View style={styles.container}>
        <View style={[styles.modalView, {paddingBottom: SAFE_AREA_BOTTOM}]}>
          <ModalHeader title={'안내'} onPressClose={onPressClose} />
          <View style={styles.contentWrap}>
            <Text style={styles.text}>
              {`편지를 보낼 친구가 없어요 (´•̥ ᵔ •̥\`)\n친구 추가하고 편지를 주고받아 보세요.`}
            </Text>
          </View>
          <BottomButton
            buttonText="친구 초대하기"
            blue
            onPress={onPressConfirm}
          />
        </View>
      </View>
    </Modal>
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
  contentWrap: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 40,
  },
  text: {
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    fontSize: 15,
    lineHeight: 30,
    textAlign: 'center',
  },
});
