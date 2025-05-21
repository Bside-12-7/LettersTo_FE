import {ModalHeader} from '@components/Headers/ModalHeader';
import {Modal, View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomButton} from '@components/Button/Bottom/BottomButton';

type Props = {
  isModalVisible: boolean;
  text: string | null;
  onPressClose: () => void;
};

export const InvitationCodeAlertModal = ({
  isModalVisible,
  text,
  onPressClose,
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
          <ModalHeader title={''} onPressClose={onPressClose} />
          <View style={styles.contentWrap}>
            <Text style={styles.text}>{text}</Text>
          </View>
          <BottomButton blue buttonText={'확인'} onPress={onPressClose} />
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
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Galmuri11',
    textAlign: 'center',
    color: '#0000cc',
    fontSize: 15,
    lineHeight: 30,
  },
});
