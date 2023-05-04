import React from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';

const back_blue = require('@assets/back_blue.png');
const back_white = require('@assets/back_white.png');

type Props = {
  color: 'blue' | 'white';
  onPress: () => void;
};

const BackButtonImage = {
  blue: <Image source={back_blue} style={{height: 28, width: 28}} />,
  white: <Image source={back_white} style={{height: 28, width: 28}} />,
};

export const BackButton = ({color, onPress}: Props) => (
  <Pressable style={styles.backButton} onPress={onPress}>
    {BackButtonImage[color]}
  </Pressable>
);

const styles = StyleSheet.create({
  backButton: {
    width: 48,
  },
});
