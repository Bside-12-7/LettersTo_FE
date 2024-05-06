import {ModalHeader} from '@components/Headers/ModalHeader';
import {Modal, View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  isModalVisible: boolean;
  onPressClose: () => void;
};

export const SafeNicknameInfoModal = ({
  isModalVisible,
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
          <ModalHeader title={'안내'} onPressClose={onPressClose} />
          <View style={styles.contentWrap}>
            <Text style={styles.text}>
              {'- 주소록의 친구들만 볼 수 있는 이름이에요.'}
            </Text>
            <Text style={styles.text}>
              {
                '- 익명성을 지켜드리기 위해 친구들과 사용하는 이름과 익명의 닉네임을 분리했어요.'
              }
            </Text>
          </View>
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
