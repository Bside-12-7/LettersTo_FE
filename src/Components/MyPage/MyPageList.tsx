import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

type ListNameProps = {name: string};
type ListItemProps = {itmeName: string; onPress: () => void};

export const ListName = React.memo(({name}: ListNameProps) => {
  return (
    <View>
      <Text style={styles.nameText}>{name}</Text>
    </View>
  );
});

export const ListItem = React.memo(({itmeName, onPress}: ListItemProps) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.itemWrap}>
        <Text style={styles.itemText}>{itmeName}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  nameText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000cc',
    opacity: 0.5,
    marginBottom: 14,
  },
  itemWrap: {height: 35, justifyContent: 'center'},
  itemText: {fontFamily: 'Galmuri11', fontSize: 15, color: '#0000cc'},
});
