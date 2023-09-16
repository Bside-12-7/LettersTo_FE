import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

const informationButtonImg = require('@assets/Icon/notice/notice.png');

interface Props {
  onPress: () => void;
}

export const RewardInformationButton = React.memo(({onPress}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.informationButton}>
      <Image
        style={styles.informationButtonImg}
        source={informationButtonImg}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  informationButton: {position: 'absolute', top: 13, right: 16},
  informationButtonImg: {
    height: 20,
    width: 20,
  },
});
