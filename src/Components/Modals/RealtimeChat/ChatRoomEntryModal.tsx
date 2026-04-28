import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

const closeBtn = require('@assets/Icon/close/close_blue.png');
const stampsImg = require('@assets/Icon/stamp/stamps_smile_blue.png');

interface Props {
  isVisible: boolean;
  onPressClose: () => void;
  onPressEnter: () => void;
}

export const ChatRoomEntryModal = React.memo(
  ({isVisible, onPressClose, onPressEnter}: Props) => {
    return (
      <Modal
        statusBarTranslucent={true}
        animationType="fade"
        transparent={true}
        onRequestClose={onPressClose}
        visible={isVisible}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.closeBtn}
              activeOpacity={0.7}
              onPress={onPressClose}>
              <Image style={styles.closeBtnImg} source={closeBtn} />
            </TouchableOpacity>
            <View style={styles.contents}>
              <Image style={styles.stampsImg} source={stampsImg} />
              <Text style={styles.infoText}>입장료: 우표 2장</Text>
              <Text style={styles.infoText}>
                이용 시간: 매일 06:00 ~ 다음날 06:00
              </Text>
            </View>
            <TouchableOpacity
              style={styles.buttonWrapper}
              activeOpacity={0.7}
              onPress={onPressEnter}>
              <LinearGradient
                colors={['#FF6ECE', '#FF3DBD']}
                style={styles.button}>
                <Text style={styles.buttonText}>입장하기</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    borderRadius: 10,
    backgroundColor: 'white',
    width: '100%',
    paddingBottom: 16,
  },
  closeBtn: {
    alignSelf: 'flex-start',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 14,
  },
  closeBtnImg: {
    height: 28,
    width: 28,
  },
  contents: {
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  stampsImg: {
    height: 96,
    width: 96,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  infoText: {
    fontFamily: 'Galmuri11',
    fontSize: 15,
    color: '#0000CC',
    marginBottom: 8,
  },
  buttonWrapper: {
    marginHorizontal: 16,
  },
  button: {
    borderRadius: 10,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Galmuri11',
    fontSize: 15,
    color: 'white',
  },
});
