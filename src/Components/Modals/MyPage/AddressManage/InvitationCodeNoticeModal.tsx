import {ModalHeader} from '@components/Headers/ModalHeader';
import {Modal, View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  isModalVisible: boolean;
  onPressClose: () => void;
};

export const InvitationCodeNoticeModal = ({
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
              {'- 친구에게 받은 친구코드를 등록해보세요.'}
            </Text>
            <Text style={styles.text}>
              {'- 코드는 ‘주소록 관리 - 초대하기’에서도 확인할 수 있어요.'}
            </Text>
            <Text style={styles.text}>
              {
                '- ‘주소록 관리 - 초대하기’를 통해 내가 먼저 친구를 초대할수도 있어요.'
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
