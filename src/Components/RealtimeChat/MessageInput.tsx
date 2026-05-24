import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';

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
            {/* 이미지 아이콘 자리 */}
          </Pressable>
          <Pressable
            style={[styles.toolButton, texticonMode && styles.toolButtonActive]}
            onPress={onPressTexticon}
            disabled={disabled}
            hitSlop={8}>
            {/* 텍스티콘 아이콘 자리 */}
          </Pressable>
        </View>

        <View style={styles.inputRow}>
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
            editable={!disabled}
          />
          <Pressable
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            onPress={onSend}
            disabled={!canSend}>
            {disabled ? <ActivityIndicator size="small" color="white" /> : null}
            {/* 발송 아이콘 자리 */}
          </Pressable>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0000AA',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toolButtonActive: {
    opacity: 0.6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000CC',
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF44CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ffffff40',
  },
});
