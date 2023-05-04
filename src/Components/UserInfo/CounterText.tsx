import React from 'react';
import {StyleSheet, Text} from 'react-native';

type Props = {
  value: number;
  max: number;
};

export const Counter = React.memo(({value, max}: Props) => (
  <Text style={styles.counter}>
    {value} / {max}
  </Text>
));

const styles = StyleSheet.create({
  counter: {
    width: 50,
    fontSize: 13,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    marginHorizontal: 8,
    textAlign: 'right',
  },
});
