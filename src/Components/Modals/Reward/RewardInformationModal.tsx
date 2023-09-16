import React from 'react';
import {ModalHeader} from '@components/Headers/ModalHeader';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  isModalVisible: boolean;
  onPressClose: () => void;
}

export const RewardInformationModal = React.memo(
  ({isModalVisible, onPressClose}: Props) => {
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
                {'- 우표는 하루 5개까지 받을 수 있어요'}
              </Text>
              <Text style={styles.text}>
                {
                  '- 친구에게 Letters to를 추천하면 기다리지 않고 바로 받을 수 있어요.'
                }
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);

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
    paddingTop: 10,
    paddingBottom: 100,
  },
  text: {
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    fontSize: 15,
    lineHeight: 30,
  },
});
