import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Props = {
  title: string;
};

export const Title = React.memo(({title}: Props) => (
  <View style={styles.titleWrap}>
    {title.split('\n').map((titleText, index) => (
      <Text key={index} style={styles.titleText}>
        {titleText}
      </Text>
    ))}
  </View>
));

const styles = StyleSheet.create({
  titleWrap: {
    height: 100,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    marginTop: 8,
  },
});
