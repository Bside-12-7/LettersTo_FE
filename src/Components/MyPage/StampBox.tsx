import {withButtonClickEventLogger} from '@components/Button/withButtonClickEventLogger';
import React from 'react';
import {Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
const stampImg = require('@assets/Icon/stamp/stamps_blue.png');
const nextImg = require('@assets/Icon/next/next_blue.png');

type Props = {
  stampQuantity: number;
  onPress: () => void;
};

export const StampBoxWithoutLogger = React.memo(
  ({stampQuantity, onPress}: Props) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.btnStamp}
      onPress={onPress}>
      <Image source={stampImg} style={styles.stampImg} />
      <Text style={styles.stampTitle}>나의 보유 우표</Text>
      <Image source={nextImg} style={styles.nextImg} />
      <Text style={styles.stampQuantity}>{stampQuantity} 개</Text>
    </TouchableOpacity>
  ),
);

export const StampBox = withButtonClickEventLogger(StampBoxWithoutLogger);

const styles = StyleSheet.create({
  btnStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    marginHorizontal: 24,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  stampImg: {height: 24, width: 24, marginRight: 8},
  stampTitle: {fontFamily: 'Galmuri11', fontSize: 14, color: '#0000CC'},
  stampQuantity: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000CC',
    marginLeft: 'auto',
  },
  nextImg: {height: 20, width: 20, marginLeft: 2},
});
