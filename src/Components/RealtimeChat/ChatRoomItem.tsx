import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import type {ChatRoom} from '@type/types';
import {LinearGradient} from 'expo-linear-gradient';

interface Props {
  room: ChatRoom;
  onPress: (roomId: number, roomName: string) => void;
}

const getCongestionLabel = (congestion: ChatRoom['congestion']) => {
  switch (congestion) {
    case 'HIGH':
      return '혼잡';
    case 'MEDIUM':
      return '보통';
    case 'LOW':
      return '여유';
  }
};

const getCongestionColor = (congestion: ChatRoom['congestion']) => {
  switch (congestion) {
    case 'HIGH':
      return 'red';
    case 'MEDIUM':
      return 'yellow';
    case 'LOW':
      return '#89f500';
  }
};

export const ChatRoomItem = ({room, onPress}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text
          style={[
            styles.statusLabel,
            {color: getCongestionColor(room.congestion)},
          ]}>
          {getCongestionLabel(room.congestion)}
        </Text>
        <Text style={styles.roomTitle}>{room.name}</Text>
      </View>
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
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontFamily: 'Galmuri11',
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 6,
  },
  roomTitle: {
    fontFamily: 'Galmuri11',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  enterButton: {
    width: 75,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
