import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CloseButton} from '../Button/Header/CloseButton';

type Props = {
  title: string;
  onPressClose: () => void;
};

export const ModalHeader = React.memo(({title, onPressClose}: Props) => (
  <View style={styles.header}>
    <CloseButton onPress={onPressClose} />
    <Text style={styles.title}>{title}</Text>
    <View style={styles.headerBlank} />
  </View>
));

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Galmuri11',
    fontSize: 15,
    color: '#0000cc',
  },
  headerBlank: {width: 28},
});
