import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  Text,
} from 'react-native';

const keyboardIcon = require('@assets/Icon/KeyboardDismiss/keyboard_dismiss_blue.png');
const imageIcon = require('@assets/Icon/Image/image_white.png');
const arrowUpIcon = require('@assets/arrow_up_white.png');

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onPressImage: () => void;
  onPressTexticon: () => void;
  texticonMode: boolean;
  disabled: boolean;
  inputRef: React.RefObject<TextInput>;
  onSelectionChange: (event: any) => void;
}

export const MessageInput = React.memo(
  ({
    value,
    onChangeText,
    onSend,
    onPressImage,
    onPressTexticon,
    texticonMode,
    disabled,
    inputRef,
    onSelectionChange,
  }: Props) => {
    const canSend = value.trim().length > 0 && !disabled;

    return (
      <View style={styles.container}>
        <View style={styles.toolRow}>
          <Pressable
            style={styles.toolButton}
            onPress={onPressImage}
            disabled={disabled}
            hitSlop={8}>
            <Image source={imageIcon} style={{height: 24, width: 24}} />
          </Pressable>
          <Pressable
            style={[styles.toolButton]}
            onPress={onPressTexticon}
            disabled={disabled}
            hitSlop={8}>
            <Text
              style={{
                fontFamily: 'Galmuri11',
                fontSize: 18,
                color: '#ffffff',
              }}>
              (˙∇˙)
            </Text>
          </Pressable>
        </View>

        <View style={styles.inputRow}>
          <View
            style={[
              styles.inputWrapper,
              texticonMode && styles.inputWrapperWithIcon,
            ]}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={value}
              onChangeText={onChangeText}
              onSelectionChange={onSelectionChange}
              placeholder="메시지 입력"
              placeholderTextColor="#999999"
              multiline
              maxLength={500}
              showSoftInputOnFocus={!texticonMode}
            />
            {texticonMode && (
              <Pressable
                style={styles.keyboardReturn}
                onPress={onPressTexticon}
                hitSlop={8}>
                <Image
                  source={keyboardIcon}
                  style={styles.keyboardReturnIcon}
                />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[styles.sendButton]}
            onPress={onSend}
            disabled={!canSend}>
            {disabled ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Image
                source={arrowUpIcon}
                style={{
                  height: 12,
                  width: 9,
                }}
              />
            )}
          </Pressable>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0000CC',
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toolButton: {
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 6,
    minHeight: 44,
    justifyContent: 'center',
  },
  inputWrapperWithIcon: {
    paddingRight: 48,
  },
  input: {
    padding: 0,
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000CC',
    maxHeight: 88,
  },
  keyboardReturn: {
    position: 'absolute',
    right: 10,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardReturnIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  sendButton: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FF44CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
