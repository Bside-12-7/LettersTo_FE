import React from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';

type Props = {
  alertOpacity: Animated.Value;
  max: number;
};

export const MaximumAlert = React.memo(({alertOpacity, max}: Props) => (
  <View style={styles.alertBox}>
    <Animated.View style={{opacity: alertOpacity}}>
      <Text style={styles.alertText}>최대 {max}개까지만 선택 가능해요!</Text>
    </Animated.View>
  </View>
));

const styles = StyleSheet.create({
  alertBox: {
    marginHorizontal: 24,
    marginVertical: 10,
  },
  alertText: {
    fontFamily: 'Galmuri11',
    color: '#ff44cc',
  },
});
