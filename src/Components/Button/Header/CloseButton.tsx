import React from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';

const closeImg = require('@assets/Icon/close/close_blue.png');

type Props = {
  onPress: () => void;
};

export const CloseButton = ({onPress}: Props) => (
  <Pressable onPress={onPress}>
    <Image source={closeImg} style={styles.closeButton} />
  </Pressable>
);

const styles = StyleSheet.create({
  closeButton: {height: 28, width: 28},
});
