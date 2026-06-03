import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import type {ChatRoom} from '@type/types';
import {LinearGradient} from 'expo-linear-gradient';

interface Props {
  room: ChatRoom;
  onPress: (roomId: number, roomName: string) => void;
}

export const ChatRoomItem = ({room, onPress}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.roomTitle}>
        {room.name}
        <Text style={styles.participantCount}>
          {` (${room.participantCount}/${room.capacity})`}
        </Text>
      </Text>
      <TouchableOpacity
        style={styles.enterButton}
        activeOpacity={0.7}
        onPress={() => onPress(room.id, room.name)}>
        <LinearGradient
          colors={['#FF6ECE', '#FF3DBD']}
          style={styles.buttonBackground}>
          <Text style={styles.buttonText}>입장하기</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  roomTitle: {
    fontFamily: 'Galmuri11',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    flexShrink: 1,
  },
  participantCount: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    fontWeight: 'normal',
    color: 'white',
  },
  enterButton: {
    width: 75,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBackground: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Galmuri11',
    fontSize: 13,
    color: 'white',
  },
});
