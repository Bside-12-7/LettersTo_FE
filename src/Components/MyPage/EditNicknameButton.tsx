import React from 'react';
import {Image, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {withButtonClickEventLogger} from '@components/Button/withButtonClickEventLogger';

const pencilImg = require('@assets/Icon/pencil/pencil_white.png');

type Props = {
  onPress: () => void;
};

const EditNicknameButtonWithoutLogger = React.memo(({onPress}: Props) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <Image source={pencilImg} style={styles.pencilImg} />
  </TouchableWithoutFeedback>
));

export const EditNicknameButton = withButtonClickEventLogger<Props>(
  EditNicknameButtonWithoutLogger,
);

const styles = StyleSheet.create({
  pencilImg: {height: 24, width: 24, marginLeft: 4},
});
