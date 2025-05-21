import React from 'react';
import {View, Modal, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ModalHeader} from '@components/Headers/ModalHeader';

type Props = {
  isModalVisible: boolean;
  onPressClose: () => void;
  onPressDelete: () => void;
};

export const DeleteFriendModal = ({
  isModalVisible,
  onPressClose,
  onPressDelete,
}: Props) => {
  const {bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  const hideModal = () => {
    onPressClose();
  };

  return (
    <Modal
      statusBarTranslucent={true} // android
      animationType="slide"
      transparent={true}
      onRequestClose={hideModal}
      visible={isModalVisible}>
      <View style={styles.container}>
        <View style={[styles.modalView, {paddingBottom: SAFE_AREA_BOTTOM}]}>
          <ModalHeader title={''} onPressClose={hideModal} />
          <Text
            style={{
              marginVertical: 32,
              textAlign: 'center',
              fontFamily: 'Galmuri11',
              fontSize: 14,
              lineHeight: 23,
              color: '#0000CC',
            }}>
            {'(´•̥ ᵔ •̥`)\n정말 삭제하시겠어요?'}
          </Text>
          <View style={{flexDirection: 'row', paddingHorizontal: 16}}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flex: 120,
                marginRight: 12,
                height: 52,
                borderColor: '#0000CC',
                borderRadius: 12,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={onPressClose}>
              <Text
                style={{
                  fontFamily: 'Galmuri11',
                  fontSize: 14,
                  lineHeight: 23,
                  color: '#0000CC',
                }}>
                취소
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flex: 209,
                height: 52,
                backgroundColor: '#0000CC',
                borderRadius: 12,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={onPressDelete}>
              <Text
                style={{
                  fontFamily: 'Galmuri11',
                  fontSize: 14,
                  lineHeight: 23,
                  color: '#ffffff',
                }}>
                삭제할께요
              </Text>
            </TouchableOpacity>
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
});
