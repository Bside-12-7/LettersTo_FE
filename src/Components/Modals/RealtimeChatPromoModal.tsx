import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ModalBlur} from './ModalBlur';

const closeBtn = require('@assets/Icon/close/close_blue.png');

interface Props {
  visible: boolean;
  onClose: () => void;
  onPressGo: () => void;
}

export const RealtimeChatPromoModal = React.memo(
  ({visible, onClose, onPressGo}: Props) => {
    const {bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();
    return (
      <>
        {visible && <ModalBlur />}
        <Modal
          statusBarTranslucent
          animationType="slide"
          transparent
          onRequestClose={onClose}
          visible={visible}>
          <View style={styles.container}>
            <View
              style={[styles.sheet, {paddingBottom: SAFE_AREA_BOTTOM + 16}]}>
              {/* 닫기 */}
              <TouchableOpacity
                style={styles.closeBtn}
                activeOpacity={0.7}
                onPress={onClose}>
                <Image style={styles.closeBtnImg} source={closeBtn} />
              </TouchableOpacity>

              {/* 본문 */}
              <View style={styles.titleWrap}>
                <Text style={styles.title}>
                  {'이제 유저들과 실시간으로\n채팅을 주고받을 수 있어요'}
                </Text>
                <Text style={styles.subtitle}>
                  홈 하단의 '실시간통신' 탭을 눌러보세요!
                </Text>
              </View>

              {/* 이미지 placeholder — 자산 추후 채움 */}
              <View style={styles.imagePlaceholder} />

              {/* CTA */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.laterButton]}
                  activeOpacity={0.7}
                  onPress={onClose}>
                  <Text style={styles.laterButtonText}>나중에요</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.goButton]}
                  activeOpacity={0.7}
                  onPress={onPressGo}>
                  <Text style={styles.goButtonText}>실시간통신 바로가기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  closeBtn: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  closeBtnImg: {
    width: 24,
    height: 24,
  },
  titleWrap: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Galmuri11',
    fontSize: 18,
    color: '#0000CC',
    textAlign: 'center',
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: 'Galmuri11',
    fontSize: 13,
    color: '#0000CC',
    textAlign: 'center',
    marginTop: 8,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1.5,
    backgroundColor: '#FF44CC',
    borderRadius: 8,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  laterButton: {
    width: 120,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#0000CC',
    marginRight: 12,
  },
  laterButtonText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000CC',
  },
  goButton: {
    flex: 1,
    backgroundColor: '#0000CC',
  },
  goButtonText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: 'white',
  },
});
