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
const promoImg = require('@assets/Image/chat/realtime_chat_promo.png');

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

              {/* 안내 이미지 */}
              <Image
                style={styles.promoImg}
                source={promoImg}
                resizeMode="cover"
              />

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
  promoImg: {
    width: '100%',
    // height 를 비워야 에셋 고유 높이(1016pt) 대신 aspectRatio 가 적용된다
    height: undefined,
    // 에셋 원본 비율(1372x1016) 유지 — 기기 너비에 맞춰 높이가 계산된다
    aspectRatio: 1372 / 1016,
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
