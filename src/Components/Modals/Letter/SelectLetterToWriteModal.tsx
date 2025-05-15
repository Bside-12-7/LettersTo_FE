import {ModalHeader} from '@components/Headers/ModalHeader';
import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export function SelectLetterToWriteModal({
  isModalVisible,
  hideModal,
  onPressPublicLetter,
  onPressFriendLetter,
}: {
  isModalVisible: boolean;
  hideModal: () => void;
  onPressPublicLetter: () => void;
  onPressFriendLetter: () => void;
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={hideModal}>
      <View style={styles.container}>
        <View
          style={{
            height: 184,
            width: '100%',
            backgroundColor: 'white',
            borderRadius: 14,
          }}>
          <ModalHeader
            title={'어떤 편지를 써볼까요?'}
            onPressClose={hideModal}
          />
          <View
            style={{
              flex: 1,
              padding: 16,
              paddingBottom: 20,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={onPressPublicLetter}
              activeOpacity={0.7}
              style={{
                height: 40,
                backgroundColor: '#0000CC',
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Galmuri11',
                  color: 'white',
                }}>
                공개편지 쓰기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onPressFriendLetter}
              style={{
                height: 40,
                backgroundColor: '#FF44CC',
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Galmuri11',
                  color: 'white',
                }}>
                친구에게 편지 쓰기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 204, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
});
