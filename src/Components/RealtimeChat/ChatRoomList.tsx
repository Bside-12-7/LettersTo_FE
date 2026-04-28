import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {ChatRoomItem} from './ChatRoomItem';
import type {ChatRoom} from '@type/types';

interface Props {
  rooms: ChatRoom[];
  onPressRoom: (roomId: number) => void;
}

export const ChatRoomList = ({rooms, onPressRoom}: Props) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {rooms.map((room, index) => (
        <View key={room.id} style={index > 0 && styles.itemWrapper}>
          <ChatRoomItem room={room} onPress={onPressRoom} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  itemWrapper: {
    marginTop: 12,
  },
});
