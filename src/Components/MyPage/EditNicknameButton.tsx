import React from 'react';
import {Pressable, Image, StyleSheet} from 'react-native';
const pencilImg = require('@assets/Icon/pencil/pencil_white.png');

type Props = {
  onPress: () => void;
};

export const EditNicknameButton = React.memo(({onPress}: Props) => (
  <Pressable onPress={onPress}>
    <Image source={pencilImg} style={styles.pencilImg} />
  </Pressable>
));

const styles = StyleSheet.create({
  pencilImg: {height: 24, width: 24, marginLeft: 4},
});
