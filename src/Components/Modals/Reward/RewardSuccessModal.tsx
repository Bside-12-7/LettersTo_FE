import {BottomButton} from '@components/Button/Bottom/BottomButton';
import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const closeBtn = require('@assets/Icon/close/close_blue.png');
const stampsImg = require('@assets/Icon/stamp/stamps_smile_blue.png');

interface Props {
  isModalVisible: boolean;
  onPressClose: () => void;
  onPressGoToLetterEditor: () => void;
}

export const RewardSuccessModal = React.memo(
  ({isModalVisible, onPressClose, onPressGoToLetterEditor}: Props) => {
    return (
      <Modal
        statusBarTranslucent={true}
        animationType="fade"
        transparent={true}
        onRequestClose={onPressClose}
        visible={isModalVisible}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <TouchableOpacity activeOpacity={0.7} onPress={onPressClose}>
              <Image style={styles.closeBtnImg} source={closeBtn} />
            </TouchableOpacity>
            <View style={styles.contents}>
              <Image style={styles.stampsImg} source={stampsImg} />
              <Text style={styles.text}>
                {'우표를 1장 받았어요! \n지금 바로 공개편지를 써볼까요?'}
              </Text>
            </View>
            <BottomButton
              buttonText={'공개 편지 쓰러 가기'}
              onPress={onPressGoToLetterEditor}
            />
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    borderRadius: 10,
    backgroundColor: 'white',
    height: 324,
    width: '100%',
  },
  closeBtnImg: {
    height: 28,
    width: 28,
    marginTop: 12,
    marginLeft: 16,
  },
  contents: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stampsImg: {
    height: 96,
    width: 96,
    resizeMode: 'contain',
    margin: 16,
  },
  text: {
    fontFamily: 'Galmuri11',
    fontSize: 15,
    color: '#0000cc',
    lineHeight: 22.5,
    textAlign: 'center',
  },
});
