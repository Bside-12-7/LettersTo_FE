import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../Constants/screen';

export function ModalBlur() {
  return <View style={styles.modalBlur} />;
}

const styles = StyleSheet.create({
  modalBlur: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#000000a0',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
});
