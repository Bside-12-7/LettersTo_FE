import React, {useCallback, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BottomButton} from '@components/MyPage/BottomButton';
import {Header2} from '@components/Headers/Header2';
import {ModalBlur} from '@components/Modals/ModalBlur';
import {AccountDeleteModal} from '@components/Modals/MyPage/AccountDeleteModal';
import type {StackParamsList} from '@type/stackParamList';
import {withButtonClickEventLogger} from '@components/Button/withButtonClickEventLogger';
import {CLICK_BUTTON_EVENT_PARAMS} from '@constants/analytics';

const noticeImg = require('@assets/Icon/notice/notice_red.png');

type Props = NativeStackScreenProps<StackParamsList, 'AccountDelete'>;

const OKButton = ({onPress}: {onPress: () => void}) => (
  <BottomButton
    onPress={onPress}
    style={styles.buttonYes}
    textStyle={styles.buttonTextYes}>
    상관없어요
  </BottomButton>
);

const CancelButtonWithoutLogger = ({onPress}: {onPress: () => void}) => (
  <BottomButton
    onPress={onPress}
    style={styles.buttonNo}
    textStyle={styles.buttonTextNo}>
    한번 더 생각해볼게요
  </BottomButton>
);

const CancelButton = withButtonClickEventLogger(CancelButtonWithoutLogger);

export function AccountDelete({navigation}: Props) {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = useCallback(() => {
    return setModalVisible(!isModalVisible);
  }, [isModalVisible]);

  const goBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Header2 title={'탈퇴하기'} onPressBack={goBack} />
      <View style={styles.warning}>
        <Image source={noticeImg} style={styles.noticeImg} />
        <Text style={styles.warningText}>
          정말 탈퇴하시려면 아래 내용을{'\n'}한번 더 확인해주세요.
        </Text>
      </View>
      <View style={styles.notice1}>
        <Text style={styles.notice}>【탈퇴 시 계정이 사라져요】</Text>
        <Text style={styles.noticeDesc}>
          탈퇴 후 동일 소셜 로그인으로 가입해도 이전 편지내역{'\n'}및 연결은
          불가능해요.
        </Text>
      </View>
      <View style={styles.notice2}>
        <Text style={styles.notice}>【탈퇴 전 확인하세요】</Text>
        <Text style={styles.noticeDesc}>
          탈퇴 시 지급 및 구입한 우표는 모두 사라져요.{'\n'}탈퇴 시 개인정보가
          삭제되어 본인 확인이 어려워 작성{'\n'}한 편지는 편집 및 삭제가
          불가능해요.
        </Text>
      </View>
      <View style={styles.buttonWrap}>
        <OKButton onPress={toggleModal} />
        <CancelButton
          clickButtonEvent={CLICK_BUTTON_EVENT_PARAMS.CANCEL_SIGN_OUT}
          onPress={goBack}
        />
      </View>

      {isModalVisible && <ModalBlur />}
      <AccountDeleteModal
        hideModal={toggleModal}
        isModalVisible={isModalVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  warning: {flex: 1.5, justifyContent: 'center', alignItems: 'center'},
  noticeImg: {height: 24, width: 24},
  warningText: {
    fontFamily: 'Galmuri11',
    color: '#E10000',
    textAlign: 'center',
    fontSize: 12,
  },
  notice1: {flex: 1, paddingHorizontal: 36},
  notice2: {flex: 2, paddingHorizontal: 36},
  notice: {
    fontFamily: 'Galmuri11',
    fontSize: 18,
    color: '#0000cc',
    marginBottom: 12,
  },
  noticeDesc: {fontFamily: 'Galmuri11', fontSize: 12, color: '#0000cc'},
  buttonWrap: {
    height: 62,
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  buttonYes: {
    flex: 120,
    borderColor: '#0000cc',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextYes: {fontFamily: 'Galmuri11', fontSize: 14, color: '#0000cc'},
  buttonNo: {
    flex: 195,
    backgroundColor: '#0000cc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextNo: {fontFamily: 'Galmuri11', fontSize: 14, color: 'white'},
});
