import {ModalHeader} from '@components/Headers/ModalHeader';
import {
  InteractionManager,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CELL_COUNT = 6;

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

    const handleOnPress = () => {
      setContainerIsFocused(true);
      ref?.current?.focus();
    };

    const handleLongPress = () => {
      console.log('long pressed');
      setCode('12345');
    };

    const handleOnBlur = () => {
      setContainerIsFocused(false);
    };

    // Effects

    useEffect(() => {
      InteractionManager.runAfterInteractions(() => {
        setContainerIsFocused(true);
        ref?.current?.focus();
      });
    }, []);

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
            <Pressable
              onLongPress={handleLongPress}
              style={styles.inputsContainer}
              onPress={handleOnPress}>
              {codeDigitsArray.map(toDigitInput)}
            </Pressable>
            <TextInput
              ref={ref}
              value={code}
              onChangeText={setCode}
              onEndEditing={handleOnBlur}
              returnKeyType="done"
              textContentType="oneTimeCode"
              maxLength={CELL_COUNT}
              style={styles.hiddenCodeInput}
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
    width: 328,
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
