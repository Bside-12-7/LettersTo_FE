import { ToggleButton } from '@components/ToggleButton/ToggleButton';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type ListNameProps = {name: string};
type ListItemProps = {
  itemName: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description: string;
};

export function NotificationListName({name}: ListNameProps) {
  return (
    <View>
      <Text style={styles.nameText}>{name}</Text>
    </View>
  );
}

export function NotificationListItem({
  itemName,
  description,
  value,
  onChange,
}: ListItemProps) {
  return (
    <View style={styles.itemWrap}>
      <View
        style={{
          marginBottom: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.itemText}>{itemName}</Text>
        <ToggleButton value={value} onChange={onChange} />
      </View>
      <Text style={styles.descriptionText}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nameText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000cc',
    opacity: 0.5,
    marginBottom: 18,
  },
  itemWrap: {marginBottom: 8},
  itemText: {fontFamily: 'Galmuri11', fontSize: 14, color: '#0000cc'},
  descriptionText: {
    fontFamily: 'Galmuri11',
    fontSize: 11,
    color: '#0000cc',
    lineHeight: 20,
    opacity: 0.5,
  },
});
