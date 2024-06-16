import {ModalHeader} from '@components/Headers/ModalHeader';
import {
  Image,
  InteractionManager,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {InvitationCodeNoticeModal} from './InvitationCodeNoticeModal';
import {ModalBlur} from '@components/Modals/ModalBlur';
import {BottomButton} from '@components/Button/Bottom/BottomButton';
import {InvitationCodeAlertModal} from './InvitationCodeAlertModal';
import {useMutation} from 'react-query';
import {applyInvitationCode} from '@apis/invitation';
import {AxiosError} from 'axios';
const questionsImg = require('@assets/question.png');

const CELL_COUNT = 6;
const INVALID_CODE_TEXT = '유효한 코드를 입력해주세요.';
const CODE_TIMEOUT_TEXT =
  '유효 기간이 지났어요 (´•̥ ᵔ •̥`)\n친구에게 새로운 코드를 요청해 주세요';

export const InvitationCodeInputModal = React.memo(
  ({
    receivedCode,
    onPressClose,
    isModalVisible,
  }: {
    receivedCode?: string;
    onPressClose: () => void;
    isModalVisible: boolean;
  }) => {
    const {top: SAFE_AREA_TOP, bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();
    const [isNoticeModalVisible, setNoticeModalVisible] = useState(false);
    const [alert, setAlert] = useState<string | null>(null);
    const [code, setCode] = useState(receivedCode ?? '');
    const [containerIsFocused, setContainerIsFocused] = useState(false);

    const codeDigitsArray = new Array(CELL_COUNT).fill(0);
    const ref = useRef<TextInput>(null);

    const toDigitInput = (_value: number, idx: number) => {
      const emptyInputChar = ' ';
      const digit = code?.[idx] || emptyInputChar;

      const isCurrentDigit = idx === code?.length;
      const isLastDigit = idx === CELL_COUNT - 1;
      const isCodeFull = code?.length === CELL_COUNT;

      const isFocused = isCurrentDigit || (isLastDigit && isCodeFull);
      const containerStyle =
        containerIsFocused && isFocused
          ? [styles.codeInputCellContainer, styles.inputContainerFocused]
          : styles.codeInputCellContainer;
      return (
        <View key={idx} style={containerStyle}>
          <Text
            style={{
              fontFamily: 'Galmuri11',
              color: digit === ' ' ? '#0000cc50' : '#0000cc',
              fontWeight: '700',
              fontSize: 32,
            }}>
            {digit === ' ' ? '*' : digit}
          </Text>
        </View>
      );
    };

    const {mutate} = useMutation((invitationCode: string) =>
      applyInvitationCode(invitationCode),
    );

    const handleChangeCodeInput = (inputCode: string) => {
      if (inputCode !== '' && !/^[0-9a-z]+$/.test(inputCode)) return;
      setCode(inputCode);
    };

    const handleOnPress = () => {
      setContainerIsFocused(true);
      ref?.current?.focus();
    };

    const handleOnBlur = () => {
      setContainerIsFocused(false);
    };

    const handleSubmit = () => {
      if (code.length !== 6 || !/^[0-9a-z]+$/.test(code))
        return setAlert(INVALID_CODE_TEXT);

      mutate(code, {
        onSuccess: () => {
          // Todo 친구 리스트 query 초기화
          onPressClose();
        },
        onError: error => {
          const axiosError = error as AxiosError<{message: string}>;
          setAlert(
            axiosError.response?.data?.message.includes('유효기간')
              ? CODE_TIMEOUT_TEXT
              : INVALID_CODE_TEXT,
          );
        },
      });
    };

    useEffect(() => {
      InteractionManager.runAfterInteractions(() => {
        if (receivedCode) return;
        setContainerIsFocused(true);
        ref?.current?.focus();
      });
    }, [receivedCode]);

    return (
      <Modal
        statusBarTranslucent={true} // android
        animationType="slide"
        transparent={true}
        onRequestClose={onPressClose}
        visible={isModalVisible}>
        <View style={styles.container}>
          <View
            style={[
              styles.modalView,
              {
                marginTop: SAFE_AREA_TOP,
                paddingBottom: SAFE_AREA_BOTTOM,
              },
            ]}>
            <ModalHeader onPressClose={onPressClose} title={'친구 추가하기'} />
            <View style={{flex: 1, padding: 24}}>
              <Text
                style={{
                  fontFamily: 'Galmuri11',
                  fontSize: 18,
                  fontWeight: '400',
                  color: '#0000CC',
                  marginBottom: 24,
                }}>
                친구의 코드를 입력해주세요
                <TouchableWithoutFeedback
                  onPress={() => {
                    setNoticeModalVisible(true);
                  }}>
                  <Image
                    source={questionsImg}
                    style={{height: 20, width: 20}}
                  />
                </TouchableWithoutFeedback>
              </Text>
              <Pressable style={styles.inputsContainer} onPress={handleOnPress}>
                {codeDigitsArray.map(toDigitInput)}
              </Pressable>
              <TextInput
                ref={ref}
                value={code}
                onChangeText={handleChangeCodeInput}
                onEndEditing={handleOnBlur}
                returnKeyType="done"
                textContentType="oneTimeCode"
                maxLength={CELL_COUNT}
                style={styles.hiddenCodeInput}
              />
            </View>
            <BottomButton buttonText={'등록하기'} onPress={handleSubmit} />
          </View>
        </View>
        {(isNoticeModalVisible || !!alert) && <ModalBlur />}
        <InvitationCodeNoticeModal
          isModalVisible={isNoticeModalVisible}
          onPressClose={() => setNoticeModalVisible(false)}
        />
        <InvitationCodeAlertModal
          isModalVisible={!!alert}
          text={alert}
          onPressClose={() => setAlert(null)}
        />
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
    flex: 1,
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
  inputsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  inputContainerFocused: {
    borderColor: 'blue',
  },
  hiddenCodeInput: {
    position: 'absolute',
    height: 0,
    width: 0,
    opacity: 0,
  },
  codeInputCellContainer: {
    height: 60,
    width: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0000CC',
    borderWidth: 1,
  },
});
